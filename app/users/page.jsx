"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { BASE_URL } from "@/config/url";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, User, Youtube } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

    // Animation variants for staggered list
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 },
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
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search users..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        {searchTerm && searchTerm !== debouncedSearchTerm && (
                            <div className="absolute right-2.5 top-2.5 h-4 w-4">
                                <LoadingSpinner size="xs" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex h-[400px] items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-lg font-medium text-muted-foreground">
                                Loading users...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error?.message ||
                                "Failed to load users. Please try again."}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Only show users grid when not loading */}
                {!isLoading && !isError && (
                    <>
                        {debouncedSearchTerm && (
                            <p className="text-sm text-muted-foreground mb-4">
                                {paginatedFilteredUsers.pagination?.total}{" "}
                                results for "{debouncedSearchTerm}"
                            </p>
                        )}

                        {paginatedFilteredUsers.users &&
                        paginatedFilteredUsers.users.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                {paginatedFilteredUsers.users.map((user) => (
                                    <motion.div key={user.id} variants={item}>
                                        <Link href={`/users/${user.id}`}>
                                            <Card className="overflow-hidden transition-all hover:shadow-md">
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col items-center space-y-4">
                                                        <Avatar className="h-20 w-20">
                                                            <AvatarImage
                                                                src={
                                                                    user.profilePictureUrl
                                                                        ? user.profilePictureUrl.startsWith(
                                                                              "http"
                                                                          )
                                                                            ? user.profilePictureUrl
                                                                            : `${BASE_URL}${user.profilePictureUrl}`
                                                                        : "/placeholder.svg?height=80&width=80"
                                                                }
                                                                alt={user.name}
                                                            />
                                                            <AvatarFallback className="text-lg">
                                                                {user.name.charAt(
                                                                    0
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="space-y-1 text-center">
                                                            <h3 className="font-semibold">
                                                                {user.name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground">
                                                                {user.location ||
                                                                    "No location"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="flex justify-between bg-muted/50 px-6 py-3">
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <User className="mr-1 h-4 w-4" />
                                                        <span>Profile</span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <Youtube className="mr-1 h-4 w-4" />
                                                        <span>
                                                            {user.youtubeLinks
                                                                ?.length || 0}
                                                        </span>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    <User className="h-10 w-10 text-muted-foreground" />
                                    <h3 className="font-semibold">
                                        No users found
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search or filters.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {paginatedFilteredUsers.pagination &&
                    paginatedFilteredUsers.pagination.totalPages > 1 &&
                    !isLoading && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className={
                                            currentPage === 1
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>

                                {Array.from(
                                    {
                                        length: paginatedFilteredUsers
                                            .pagination.totalPages,
                                    },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(page)}
                                            isActive={currentPage === page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.min(
                                                    prev + 1,
                                                    paginatedFilteredUsers
                                                        .pagination.totalPages
                                                )
                                            )
                                        }
                                        disabled={
                                            currentPage ===
                                            paginatedFilteredUsers.pagination
                                                .totalPages
                                        }
                                        className={
                                            currentPage ===
                                            paginatedFilteredUsers.pagination
                                                .totalPages
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
            </div>
        </MainLayout>
    );
}
