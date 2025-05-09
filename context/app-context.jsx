"use client";

import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/config/url";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(undefined);

// Helper function to check if JWT token is expired
const isTokenExpired = (token) => {
    if (!token) return true;

    try {
        // Extract the payload from the JWT token
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const payload = JSON.parse(window.atob(base64));

        // Check if token has expired
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch (error) {
        console.error("Error parsing token:", error);
        return true;
    }
};

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [tokenChecked, setTokenChecked] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // Initialize from localStorage if available, otherwise default to true (dark mode)
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme ? savedTheme === "dark" : true;
        }
        return true;
    });
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    // Initialize theme on mount
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, []);

    // Check authentication status
    const checkAuthStatus = async () => {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        // If no tokens, user is not authenticated
        if (!accessToken || !refreshToken || !storedUser) {
            setIsAuthenticated(false);
            setUser(null);
            setTokenChecked(true);
            return false;
        }

        try {
            // Check if access token is expired
            if (isTokenExpired(accessToken)) {
                // Try to refresh the token
                try {
                    await refreshAccessToken();
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    setTokenChecked(true);
                    return true;
                } catch (error) {
                    // If refresh fails, user is not authenticated
                    console.error("Token refresh failed:", error);
                    clearAuthData();
                    setTokenChecked(true);
                    return false;
                }
            } else {
                // Token is valid
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setIsAuthenticated(true);
                setTokenChecked(true);
                return true;
            }
        } catch (error) {
            console.error("Auth check error:", error);
            clearAuthData();
            setTokenChecked(true);
            return false;
        }
    };

    // Check for existing user session on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // Helper function to clear authentication data
    const clearAuthData = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    // Refresh token function
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const response = await fetch(`${API_URL}/auth/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to refresh token");
            }

            localStorage.setItem("accessToken", data.data.accessToken);
            return data.data.accessToken;
        } catch (error) {
            console.error("Error refreshing token:", error);
            // If refreshing fails, log out the user
            clearAuthData();
            throw error;
        }
    };

    // Login function
    const login = (userData, accessToken, refreshToken) => {
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        toast({
            title: "Login Successful",
            description: `Welcome back, ${userData.name}!`,
        });
    };

    // Logout function
    const logout = async () => {
        setLoading(true);

        try {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
                try {
                    // Call the signout API directly without using our API service
                    // to avoid token refresh attempts during logout
                    await fetch(`${API_URL}/auth/signout`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });

                    toast({
                        title: "Logged Out",
                        description: "You have been successfully logged out.",
                    });
                } catch (error) {
                    console.error("Error during signout:", error);

                    toast({
                        title: "Logout Error",
                        description:
                            "There was an issue logging you out, but your session has been cleared.",
                        variant: "destructive",
                    });
                }
            }
        } finally {
            // Clear user data regardless of API call success
            clearAuthData();
            setLoading(false);

            // Force reload to the home page to clear any state
            if (typeof window !== "undefined") {
                window.location.href = "/";
            }
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const newValue = !prev;
            if (newValue) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            localStorage.setItem("theme", newValue ? "dark" : "light");
            return newValue;
        });
    };

    const value = {
        user,
        setUser,
        isAuthenticated,
        tokenChecked,
        login,
        logout,
        refreshAccessToken,
        checkAuthStatus,
        darkMode,
        toggleDarkMode,
        loading,
        setLoading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
