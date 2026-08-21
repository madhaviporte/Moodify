import React, { useEffect } from "react";
// Songs are fetched once in SongContextProvider
import { useSong } from "../../hooks/useSong";
import AlbumCard from "./AlbumCard";
import "./AlbumReleases.scss";

const moodLabels = {
  happy: "Happy Songs",
  sad: "Sad Songs",
  surprised: "Surprised Songs",
  neutral: "Neutral Songs",
};

const AlbumReleases = () => {
  const {
    allSongs,
    filteredSongs,
    currentMood,
    searchQuery,
    currentSong,
    songsLoading,
    playSong,
    playSongAtIndex,
  } = useSong();

  // Auto-play first song when mood changes and filtered list has songs
  useEffect(() => {
    if (currentMood && filteredSongs.length > 0 && !currentSong) {
      playSongAtIndex(0);
    }
  }, [currentMood, filteredSongs.length]);

  // Determine the section title
  let sectionTitle = "All Songs";
  let sectionSubtitle = "Browse the complete Moodify library";

  if (currentMood) {
    sectionTitle = moodLabels[currentMood] || `${currentMood} Songs`;
    sectionSubtitle = `Showing songs matching your detected mood`;
  }

  if (searchQuery.trim()) {
    sectionTitle = "Search Results";
    sectionSubtitle = `Results for "${searchQuery}"${currentMood ? ` in ${sectionTitle === "Search Results" ? moodLabels[currentMood] || currentMood : ""}` : ""}`;
    if (currentMood && searchQuery.trim()) {
      sectionSubtitle = `Results for "${searchQuery}" within ${moodLabels[currentMood] || currentMood}`;
    }
  }

  // Loading state
  if (songsLoading) {
    return (
      <section className="album-releases">
        <div className="album-releases__header">
          <h2 className="album-releases__title">Loading Songs...</h2>
        </div>
        <div className="album-releases__loading">
          <div className="album-releases__spinner" />
        </div>
      </section>
    );
  }

  // Empty state
  if (filteredSongs.length === 0) {
    return (
      <section className="album-releases">
        <div className="album-releases__header">
          <h2 className="album-releases__title">{sectionTitle}</h2>
          <p className="album-releases__subtitle">{sectionSubtitle}</p>
        </div>
        <div className="album-releases__empty">
          {currentMood && !searchQuery.trim() ? (
            <p>No songs available for this mood yet.</p>
          ) : searchQuery.trim() ? (
            <p>No songs found for your search.</p>
          ) : (
            <p>No songs available yet.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="album-releases">
      <div className="album-releases__header">
        <h2 className="album-releases__title">{sectionTitle}</h2>
        <p className="album-releases__subtitle">{sectionSubtitle}</p>
      </div>

      <div className="album-releases__grid">
        {filteredSongs.map((song, index) => (
          <AlbumCard
            key={song._id || song.url}
            song={song}
            isActive={currentSong && (currentSong._id === song._id || currentSong.url === song.url)}
            onClick={() => playSong(song)}
          />
        ))}
      </div>
    </section>
  );
};

export default AlbumReleases;
