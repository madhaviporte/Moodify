import React, { useRef, useState, useEffect } from 'react'
import { useSong } from '../hooks/useSong'
import './player.scss'

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2]

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
}

const Player = () => {
    const { currentSong, filteredSongs, currentIndex, nextSong, prevSong, autoPlay, setAutoPlay, addToRecentlyPlayed } = useSong()

    const audioRef = useRef(null)
    const progressRef = useRef(null)

    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [speed, setSpeed] = useState(1)
    const [volume, setVolume] = useState(1)
    const [showSpeed, setShowSpeed] = useState(false)
    const [isMuted, setIsMuted] = useState(false)

    // Reset player when song changes, then auto-play if flagged
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load()
            setCurrentTime(0)
            if (autoPlay && currentSong) {
                const p = audioRef.current.play()
                if (p && p.then) {
                    p.then(() => { setIsPlaying(true); setAutoPlay(false); addToRecentlyPlayed(currentSong) }).catch(() => { setAutoPlay(false) })
                } else { setIsPlaying(true); setAutoPlay(false); addToRecentlyPlayed(currentSong) }
            } else { setIsPlaying(false) }
        }
    }, [currentSong && currentSong.url])

    useEffect(() => { if (!currentSong && autoPlay) setAutoPlay(false) }, [currentSong, autoPlay])

    const togglePlay = () => { const audio = audioRef.current; if (!audio) return; if (isPlaying) { audio.pause() } else { audio.play().catch(()=>{}) }; setIsPlaying(!isPlaying) }
    const skip = (secs) => { const audio = audioRef.current; if (!audio) return; audio.currentTime = Math.min(Math.max(audio.currentTime + secs, 0), duration) }
    const handleTimeUpdate = () => { setCurrentTime(audioRef.current.currentTime) }
    const handleLoadedMetadata = () => { setDuration(audioRef.current.duration) }
    const handleProgressClick = (e) => { const bar = progressRef.current; const rect = bar.getBoundingClientRect(); const ratio = (e.clientX - rect.left) / rect.width; const newTime = ratio * duration; audioRef.current.currentTime = newTime; setCurrentTime(newTime) }
    const handleSpeedChange = (s) => { setSpeed(s); audioRef.current.playbackRate = s; setShowSpeed(false) }
    const handleVolume = (e) => { const val = parseFloat(e.target.value); setVolume(val); audioRef.current.volume = val; setIsMuted(val === 0) }
    const toggleMute = () => { const audio = audioRef.current; if (isMuted) { audio.volume = volume || 0.5; setIsMuted(false) } else { audio.volume = 0; setIsMuted(true) } }
    const handleSongEnd = () => { if (filteredSongs.length > 0) { nextSong() } else { setIsPlaying(false); setCurrentTime(0) } }
    const progress = duration ? (currentTime / duration) * 100 : 0

    if (!currentSong) return (<div className="player" style={{ justifyContent: "center" }}><p style={{ color: "#888", fontSize: "0.9rem" }}>No song selected. Detect your expression to get a song.</p></div>)

    const playPauseIcon = isPlaying ? <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg> : <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28"><path d="M8 5.14v14l11-7-11-7z"/></svg>
    const volOn = <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
    const volOff = <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.87 8.87 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 18L19 19.27 20.27 18 5.27 3 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>

    return (<div className="player">
            <audio ref={audioRef} src={currentSong.url} onTimeUpdate={handleTimeUpdate} onLoadedMetadata={handleLoadedMetadata} onEnded={handleSongEnd} />
            <div className="player__info"><img className="player__poster" src={currentSong.posterUrl} alt={currentSong.title} /><div className="player__meta"><p className="player__title">{currentSong.title}</p><span className="player__mood">{currentSong.mood}</span></div></div>
            <div className="player__progress-wrap"><span className="player__time">{formatTime(currentTime)}</span><div className="player__progress" ref={progressRef} onClick={handleProgressClick}><div className="player__progress-fill" style={{ width: progress + "%" }} /><div className="player__progress-thumb" style={{ left: progress + "%" }} /></div><span className="player__time">{formatTime(duration)}</span></div>
            <div className="player__controls">
                <div className="player__speed-wrap"><button className="player__btn player__btn--speed" onClick={() => setShowSpeed(!showSpeed)} title="Playback speed">{speed}x</button>{showSpeed && <div className="player__speed-menu">{SPEED_OPTIONS.map((s) => <button key={s} className={"player__speed-option" + (s === speed ? " active" : "")} onClick={() => handleSpeedChange(s)}>{s}x</button>)}</div>}</div>
                <button className="player__btn player__btn--nav" onClick={prevSong} title="Previous song" disabled={filteredSongs.length === 0}><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
                <button className="player__btn player__btn--play" onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>{playPauseIcon}</button>
                <button className="player__btn player__btn--nav" onClick={nextSong} title="Next song" disabled={filteredSongs.length === 0}><svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
                <button className="player__btn player__btn--skip" onClick={() => skip(-5)} title="Back 5s"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 .49-3.6"/></svg><span>5s</span></button>
                <button className="player__btn player__btn--skip" onClick={() => skip(5)} title="Forward 5s"><span>5s</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-.49-3.6"/></svg></button>
                <div className="player__volume"><button className="player__btn player__btn--vol" onClick={toggleMute} title="Mute">{isMuted || volume === 0 ? volOff : volOn}</button><input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={handleVolume} className="player__volume-slider" /></div>
            </div>
        </div>)
}

export default Player
