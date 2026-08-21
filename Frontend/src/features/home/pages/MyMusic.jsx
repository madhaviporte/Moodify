import React from "react";
import { useSong } from "../hooks/useSong";
import "../pages/page-shared.scss";

const MyMusic = () => {
  const { song, allSongs, recentlyPlayed, playSong } = useSong();

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

        {recentlyPlayed.length > 0 ? (
          <div className="page__grid">
            {recentlyPlayed.map((s) => (
              <div
                key={s._id || s.url}
                className="music-card"
                onClick={() => playSong(s)}
              >
                <div className="music-card__artwork">
                  <img
                    src={s.posterUrl}
                    alt={s.title}
                    className="music-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="music-card__info">
                  <h3 className="music-card__title">{s.title}</h3>
                  <p className="music-card__mood">{s.mood || "Unknown"}</p>
                </div>
              </div>
            ))}
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
              No recently played songs yet. Go to Home and detect your mood to get started!
            </p>
          </div>
        )}
      </div>

      {/* All Songs */}
      <div className="page__section">
        <h2 className="page__section-title">All Songs</h2>
        <p className="page__subtitle">
          Complete library — {allSongs.length} songs available.
        </p>
        {allSongs.length > 0 ? (
          <div className="page__grid">
            {allSongs.map((s) => (
              <div
                key={s._id || s.url}
                className={`music-card ${song && (song._id === s._id || song.url === s.url) ? "music-card--active" : ""}`}
                onClick={() => playSong(s)}
              >
                <div className="music-card__artwork">
                  <img
                    src={s.posterUrl}
                    alt={s.title}
                    className="music-card__img"
                    loading="lazy"
                  />
                </div>
                <div className="music-card__info">
                  <h3 className="music-card__title">{s.title}</h3>
                  <p className="music-card__mood">{s.mood || "Unknown"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="page__empty">
            <p className="page__empty-text">
              No songs available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMusic;
