import { createContext, useState, useMemo, useEffect } from "react";
import { getAllSongs } from "./service/song.api";

const RECENTLY_PLAYED_KEY = "moodify_recently_played";
const CURRENT_SONG_KEY = "moodify_current_song";
const MAX_RECENT = 5;

function loadRecentlyPlayed() {
    try {
        const raw = localStorage.getItem(RECENTLY_PLAYED_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveRecentlyPlayed(list) {
    try {
        localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(list));
    } catch { /* ignore quota errors */ }
}

function loadCurrentSong() {
    try {
        const raw = localStorage.getItem(CURRENT_SONG_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveCurrentSong(song) {
    try {
        if (song) {
            localStorage.setItem(CURRENT_SONG_KEY, JSON.stringify(song));
        } else {
            localStorage.removeItem(CURRENT_SONG_KEY);
        }
    } catch { /* ignore quota errors */ }
}

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
    // Master song list from API
    const [allSongs, setAllSongs] = useState([]);

    // Current expression/mood filter (null = no filter, show all)
    const [currentMood, setCurrentMood] = useState(null);

    // Search query
    const [searchQuery, setSearchQuery] = useState("");

    // Currently playing song + index in the filtered list
    // Restore from localStorage so the player survives page refresh
    const [currentSong, setCurrentSong] = useState(loadCurrentSong);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // Whether audio is currently playing (lifted from Player so AlbumCard visualizer can use it)
    const [isPlaying, setIsPlaying] = useState(false);

    // Auto-play flag: set to true to tell Player to auto-play the next song
    const [autoPlay, setAutoPlay] = useState(false);

    // Loading states
    const [loading, setLoading] = useState(false);
    const [songsLoading, setSongsLoading] = useState(true);

    // Recently played songs (persisted in localStorage)
    const [recentlyPlayed, setRecentlyPlayed] = useState(loadRecentlyPlayed);

    // Reset playback state on mount so UI doesn't show stale "Playing" after refresh
    useEffect(() => {
        setIsPlaying(false);
        setAutoPlay(false);
    }, []);

    // Persist currentSong to localStorage whenever it changes
    useEffect(() => {
        saveCurrentSong(currentSong);
    }, [currentSong]);

    // Fetch all songs once on mount so every page has them
    useEffect(() => {
        let cancelled = false;
        async function fetchAll() {
            setSongsLoading(true);
            try {
                const data = await getAllSongs();
                if (!cancelled) {
                    // Deduplicate: two songs are the same if they share
                    // the same _id OR the same url (catches re-uploads)
                    const raw = data.songs || [];
                    const seenIds = new Set();
                    const seenUrls = new Set();
                    const unique = [];
                    for (const s of raw) {
                        const id = s._id;
                        const url = s.url;
                        const isDupe = (id && seenIds.has(id)) || (url && seenUrls.has(url));
                        if (!isDupe) {
                            if (id) seenIds.add(id);
                            if (url) seenUrls.add(url);
                            unique.push(s);
                        }
                    }
                    setAllSongs(unique);
                    if (process.env.NODE_ENV !== 'production') {
                        console.log(`[Moodify] API returned ${raw.length} songs, ${unique.length} unique`);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch songs:", error.message);
                if (!cancelled) {
                    setAllSongs([]);
                }
            } finally {
                if (!cancelled) {
                    setSongsLoading(false);
                }
            }
        }
        fetchAll();
        return () => { cancelled = true; };
    }, []);

    // Add song to recently played (dedup, most-recent first, max 5)
    function addToRecentlyPlayed(song) {
        if (!song) return;
        const entry = {
            _id: song._id,
            title: song.title,
            artist: song.artist || "",
            album: song.album || "",
            mood: song.mood,
            posterUrl: song.posterUrl,
            url: song.url,
        };
        setRecentlyPlayed((prev) => {
            // Remove any existing entry with same _id OR same url
            const filtered = prev.filter(
                (s) => s._id !== entry._id && s.url !== entry.url
            );
            const updated = [entry, ...filtered].slice(0, MAX_RECENT);
            saveRecentlyPlayed(updated);
            return updated;
        });
    }

    // Clear the current player (X button)
    // Setting currentSong to null removes the <audio> element from DOM, stopping playback
    function clearCurrentSong() {
        setCurrentSong(null);
        setCurrentIndex(-1);
        setIsPlaying(false);
        setAutoPlay(false);
    }

    // Legacy: keep "song" working for backward compat (points to currentSong)
    const song = currentSong;
    const setSong = setCurrentSong;

    // Derived: filtered songs based on mood + search
    const filteredSongs = useMemo(() => {
        let result = allSongs;

        // Step 1: Filter by mood if active
        if (currentMood) {
            result = result.filter(
                (s) => s.mood && s.mood.toLowerCase() === currentMood.toLowerCase()
            );
        }

        // Step 2: Search within the mood-filtered (or all) list
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (s) =>
                    (s.title && s.title.toLowerCase().includes(q)) ||
                    (s.mood && s.mood.toLowerCase().includes(q))
            );
        }

        return result;
    }, [allSongs, currentMood, searchQuery]);

    return (
        <SongContext.Provider
            value={{
                // Master list (read-only from components — set only by the provider)
                allSongs,

                // Mood filter
                currentMood,
                setCurrentMood,

                // Search
                searchQuery,
                setSearchQuery,

                // Current song + index
                currentSong,
                setCurrentSong,
                currentIndex,
                setCurrentIndex,

                // Playback state (lifted from Player)
                isPlaying,
                setIsPlaying,

                // Auto-play
                autoPlay,
                setAutoPlay,

                // Recently played
                recentlyPlayed,
                addToRecentlyPlayed,

                // Close player
                clearCurrentSong,

                // Derived
                filteredSongs,

                // Loading
                loading,
                setLoading,
                songsLoading,
                setSongsLoading,

                // Legacy compat
                song,
                setSong,
            }}
        >
            {children}
        </SongContext.Provider>
    );
};
