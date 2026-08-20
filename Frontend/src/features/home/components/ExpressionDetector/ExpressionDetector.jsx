import React from "react";
import FaceExpression from "../../../Expression/components/FaceExpression";
import { useSong } from "../../hooks/useSong";
import "./ExpressionDetector.scss";

const ExpressionDetector = () => {
  const { loading, handleGetSong } = useSong();

  return (
    <section className="hero-section">
      <div className="hero-section__content">
        <div className="hero-section__text">
          <h1 className="hero-section__title">
            Detect Your <span className="hero-section__title--accent">Mood</span>
          </h1>
          <p className="hero-section__subtitle">
            Show your expression and let the AI detect your mood to play the perfect song.
          </p>
          {loading && (
            <div className="hero-section__loading">
              <div className="hero-section__spinner" />
              <span>Fetching song for your mood...</span>
            </div>
          )}
        </div>

        <div className="hero-section__camera">
          <div className="hero-section__camera-frame">
            <div className="hero-section__camera-glow" />
            <FaceExpression
              onClick={(expression) => {
                handleGetSong({ mood: expression });
              }}
            />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hero-section__deco hero-section__deco--1" />
      <div className="hero-section__deco hero-section__deco--2" />
    </section>
  );
};

export default ExpressionDetector;
