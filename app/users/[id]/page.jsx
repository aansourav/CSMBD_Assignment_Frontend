"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import YoutubeEmbed from "@/components/youtube-embed";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, Youtube } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import getProfilePictureUrl from "../../../lib/get-profile-picture";

export default function UserProfilePage() {
    const { id } = useParams();
    const { refreshAccessToken } = useApp();
    const [imageError, setImageError] = useState(false);

    // Fetch user data with TanStack Query
    const {
        data: userData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["user", id],
        queryFn: () =>
            get(`/users/${id}`, {}, refreshAccessToken).then(
                (response) => response.data
            ),
        staleTime: 1000, // 10 seconds
        refetchInterval: 1000, // 10 seconds
    });

    const { user: currentUser } = useApp();

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-[70vh] items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <LoadingSpinner size="lg" />
                        <p className="text-lg font-medium text-muted-foreground">
                            Loading user profile...
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (isError) {
        return (
            <MainLayout>
                <div className="flex h-[70vh] items-center justify-center">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertDescription>
                            {error?.message ||
                                "Failed to load user profile. Please try again."}
                        </AlertDescription>
                    </Alert>
                </div>
            </MainLayout>
        );
    }

    if (!userData) {
        return (
            <MainLayout>
                <div className="flex h-[70vh] items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">User not found</h2>
                        <p className="text-muted-foreground">
                            The user you're looking for doesn't exist or has
                            been removed.
                        </p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const user = userData;

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <Card>
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 10,
                                }}
                            >
                                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                                    {/* Only show AvatarImage if not in error state */}
                                    {!imageError && (
                                        <AvatarImage
                                            src={getProfilePictureUrl(
                                                user.profilePictureUrl
                                            )}
                                            alt={user.name}
                                            onError={(e) => {
                                                console.error(
                                                    "Image failed to load:",
                                                    e.target.src
                                                );
                                                setImageError(true);
                                            }}
                                        />
                                    )}
                                    <AvatarFallback className="text-2xl">
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            <div className="space-y-2">
                                <div>
                                    <h1 className="text-2xl font-bold sm:text-3xl">
                                        {user.name}{" "}
                                        {id === currentUser.id && "(You)"}
                                    </h1>
                                    <p className="text-muted-foreground">
                                        {user.bio || "No bio provided"}
                                    </p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                                    {user.location && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <MapPin className="h-3 w-3" />
                                            {user.location}
                                        </Badge>
                                    )}
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <Youtube className="h-3 w-3" />
                                        {user.youtubeLinks?.length || 0} videos
                                    </Badge>
                                    {user.createdAt && (
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1"
                                        >
                                            <Calendar className="h-3 w-3" />
                                            Joined{" "}
                                            {format(
                                                new Date(user.createdAt),
                                                "d MMMM yyyy"
                                            )}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="content" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="content">Content</TabsTrigger>
                        <TabsTrigger value="about">About</TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-4 pt-4">
                        <h2 className="text-xl font-semibold">Shared Videos</h2>

                        {user.youtubeLinks && user.youtubeLinks.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {user.youtubeLinks.map((link, index) => (
                                    <motion.div
                                        key={link.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Card>
                                            <CardHeader className="p-4">
                                                <CardTitle className="text-lg">
                                                    {link.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    Added on{" "}
                                                    {format(
                                                        new Date(link.addedAt),
                                                        "d MMMM yyyy"
                                                    )}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <YoutubeEmbed
                                                    url={
                                                        link.url ||
                                                        link.youtubeUrl ||
                                                        `https://www.youtube.com/watch?v=${
                                                            link.videoId ||
                                                            link.id
                                                        }`
                                                    }
                                                    title={link.title}
                                                />
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    <Youtube className="h-10 w-10 text-muted-foreground" />
                                    <h3 className="font-semibold">
                                        No videos shared yet
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        This user hasn't shared any YouTube
                                        videos.
                                    </p>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="about" className="space-y-4 pt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>About {user.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-medium">Bio</h3>
                                    <p className="text-muted-foreground">
                                        {user.bio || "No bio provided"}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium">Location</h3>
                                    <p className="text-muted-foreground">
                                        {user.location ||
                                            "No location provided"}
                                    </p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <p className="text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>

                                {user.createdAt && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h3 className="font-medium">
                                                Member Since
                                            </h3>
                                            <p className="text-muted-foreground">
                                                {format(
                                                    new Date(user.createdAt),
                                                    "d MMMM yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </motion.div>
        </MainLayout>
    );
}
