import React from "react";
import { useSong } from "../hooks/useSong";
import ExpressionDetector from "../components/ExpressionDetector/ExpressionDetector";
import AlbumReleases from "../components/AlbumReleases/AlbumReleases";
import "./home.scss";

const Home = () => {
    const { currentSong } = useSong();

    return (
        <>
            {/* Hide expression detector when a song is playing to reclaim space */}
            {!currentSong && <ExpressionDetector />}
            <AlbumReleases />
        </>
    );
};

export default Home;