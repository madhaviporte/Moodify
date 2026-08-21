import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
    const context = useContext(SongContext);
    const {
        allSongs,
        currentMood, setCurrentMood,
        searchQuery, setSearchQuery,
        currentSong, setCurrentSong,
        currentIndex, setCurrentIndex,
        isPlaying, setIsPlaying,
        autoPlay, setAutoPlay,
        recentlyPlayed, addToRecentlyPlayed,
        clearCurrentSong,
        filteredSongs,
        loading, setLoading,
        songsLoading,
    } = context;

    // Legacy: fetch one random song for a mood
    async function handleGetSong({ mood }) {
        setLoading(true);
        try {
            const data = await getSong({ mood });
            if (data.song) {
                setCurrentSong(data.song);
            }
        } catch (error) {
            console.error("Failed to fetch song:", error.message);
        } finally {
            setLoading(false);
        }
    }

    // Set the active mood filter
    function setMood(mood) {
        const normalized = mood ? mood.toLowerCase() : null;
        setCurrentMood(normalized);
        setCurrentIndex(-1);
        setCurrentSong(null);
    }

    function clearMood() {
        setCurrentMood(null);
        setCurrentIndex(-1);
        setCurrentSong(null);
    }

    function setSearch(query) {
        setSearchQuery(query);
        setCurrentIndex(-1);
    }

    // Play a specific song — sets autoPlay so Player starts playing
    function playSong(song) {
        const idx = filteredSongs.findIndex(
            (s) => s._id === song._id || s.url === song.url
        );
        setCurrentSong(song);
        setCurrentIndex(idx >= 0 ? idx : -1);
        setAutoPlay(true);
    }

    // Play song at a specific index
    function playSongAtIndex(index) {
        if (index >= 0 && index < filteredSongs.length) {
            setCurrentSong(filteredSongs[index]);
            setCurrentIndex(index);
            setAutoPlay(true);
        }
    }

    // Next/Prev within filtered list
    function nextSong() {
        if (filteredSongs.length === 0) return;
        const nextIdx = currentIndex + 1;
        if (nextIdx < filteredSongs.length) {
            setCurrentSong(filteredSongs[nextIdx]);
            setCurrentIndex(nextIdx);
            setAutoPlay(true);
        } else {
            setCurrentSong(filteredSongs[0]);
            setCurrentIndex(0);
            setAutoPlay(true);
        }
    }

    function prevSong() {
        if (filteredSongs.length === 0) return;
        const prevIdx = currentIndex - 1;
        if (prevIdx >= 0) {
            setCurrentSong(filteredSongs[prevIdx]);
            setCurrentIndex(prevIdx);
            setAutoPlay(true);
        } else {
            const lastIdx = filteredSongs.length - 1;
            setCurrentSong(filteredSongs[lastIdx]);
            setCurrentIndex(lastIdx);
            setAutoPlay(true);
        }
    }

    return {
        allSongs,
        filteredSongs,
        currentSong,
        currentIndex,
        currentMood,
        searchQuery,
        isPlaying,
        autoPlay,
        recentlyPlayed,
        clearCurrentSong,
        loading,
        songsLoading,
        handleGetSong,
        setMood,
        clearMood,
        setSearch,
        playSong,
        playSongAtIndex,
        nextSong,
        prevSong,
        setIsPlaying,
        addToRecentlyPlayed,
    };
};
