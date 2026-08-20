import React from "react";
import { useSong } from "../hooks/useSong";
import "../pages/page-shared.scss";

const MyMusic = () => {
  const { song } = useSong();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">My Music</h1>
        <p className="page__subtitle">
          Your personal music collection and recently played tracks.
        </p>
      </div>

      {/* Recently Played */}
      <div className="page__section">
        <h2 className="page__section-title">Recently Played</h2>

        {song ? (
          <div className="page__grid">
            <div className="music-card">
              <div className="music-card__artwork">
                <img
                  src={song.posterUrl}
                  alt={song.title}
                  className="music-card__img"
                />
              </div>
              <div className="music-card__info">
                <h3 className="music-card__title">{song.title}</h3>
                <p className="music-card__mood">{song.mood}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="page__empty">
            <div className="page__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <p className="page__empty-text">
              No music played yet. Go to Home and detect your mood to get started!
            </p>
          </div>
        )}
      </div>

      {/* Mood History */}
      <div className="page__section">
        <h2 className="page__section-title">All Songs by Mood</h2>
        <p className="page__subtitle">
          Songs you've discovered through mood detection will appear here.
        </p>
        {!song && (
          <div className="page__empty" style={{ paddingTop: "20px" }}>
            <p className="page__empty-text">
              Detect your expression on the Home page to discover mood-matched music.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMusic;
