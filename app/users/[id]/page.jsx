"use client";

import MainLayout from "@/components/layout/main-layout";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import UserNotFound from "./components/UserNotFound";
import UserProfileHeader from "./components/UserProfileHeader";
import UserProfileTabs from "./components/UserProfileTabs";

export default function UserProfilePage() {
    const { id } = useParams();
    const { refreshAccessToken, user: currentUser, isAuthenticated } = useApp();

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

    if (isLoading) {
        return <LoadingState />;
    }

    if (isError) {
        return <ErrorState error={error} />;
    }

    if (!userData) {
        return <UserNotFound />;
    }

    return (
        <MainLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >
                <UserProfileHeader
                    user={userData}
                    currentUserId={isAuthenticated ? currentUser?.id : null}
                />
                <UserProfileTabs user={userData} />
            </motion.div>
        </MainLayout>
    );
}
