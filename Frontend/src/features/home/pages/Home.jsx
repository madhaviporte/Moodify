import React from "react";
import FaceExpression from "../../Expression/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";
import "./home.scss";

const Home = () => {

  const { handleGetSong } = useSong();

  return (
    <div className="home">

      <div className="home-container">

        <h1 className="title">
          Mood Based Music 🎧
        </h1>

        <p className="subtitle">
          Show your expression and let the system detect your mood to play the perfect song.
        </p>

        <div className="expression-box">
          <FaceExpression
            onClick={(expression) => {
              handleGetSong({ mood: expression });
            }}
          />
        </div>

        <div className="player-box">
          <Player />
        </div>

      </div>

    </div>
  );
};

export default Home;