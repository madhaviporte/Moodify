import React from "react";

const AlbumCard = ({ song, isActive, onClick }) => {
  return (
    <div
      className={`album-card ${isActive ? "album-card--active" : ""}`}
      onClick={onClick}
    >
      <div className="album-card__artwork">
        <img
          src={song.posterUrl}
          alt={song.title}
          className="album-card__img"
          loading="lazy"
        />
        <div className="album-card__overlay">
          {isActive ? (
            <div className="album-card__playing-indicator">
              <span /><span /><span />
            </div>
          ) : (
            <button className="album-card__play-btn" title={`Play ${song.title}`}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="album-card__info">
        <h3 className="album-card__title">{song.title}</h3>
        <p className="album-card__artist">{song.mood || "Unknown"}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
