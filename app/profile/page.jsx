"use client";

import MainLayout from "@/components/layout/main-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BASE_URL } from "@/config/url";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ContentTab from "./components/ContentTab";
import ProfileErrorState from "./components/ProfileErrorState";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInformationForm from "./components/ProfileInformationForm";
import ProfileLoadingState from "./components/ProfileLoadingState";

export default function ProfilePage() {
    const router = useRouter();
    const { isAuthenticated, refreshAccessToken, setLoading, tokenChecked } =
        useApp();
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoadingState] = useState(false);

    // Fetch profile data using React Query
    const {
        data: profileData,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () =>
            get("/users/profile/me", {}, refreshAccessToken).then(
                (response) => response.data
            ),
        enabled: !!isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        onError: (error) => {
            setProfileError(error.message || "Failed to load profile data");
        },
    });

    // Redirect if not authenticated, but only after token check is complete
    useEffect(() => {
        if (tokenChecked && !isAuthenticated) {
            router.push("/signin");
        }
    }, [isAuthenticated, router, tokenChecked]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Debug and handle profile data when it loads
    useEffect(() => {
        if (profileData) {
            console.log("Profile data loaded:", profileData);
            console.log("Profile picture URL:", profileData.profilePictureUrl);
            console.log("YouTube links:", profileData.youtubeLinks);

            // If we have a profile picture URL from the API, test if it's valid
            if (profileData.profilePictureUrl) {
                const fullUrl = profileData.profilePictureUrl.startsWith("http")
                    ? profileData.profilePictureUrl
                    : `${BASE_URL}${profileData.profilePictureUrl}`;

                console.log("Trying to load profile picture from:", fullUrl);
            }
        }
    }, [profileData]);

    // Show loading state if authentication check is still in progress or user data is loading
    if (!tokenChecked || (isAuthenticated && isLoading)) {
        return <ProfileLoadingState />;
    }

    // After token check is complete, if not authenticated, render nothing (will redirect in useEffect)
    if (!isAuthenticated) {
        return null;
    }

    if (isError) {
        return <ProfileErrorState error={error} />;
    }

    const user = profileData;

    return (
        <MainLayout>
            <div className="space-y-6">
                <ProfileHeader />

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 pt-4">
                        <ProfileInformationForm
                            user={user}
                            refreshAccessToken={refreshAccessToken}
                            setLoading={setLoadingState}
                        />
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 pt-4">
                        <ContentTab
                            user={user}
                            refreshAccessToken={refreshAccessToken}
                            setLoading={setLoadingState}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
