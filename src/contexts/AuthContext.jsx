"use client";
import { createContext, useContext, useEffect, useState } from "react";

// Create the context
const AuthContext = createContext(null);

// Provider component that wraps your app and makes auth object available
export function AuthProvider({ children }) {
    const [authState, setAuthState] = useState({
        isLoading: true,
        isAuthenticated: false,
        error: null,
    });

    useEffect(() => {
        const refreshToken = async () => {
            try {
                const response = await fetch("/api/refresh", {
                    method: "POST",
                    credentials: "include",
                });

                if (response.ok) {
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: true,
                        error: null,
                    });
                } else {
                    console.error("Token refresh failed:", response.status);
                    setAuthState({
                        isLoading: false,
                        isAuthenticated: false,
                        error: "Failed to refresh token",
                    });
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
                setAuthState({
                    isLoading: false,
                    isAuthenticated: false,
                    error: error.message,
                });
            }
        };

        refreshToken();
        const interval = setInterval(refreshToken, 14 * 60 * 1000); // Every 14 minutes

        return () => clearInterval(interval);
    }, []);

    return (
        <AuthContext.Provider value={authState}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook for components to get access to auth state
export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
