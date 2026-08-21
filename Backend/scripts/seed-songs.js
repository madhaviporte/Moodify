#!/usr/bin/env node
/**
 * seed-songs.js — Import the filesystem songs/ folder into MongoDB.
 *
 * Reads ID3 metadata from each MP3 (title, artist, album, artwork).
 * Matches against existing MongoDB records by title.
 *   - Existing records: updates url to local path, fills in artist/album if missing
 *   - Missing songs: creates new record with local URL and "neutral" mood
 *
 * Usage:  node scripts/seed-songs.js
 * Env:    requires MONGO_URI in Backend/.env
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const id3 = require("node-id3");

const songModel = require("../src/models/song.model");

const SONGS_DIR = path.join(__dirname, "../../songs");
const POSTERS_DIR = path.join(__dirname, "../../posters");
const MOODS = ["sad", "happy", "surprised", "neutral"];

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9_\- ]/g, "_").substring(0, 120);
}

async function seed() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    fs.mkdirSync(POSTERS_DIR, { recursive: true });

    // --- 1. Read all MP3 files and extract ID3 metadata ---
    const files = fs.readdirSync(SONGS_DIR).filter((f) => f.endsWith(".mp3"));
    console.log(`Found ${files.length} MP3 files in songs/ folder.\n`);

    const localSongs = [];
    for (const file of files) {
        const filePath = path.join(SONGS_DIR, file);
        try {
            const buffer = fs.readFileSync(filePath);
            const tags = id3.read(buffer);

            const title = (tags.title && tags.title.trim()) || null;
            if (!title) {
                console.log(`  SKIP (no title): ${file}`);
                continue;
            }

            const artist = (tags.artist && tags.artist.trim()) || "";
            const album = (tags.album && tags.album.trim()) || "";

            localSongs.push({
                file,
                filePath,
                title,
                artist,
                album,
                hasArtwork: !!(tags.image && tags.image.imageBuffer),
                artworkBuffer: tags.image ? tags.image.imageBuffer : null,
            });
        } catch (err) {
            console.error(`  ERROR reading ${file}: ${err.message}`);
        }
    }

    console.log(`Parsed ${localSongs.length} songs with ID3 metadata.\n`);

    // --- 2. Load existing MongoDB records ---
    const existingSongs = await songModel.find();
    const existingByTitle = new Map();
    for (const s of existingSongs) {
        existingByTitle.set(s.title.toLowerCase().trim(), s);
    }
    console.log(`Existing songs in MongoDB: ${existingSongs.length}\n`);

    // --- 3. Process each local song ---
    let updated = 0;
    let inserted = 0;
    let artworkSaved = 0;

    for (const local of localSongs) {
        const key = local.title.toLowerCase().trim();
        const existing = existingByTitle.get(key);

        // Save artwork to local file
        let posterUrl = "/posters/default.jpeg";
        if (local.hasArtwork && local.artworkBuffer) {
            const artFilename = sanitizeFilename(local.title) + ".jpeg";
            const artPath = path.join(POSTERS_DIR, artFilename);
            fs.writeFileSync(artPath, local.artworkBuffer);
            posterUrl = "/posters/" + artFilename;
            artworkSaved++;
        }

        const audioUrl = "/songs/" + local.file;

        if (existing) {
            // Update existing record: set local audio URL, fill in artist/album
            const updates = {};
            if (existing.url !== audioUrl) updates.url = audioUrl;
            if (!existing.artist && local.artist) updates.artist = local.artist;
            if (!existing.album && local.album) updates.album = local.album;
            if (existing.posterUrl !== posterUrl && local.hasArtwork) updates.posterUrl = posterUrl;

            if (Object.keys(updates).length > 0) {
                await songModel.updateOne({ _id: existing._id }, { $set: updates });
                updated++;
                process.stdout.write(`  [UPD] "${local.title}"\n`);
            }
        } else {
            // Insert new record
            const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
            await songModel.create({
                title: local.title,
                artist: local.artist,
                album: local.album,
                url: audioUrl,
                posterUrl,
                mood,
            });
            inserted++;
            process.stdout.write(`  [NEW] "${local.title}" (${mood})\n`);
        }
    }

    // --- 4. Deduplicate by title (keep first, remove rest) ---
    console.log("\nChecking for duplicate titles...");
    const allSongs = await songModel.find().sort({ _id: 1 });
    const seenTitles = new Map();
    const dupesToRemove = [];
    for (const s of allSongs) {
        const t = s.title.toLowerCase().trim();
        if (seenTitles.has(t)) {
            dupesToRemove.push(s._id);
        } else {
            seenTitles.set(t, s._id);
        }
    }
    if (dupesToRemove.length > 0) {
        await songModel.deleteMany({ _id: { $in: dupesToRemove } });
        console.log(`Removed ${dupesToRemove.length} duplicate(s).`);
    } else {
        console.log("No duplicates found.");
    }

    // --- 5. Report ---
    const finalCount = await songModel.countDocuments();
    console.log("\n=== SEED COMPLETE ===");
    console.log(`  MP3 files on disk:     ${files.length}`);
    console.log(`  Parsed with metadata:  ${localSongs.length}`);
    console.log(`  Existing in DB:        ${existingSongs.length}`);
    console.log(`  Updated (local URL):   ${updated}`);
    console.log(`  New songs inserted:    ${inserted}`);
    console.log(`  Artwork saved:         ${artworkSaved}`);
    console.log(`  Duplicates removed:    ${dupesToRemove.length}`);
    console.log(`  Total songs in DB:     ${finalCount}`);
    console.log("======================\n");

    await mongoose.disconnect();
    console.log("Done.");
}

seed().catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
});
