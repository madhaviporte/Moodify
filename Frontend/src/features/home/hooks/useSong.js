import { getSong } from "../service/song.api";
import { useContext } from "react";
import { SongContext } from "../song.context";

export const useSong = () => {
    const context = useContext(SongContext);
    const { loading, setLoading, song, setSong } = context;

    async function handleGetSong({ mood }) {
        setLoading(true);
        try {
            const data = await getSong({ mood });
            setSong(data.song);
        } catch (error) {
            console.error("Failed to fetch song:", error.message);
            setSong(null);
        } finally {
            setLoading(false);
        }
    }

    return { loading, song, handleGetSong };
};
