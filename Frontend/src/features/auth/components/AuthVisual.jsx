import React from "react";

/**
 * AuthVisual — cinematic music visual panel matching the Moodify reference.
 * Left-side full-height panel with gradient scene, floating notes, particles,
 * animated equalizer, brand text, and bottom waveform.
 */
const AuthVisual = ({ brand = "Moodify", tagline, imageSrc }) => {
  return (
    <div className="auth-visual">
      {/* Background image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt=""
          className="auth-visual__image"
          loading="eager"
          draggable={false}
        />
      )}
      {/* Ambient glow orbs */}
      <div className="visual-orb visual-orb--1" />
      <div className="visual-orb visual-orb--2" />
      <div className="visual-orb visual-orb--3" />

      {/* Floating music notes */}
      <span className="visual-note visual-note--1">&#9835;</span>
      <span className="visual-note visual-note--2">&#9834;</span>
      <span className="visual-note visual-note--3">&#9833;</span>
      <span className="visual-note visual-note--4">&#9835;</span>
      <span className="visual-note visual-note--5">&#9834;</span>
      <span className="visual-note visual-note--6">&#9833;</span>

      {/* Floating particles */}
      <div className="visual-particle visual-particle--1" />
      <div className="visual-particle visual-particle--2" />
      <div className="visual-particle visual-particle--3" />
      <div className="visual-particle visual-particle--4" />
      <div className="visual-particle visual-particle--5" />
      <div className="visual-particle visual-particle--6" />
      <div className="visual-particle visual-particle--7" />
      <div className="visual-particle visual-particle--8" />

      {/* Brand content — positioned lower-left */}
      <div className="visual-content">
        {/* Animated equalizer bars */}
        <div className="visual-equalizer">
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
          <div className="eq-bar" />
        </div>

        <h2 className="visual-brand">{brand}</h2>
        <p className="visual-tagline">{tagline}</p>
      </div>

      {/* Bottom waveform decoration */}
      <div className="visual-wave">
        <svg viewBox="0 0 600 80" preserveAspectRatio="none">
          <path
            d="M0 50 Q15 20 30 50 T60 50 T90 50 T120 50 T150 50 T180 50 T210 50 T240 50 T270 50 T300 50 T330 50 T360 50 T390 50 T420 50 T450 50 T480 50 T510 50 T540 50 T570 50 T600 50 V80 H0Z"
            fill="rgba(124, 58, 237, 0.25)"
          />
          <path
            d="M0 55 Q20 30 40 55 T80 55 T120 55 T160 55 T200 55 T240 55 T280 55 T320 55 T360 55 T400 55 T440 55 T480 55 T520 55 T560 55 T600 55 V80 H0Z"
            fill="rgba(255, 107, 53, 0.15)"
          />
        </svg>
      </div>
    </div>
  );
};

export default AuthVisual;
