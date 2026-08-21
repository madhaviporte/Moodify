import api from "../../shared/api.config";

// Fetch ALL songs (no mood filter)
export async function getAllSongs() {
    const response = await api.get("/api/songs");
    return response.data;
}

// Fetch one random song for a specific mood (existing behavior)
export async function getSong({ mood }) {
    const response = await api.get("/api/songs?mood=" + mood);
    return response.data;
}
