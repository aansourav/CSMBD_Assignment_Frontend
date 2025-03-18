"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/app-context";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { motion } from "framer-motion";
import {
    Loader2,
    LogIn,
    LogOut,
    Menu,
    Moon,
    Sun,
    User,
    UserPlus,
    Users,
    Youtube,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar({ onMenuClick }) {
    const { user, isAuthenticated, logout, darkMode, toggleDarkMode, loading } =
        useApp();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [timestamp, setTimestamp] = useState(Date.now());

    // Update profile image URL when user or user's profile picture changes
    useEffect(() => {
        if (user?.id) {
            // Update timestamp to force image refresh
            setTimestamp(Date.now());
            setProfileImageUrl(
                getProfilePictureUrl(`/api/v1/users/${user.id}/profile-picture`)
            );
            setImageError(false);
        }
    }, [user]);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle logout with loading state
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Handle image error
    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/80 backdrop-blur-md shadow-md"
                    : "bg-background"
            }`}
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuClick}
                            className="mr-2"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>

                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ rotate: 10 }}
                                className="rounded-full bg-primary p-1"
                            >
                                <Users className="h-6 w-6 text-primary-foreground" />
                            </motion.div>
                            <span className="hidden font-bold text-xl md:inline-block">
                                CSMBD Social
                            </span>
                        </Link>
                    </div>

                    <nav className="hidden md:flex items-center space-x-1">
                        <Link href="/users">
                            <Button
                                variant={
                                    pathname === "/users"
                                        ? "secondary"
                                        : "ghost"
                                }
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </Button>
                        </Link>
                        <Link href="/contents">
                            <Button
                                variant={
                                    pathname === "/contents"
                                        ? "secondary"
                                        : "ghost"
                                }
                            >
                                <Youtube className="h-4 w-4 mr-2" />
                                Contents
                            </Button>
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleDarkMode}
                            className="rounded-full"
                        >
                            {darkMode ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            {!imageError && (
                                                <AvatarImage
                                                    src={profileImageUrl}
                                                    alt={user?.name}
                                                    onError={handleImageError}
                                                />
                                            )}
                                            <AvatarFallback>
                                                {user?.name?.charAt(0) || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56"
                                    align="end"
                                    forceMount
                                >
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <Link href="/profile">
                                        <DropdownMenuItem>
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        disabled={isLoggingOut || loading}
                                        className="text-red-500 focus:text-red-500"
                                    >
                                        {isLoggingOut || loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                <span>Logging out...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center space-x-1">
                                <Link href="/signin">
                                    <Button variant="ghost" size="sm">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm">
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
