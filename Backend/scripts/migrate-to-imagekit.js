#!/usr/bin/env node
/**
 * migrate-to-imagekit.js — Upload local songs & posters to ImageKit.
 *
 * Reads every song in MongoDB whose url/posterUrl still points to a local
 * path (e.g. /songs/Foo.mp3) and uploads the corresponding file to
 * ImageKit, then updates the database record with the cloud URL.
 *
 * IDEMPOTENT:
 *   - Songs already on ImageKit (URLs starting with http/https) are skipped.
 *   - If a file was partially uploaded previously the script picks up where
 *     it left off (each song is updated independently).
 *
 * Usage:   node scripts/migrate-to-imagekit.js
 * Env:     requires MONGO_URI, IMAGEKIT_PRIVATE_KEY in Backend/.env
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const ImageKit = require("@imagekit/nodejs").default;
const songModel = require("../src/models/song.model");

/* ── Config ────────────────────────────────────────────────── */

const SONGS_DIR = path.join(__dirname, "../../songs");
const POSTERS_DIR = path.join(__dirname, "../../posters");

const AUDIO_FOLDER = "/cohort-2/moodify/songs";
const POSTER_FOLDER = "/cohort-2/moodify/posters";

/* ── ImageKit client (same pattern as storage.service.js) ──── */

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

/* ── Helpers ────────────────────────────────────────────────── */

function isCloudUrl(url) {
    return url && /^https?:\/\//.test(url);
}

function sanitizeFilename(name) {
    return name.replace(/[^a-zA-Z0-9_\- ]/g, "_").substring(0, 120);
}

async function uploadToImageKit({ buffer, filename, folder }) {
    const file = await imagekit.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer)),
        fileName: filename,
        folder,
    });
    return file;
}

/* ── Main ───────────────────────────────────────────────────── */

async function migrate() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.\n");

    const songs = await songModel.find();
    console.log(`Total songs in DB: ${songs.length}\n`);

    let skipped = 0;
    let audioUploaded = 0;
    let posterUploaded = 0;
    let audioFailed = 0;
    let posterFailed = 0;

    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const label = `[${i + 1}/${songs.length}] "${song.title}"`;
        const updates = {};

        // ── Audio URL ──────────────────────────────────────
        if (isCloudUrl(song.url)) {
            // Already on ImageKit — nothing to do
        } else if (song.url && song.url.startsWith("/songs/")) {
            // Local path like "/songs/Song Title.mp3" → extract filename
            const filename = decodeURIComponent(song.url.replace("/songs/", ""));
            const filePath = path.join(SONGS_DIR, filename);

            if (!fs.existsSync(filePath)) {
                console.log(`  ⚠  ${label} — local file not found: ${filePath}`);
                audioFailed++;
                continue;
            }

            try {
                const buffer = fs.readFileSync(filePath);
                const ikFile = await uploadToImageKit({
                    buffer,
                    filename,
                    folder: AUDIO_FOLDER,
                });
                updates.url = ikFile.url;
                audioUploaded++;
                console.log(`  ✓  ${label} — audio uploaded`);
            } catch (err) {
                console.error(`  ✗  ${label} — audio upload failed: ${err.message}`);
                audioFailed++;
                continue; // don't update DB on failure
            }
        } else {
            // Unknown URL format — skip
            skipped++;
            continue;
        }

        // ── Poster URL ─────────────────────────────────────
        if (isCloudUrl(song.posterUrl)) {
            // Already on ImageKit
        } else if (song.posterUrl && song.posterUrl.startsWith("/posters/")) {
            const filename = decodeURIComponent(song.posterUrl.replace("/posters/", ""));
            const filePath = path.join(POSTERS_DIR, filename);

            if (!fs.existsSync(filePath)) {
                console.log(`  ⚠  ${label} — local poster not found: ${filePath}`);
                posterFailed++;
                // Still update audio URL if we got one
            } else {
                try {
                    const buffer = fs.readFileSync(filePath);
                    const ikFile = await uploadToImageKit({
                        buffer,
                        filename,
                        folder: POSTER_FOLDER,
                    });
                    updates.posterUrl = ikFile.url;
                    posterUploaded++;
                    console.log(`  ✓  ${label} — poster uploaded`);
                } catch (err) {
                    console.error(`  ✗  ${label} — poster upload failed: ${err.message}`);
                    posterFailed++;
                }
            }
        } else {
            // Unknown poster format — skip poster but keep going
        }

        // ── Update DB if we have any new URLs ──────────────
        if (Object.keys(updates).length > 0) {
            await songModel.updateOne({ _id: song._id }, { $set: updates });
        }
    }

    // ── Final report ──────────────────────────────────────
    const finalCount = await songModel.countDocuments();
    const cloudAudio = await songModel.countDocuments({ url: { $regex: "^https?://" } });
    const cloudPoster = await songModel.countDocuments({ posterUrl: { $regex: "^https?://" } });

    console.log("\n=== MIGRATION COMPLETE ===");
    console.log(`  Total songs in DB:      ${finalCount}`);
    console.log(`  Audio uploaded:         ${audioUploaded}`);
    console.log(`  Poster uploaded:        ${posterUploaded}`);
    console.log(`  Audio failed:           ${audioFailed}`);
    console.log(`  Poster failed:          ${posterFailed}`);
    console.log(`  Skipped (unknown URL):  ${skipped}`);
    console.log(`  Songs with cloud audio: ${cloudAudio}/${finalCount}`);
    console.log(`  Songs with cloud poster: ${cloudPoster}/${finalCount}`);
    console.log("===========================\n");

    await mongoose.disconnect();
    console.log("Done.");
}

migrate().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
