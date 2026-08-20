import React from "react";
import { useSong } from "../../hooks/useSong";
import AlbumCard from "./AlbumCard";
import "./AlbumReleases.scss";

const AlbumReleases = () => {
  const { song } = useSong();

  // Only show section when there's a song
  if (!song) return null;

  return (
    <section className="album-releases">
      <div className="album-releases__header">
        <h2 className="album-releases__title">Your Current Track</h2>
        <p className="album-releases__subtitle">Recommended based on your detected mood</p>
      </div>

      <div className="album-releases__grid">
        <AlbumCard song={song} />
      </div>
    </section>
  );
};

export default AlbumReleases;
