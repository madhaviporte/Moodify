import { useState, createContext, useRef } from "react";
import { getMe } from "./services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const initRef = useRef(false);

    // Run getMe exactly once on mount (handles StrictMode double-mount safely)
    if (!initRef.current) {
        initRef.current = true;
        // Fire-and-forget: setLoading(true) already set via initial state
        getMe()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
