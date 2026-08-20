import React from "react";
import ExpressionDetector from "../components/ExpressionDetector/ExpressionDetector";
import AlbumReleases from "../components/AlbumReleases/AlbumReleases";
import "./home.scss";

const Home = () => {
    return (
        <>
            <ExpressionDetector />
            <AlbumReleases />
        </>
    );
};

export default Home;