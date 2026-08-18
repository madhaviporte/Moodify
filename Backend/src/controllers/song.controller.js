const songModel = require("../models/song.model");
const storageService = require("../services/storage.service");
const id3 = require("node-id3");

async function uploadSong(req, res) {
    if (!req.file) {
        return res.status(400).json({ message: "No song file provided. Upload a file with field name 'song'." });
    }

    const songBuffer = req.file.buffer;
    const { mood } = req.body;

    if (!mood) {
        return res.status(400).json({ message: "Mood is required" });
    }

    const tags = id3.read(songBuffer);

    if (!tags.title) {
        return res.status(400).json({ message: "MP3 file must have an embedded title tag" });
    }

    if (!tags.image || !tags.image.imageBuffer) {
        return res.status(400).json({ message: "MP3 file must have embedded artwork" });
    }

    const [songFile, posterFile] = await Promise.all([
        storageService.uploadFile({
            buffer: songBuffer,
            filename: tags.title + ".mp3",
            folder: "/cohort-2/moodify/songs"
        }),
        storageService.uploadFile({
            buffer: tags.image.imageBuffer,
            filename: tags.title + ".jpeg",
            folder: "/cohort-2/moodify/posters"
        })
    ]);

    const song = await songModel.create({
        title: tags.title,
        url: songFile.url,
        posterUrl: posterFile.url,
        mood
    });

    res.status(201).json({
        message: "Song created successfully.",
        song
    });
}

async function getSong(req, res) {
    const { mood } = req.query;

    if (!mood) {
        return res.status(400).json({ message: "Mood query parameter is required" });
    }

    // Use aggregation pipeline to pick a random song for the given mood
    const songs = await songModel.aggregate([
        { $match: { mood } },
        { $sample: { size: 1 } }
    ]);

    const song = songs.length > 0 ? songs[0] : null;

    res.status(200).json({
        message: "Song fetched successfully.",
        song
    });
}

module.exports = { uploadSong, getSong };