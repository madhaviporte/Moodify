import { login, register, getMe, logout } from "../services/auth.api";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";

export const useAuth = () => {
    const context = useContext(AuthContext);
    const { user, setUser, loading, setLoading } = context;

    async function handleRegister({ username, email, password }) {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogin({ username, email, password }) {
        setLoading(true);
        try {
            const data = await login({ username, email, password });
            setUser(data.user);
            return data.user;
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }

    async function handleGetMe() {
        setLoading(true);
        try {
            const data = await getMe();
            setUser(data.user);
        } catch {
            // No valid session — user stays null, loading will be set to false below
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        setLoading(true);
        try {
            await logout();
        } catch {
            // Continue clearing local state even if server call fails
        } finally {
            setUser(null);
            setLoading(false);
        }
    }

    useEffect(() => {
        handleGetMe();
    }, []);

    return {
        user, loading, handleLogin, handleRegister, handleLogout, handleGetMe
    };
}

