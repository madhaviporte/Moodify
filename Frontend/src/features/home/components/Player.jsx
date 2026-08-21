import React, { useRef, useState, useEffect } from "react";
import { useSong } from "../hooks/useSong";
import "./player.scss";

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${m}:${s}`;
};

const Player = () => {
    const {
        currentSong,
        filteredSongs,
        currentIndex,
        nextSong,
        prevSong,
        autoPlay,
        setAutoPlay,
        isPlaying,
        setIsPlaying,
        addToRecentlyPlayed,
    } = useSong();

    const audioRef = useRef(null);
    const progressRef = useRef(null);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [volume, setVolume] = useState(1);
    const [showSpeed, setShowSpeed] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    // Reset player when song changes, then auto-play if flagged
    useEffect(() => {
        if (audioRef.current && currentSong) {
            audioRef.current.load();
            setCurrentTime(0);
            if (autoPlay) {
                const playPromise = audioRef.current.play();
                if (playPromise) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            setAutoPlay(false);
                            addToRecentlyPlayed(currentSong);
                        })
                        .catch(() => {
                            setAutoPlay(false);
                        });
                } else {
                    setIsPlaying(true);
                    setAutoPlay(false);
                    addToRecentlyPlayed(currentSong);
                }
            } else {
                setIsPlaying(false);
            }
        }
    }, [currentSong?.url]);

    // Reset autoPlay if no song
    useEffect(() => {
        if (!currentSong && autoPlay) {
            setAutoPlay(false);
        }
    }, [currentSong, autoPlay]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().then(() => {
                if (currentSong) addToRecentlyPlayed(currentSong);
            }).catch(() => {});
        }
        setIsPlaying(!isPlaying);
    };

    // Track when audio actually starts playing (covers autoplay and browser interaction)
    const handlePlay = () => {
        setIsPlaying(true);
        if (currentSong) addToRecentlyPlayed(currentSong);
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const skip = (secs) => {
        const audio = audioRef.current;
        if (!audio) return;
        audio.currentTime = Math.min(
            Math.max(audio.currentTime + secs, 0),
            duration
        );
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleProgressClick = (e) => {
        const bar = progressRef.current;
        const rect = bar.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const newTime = ratio * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSpeedChange = (s) => {
        setSpeed(s);
        audioRef.current.playbackRate = s;
        setShowSpeed(false);
    };

    const handleVolume = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        audioRef.current.volume = val;
        setIsMuted(val === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume || 1;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const handleSongEnd = () => {
        setIsPlaying(false);
        if (filteredSongs.length > 0) {
            nextSong();
        }
    };

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="player">
            {currentSong && (
                <audio
                    ref={audioRef}
                    src={currentSong.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleSongEnd}
                    onPlay={handlePlay}
                    onPause={handlePause}
                />
            )}

            {/* Song Info */}
            <div className="player__info">
                {currentSong ? (
                    <>
                        <img
                            className="player__poster"
                            src={currentSong.posterUrl}
                            alt={currentSong.title}
                        />
                        <div className="player__meta">
                            <p className="player__title">{currentSong.title}</p>
                            <span className="player__mood">
                                {currentSong.mood || "Unknown"}
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="player__meta">
                        <p className="player__title" style={{ opacity: 0.4 }}>
                            No song selected
                        </p>
                    </div>
                )}
            </div>

            {/* Controls + Progress */}
            <div className="player__center">
                <div className="player__controls">
                    {/* Prev song */}
                    <button
                        className="player__btn player__btn--nav"
                        onClick={prevSong}
                        title="Previous song"
                        disabled={!currentSong || filteredSongs.length === 0}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                        </svg>
                    </button>

                    {/* Rewind 5s */}
                    <button
                        className="player__btn player__btn--skip"
                        onClick={() => skip(-5)}
                        title="Rewind 5 seconds"
                        disabled={!currentSong}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M12.5 8.5V4l-5 4.5 5 4.5V9c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6" />
                        </svg>
                        <span>5s</span>
                    </button>

                    {/* Play/Pause */}
                    <button
                        className="player__btn player__btn--play"
                        onClick={togglePlay}
                        disabled={!currentSong}
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path d="M8 5.14v14l11-7-11-7z" />
                            </svg>
                        )}
                    </button>

                    {/* Forward 5s */}
                    <button
                        className="player__btn player__btn--skip"
                        onClick={() => skip(5)}
                        title="Forward 5 seconds"
                        disabled={!currentSong}
                    >
                        <span>5s</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M11.5 8.5V4l5 4.5-5 4.5V9c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6" />
                        </svg>
                    </button>

                    {/* Next song */}
                    <button
                        className="player__btn player__btn--nav"
                        onClick={nextSong}
                        title="Next song"
                        disabled={!currentSong || filteredSongs.length === 0}
                    >
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M16 6h2v12h-2zm-3.5 6L4 6v12z" />
                        </svg>
                    </button>
                </div>

                {/* Progress bar */}
                <div className="player__progress-wrap">
                    <span className="player__time">{formatTime(currentTime)}</span>
                    <div
                        className="player__progress"
                        ref={progressRef}
                        onClick={handleProgressClick}
                    >
                        <div
                            className="player__progress-fill"
                            style={{ width: `${progressPercent}%` }}
                        />
                        <div
                            className="player__progress-thumb"
                            style={{ left: `${progressPercent}%` }}
                        />
                    </div>
                    <span className="player__time">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Speed + Volume */}
            <div className="player__right">
                {/* Speed */}
                <div className="player__speed-wrap">
                    <button
                        className="player__btn player__btn--speed"
                        onClick={() => setShowSpeed(!showSpeed)}
                        disabled={!currentSong}
                    >
                        {speed}x
                    </button>
                    {showSpeed && (
                        <div className="player__speed-menu">
                            {SPEED_OPTIONS.map((s) => (
                                <button
                                    key={s}
                                    className={`player__speed-option ${speed === s ? "active" : ""}`}
                                    onClick={() => handleSpeedChange(s)}
                                >
                                    {s}x
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Volume */}
                <div className="player__volume">
                    <button
                        className="player__btn player__btn--vol"
                        onClick={toggleMute}
                        disabled={!currentSong}
                        title={isMuted ? "Unmute" : "Mute"}
                    >
                        {isMuted || volume === 0 ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <line x1="23" y1="9" x2="17" y2="15" />
                                <line x1="17" y1="9" x2="23" y2="15" />
                            </svg>
                        ) : volume < 0.5 ? (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                            </svg>
                        )}
                    </button>
                    <input
                        className="player__volume-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolume}
                        disabled={!currentSong}
                    />
                </div>
            </div>
        </div>
    );
};

export default Player;
