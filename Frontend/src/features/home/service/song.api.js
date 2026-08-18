import api from "../../shared/api.config";

export async function getSong({ mood }) {
    const response = await api.get("/api/songs?mood=" + mood);
    return response.data;
}