"use client";

import { useApp } from "@/context/app-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Routes that should redirect to home if user is already authenticated
const authRoutes = ["/signin", "/signup"];

// Routes that require authentication to access
const protectedRoutes = ["/profile"];

export default function AuthMiddleware({ children }) {
    const { isAuthenticated, checkAuthStatus } = useApp();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check authentication status when component mounts
        const initAuth = async () => {
            await checkAuthStatus();
            handleRouteProtection();
        };

        initAuth();
    }, []);

    useEffect(() => {
        // Handle route protection whenever authentication status or path changes
        handleRouteProtection();
    }, [isAuthenticated, pathname]);

    const handleRouteProtection = () => {
        // For authentication routes (login/signup), redirect to home if already logged in
        if (authRoutes.includes(pathname) && isAuthenticated) {
            router.push("/");
            return;
        }

        // For protected routes, redirect to login if not authenticated
        if (protectedRoutes.includes(pathname) && !isAuthenticated) {
            router.push("/signin");
            return;
        }
    };

    return children;
}
