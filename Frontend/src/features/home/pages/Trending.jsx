import React from "react";
import { useSong } from "../hooks/useSong";
import "../pages/page-shared.scss";

const moods = [
  { name: "Happy", emoji: "😄", color: "#ff6b35" },
  { name: "Sad", emoji: "😢", color: "#4a90d9" },
  { name: "Surprised", emoji: "😮", color: "#f5a623" },
  { name: "Neutral", emoji: "😐", color: "#8b7ec8" },
];

const Trending = () => {
  const { song } = useSong();

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Trending</h1>
        <p className="page__subtitle">
          Discover music based on moods. Try different expressions to explore.
        </p>
      </div>

      {/* Mood Categories */}
      <div className="page__section">
        <h2 className="page__section-title">Browse by Mood</h2>
        <div className="mood-grid">
          {moods.map((mood) => (
            <div
              key={mood.name}
              className="mood-card"
              style={{ "--mood-color": mood.color }}
            >
              <span className="mood-card__emoji">{mood.emoji}</span>
              <span className="mood-card__name">{mood.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Current Recommendation */}
      {song && (
        <div className="page__section">
          <h2 className="page__section-title">Recommended for You</h2>
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
        </div>
      )}
    </div>
  );
};

export default Trending;
