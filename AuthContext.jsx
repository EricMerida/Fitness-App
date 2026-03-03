import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children}) {
    const [token, setTokenState] = useState(() => localStorage.getItem("token"));

    const setToken = (newToken) => {
        if (newToken) localStorage.setItem("token", newToken);
        else localStorage.removeItem("token");
        setTokenState(newToken);
    };

    const value = useMemo(
        () => ({
            token,
            isAuthed: !!token,
            setToken,
            logout: () => setToken(null),
        }),
        [token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
