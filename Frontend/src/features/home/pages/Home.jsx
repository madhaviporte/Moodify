import React from "react";
import { useSong } from "../hooks/useSong";
import ExpressionDetector from "../components/ExpressionDetector/ExpressionDetector";
import NowPlaying from "../components/NowPlaying/NowPlaying";
import AlbumReleases from "../components/AlbumReleases/AlbumReleases";
import "./home.scss";

const Home = () => {
    const { currentSong } = useSong();

    return (
        <>
            {/* Show Now Playing when a song is active, otherwise show expression detector */}
            {currentSong ? <NowPlaying /> : <ExpressionDetector />}
            <AlbumReleases />
        </>
    );
};

export default Home;