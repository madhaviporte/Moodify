import React from "react";
import { useSong } from "../../hooks/useSong";
import "./NowPlaying.scss";

const NowPlaying = () => {
  const { currentSong, isPlaying, clearCurrentSong } = useSong();

  if (!currentSong) return null;

  return (
    <section className="now-playing">
      <div className="now-playing__inner">
        <div className="now-playing__artwork-wrap">
          <img
            src={currentSong.posterUrl}
            alt={currentSong.title}
            className="now-playing__artwork"
          />
          {isPlaying && (
            <div className="now-playing__pulse" />
          )}
        </div>
        <div className="now-playing__details">
          <span className="now-playing__label">
            {isPlaying ? "Now Playing" : "Paused"}
          </span>
          <h2 className="now-playing__title">{currentSong.title}</h2>
          <div className="now-playing__meta">
            {currentSong.artist && (
              <span className="now-playing__artist">{currentSong.artist}</span>
            )}
            {currentSong.mood && (
              <span className="now-playing__mood">{currentSong.mood}</span>
            )}
            {currentSong.album && (
              <span className="now-playing__album">{currentSong.album}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          className="now-playing__close"
          onClick={clearCurrentSong}
          aria-label="Close current song"
          title="Close"
        >
          ×
        </button>
      </div>
    </section>
  );
};

export default NowPlaying;
