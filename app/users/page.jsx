"use client";

import MainLayout from "@/components/layout/main-layout";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import UserGrid from "./components/UserGrid";
import UserPagination from "./components/UserPagination";
import UserSearch from "./components/UserSearch";

export default function UsersPage() {
    const { refreshAccessToken } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [itemsPerPage] = useState(8);

    // Debounce search term with proper useEffect (1000ms debounce)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 1000);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch users with TanStack Query - using server-side pagination
    const {
        data: apiResponse,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["users", currentPage, itemsPerPage, debouncedSearchTerm],
        queryFn: () => {
            // Build query parameters
            const params = new URLSearchParams();
            params.append("page", currentPage);
            params.append("limit", itemsPerPage);

            // Add search term if provided
            if (debouncedSearchTerm) {
                params.append("search", debouncedSearchTerm);
            }

            return get(`/users?${params.toString()}`, {}, refreshAccessToken);
        },
        staleTime: 0,
        refetchOnMount: "always", // Always refetch when component mounts
        refetchOnWindowFocus: true, // Refetch when window regains focus
    });

    // Extract data and pagination from API response
    const userData = apiResponse?.data || [];
    const paginationData = apiResponse?.pagination;

    // Create filtered users object with correct structure for UserGrid
    const paginatedFilteredUsers = useMemo(() => {
        return {
            users: userData,
            pagination: paginationData || {
                total: 0,
                totalPages: 0,
                currentPage: currentPage,
                hasNextPage: false,
                hasPreviousPage: currentPage > 1,
            },
        };
    }, [userData, paginationData, currentPage]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Users
                        </h1>
                        <p className="text-muted-foreground">
                            Browse and discover users on the platform.
                        </p>
                    </div>
                    <UserSearch
                        searchTerm={searchTerm}
                        debouncedSearchTerm={debouncedSearchTerm}
                        handleSearchChange={handleSearchChange}
                    />
                </div>

                <UserGrid
                    isLoading={isLoading}
                    isError={isError}
                    error={error}
                    paginatedFilteredUsers={paginatedFilteredUsers}
                    debouncedSearchTerm={debouncedSearchTerm}
                />

                {paginationData && paginationData.totalPages > 1 && (
                    <UserPagination
                        pagination={paginationData}
                        setCurrentPage={setCurrentPage}
                    />
                )}
            </div>
        </MainLayout>
    );
}
