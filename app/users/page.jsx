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

    // Fetch users with TanStack Query - without search parameter
    const {
        data: apiResponse,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["users"],
        queryFn: () =>
            get(
                `/users?limit=100`, // Get more users to allow for local filtering
                {},
                refreshAccessToken
            ).then((response) => response.data),
        staleTime: 1000 * 60 * 2, // 2 minutes
    });

    // Filter and paginate users locally using the debounced search term
    const paginatedFilteredUsers = useMemo(() => {
        // If no data yet, return empty array
        if (!apiResponse) return [];

        // Filter users by search term
        const filteredUsers = debouncedSearchTerm
            ? apiResponse.filter(
                  (user) =>
                      user.name
                          .toLowerCase()
                          .includes(debouncedSearchTerm.toLowerCase()) ||
                      (user.email &&
                          user.email
                              .toLowerCase()
                              .includes(debouncedSearchTerm.toLowerCase())) ||
                      (user.location &&
                          user.location
                              .toLowerCase()
                              .includes(debouncedSearchTerm.toLowerCase()))
              )
            : apiResponse;

        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        return {
            users: filteredUsers.slice(startIndex, startIndex + itemsPerPage),
            pagination: {
                total: filteredUsers.length,
                totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
                currentPage: currentPage,
                hasNextPage:
                    currentPage <
                    Math.ceil(filteredUsers.length / itemsPerPage),
                hasPreviousPage: currentPage > 1,
            },
        };
    }, [apiResponse, debouncedSearchTerm, currentPage, itemsPerPage]);

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

                <UserPagination
                    pagination={paginatedFilteredUsers.pagination}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </MainLayout>
    );
}
