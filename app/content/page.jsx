"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import YoutubeEmbed from "@/components/youtube-embed";
import { BASE_URL } from "@/config/url";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function ContentPage() {
    const { refreshAccessToken } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Number of items per page

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch content data with TanStack Query
    const {
        data: contentData,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["content", sortBy, currentPage, itemsPerPage],
        queryFn: () =>
            get(
                `/users/content?page=${currentPage}&limit=${itemsPerPage}&sortBy=${sortBy}`,
                {},
                refreshAccessToken
            ).then((response) => response.data),
        staleTime: 1000 * 60, // 1 minute
    });

    // Filter content based on search term
    const filteredContent = useMemo(() => {
        if (!contentData) return [];

        if (!debouncedSearchTerm) {
            return contentData;
        }

        return contentData.filter((item) =>
            item.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [contentData, debouncedSearchTerm]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
    };

    // Handle sort change
    const handleSortChange = (value) => {
        setSortBy(value);
        setCurrentPage(1); // Reset to first page on new sort
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
                            Content
                        </h1>
                        <p className="text-muted-foreground">
                            Discover videos shared by users on the platform.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search content..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            {searchTerm &&
                                searchTerm !== debouncedSearchTerm && (
                                    <div className="absolute right-2.5 top-2.5 h-4 w-4">
                                        <LoadingSpinner size="xs" />
                                    </div>
                                )}
                        </div>
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="popular">Popular</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="flex h-[400px] items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-lg font-medium text-muted-foreground">
                                Loading content...
                            </p>
                        </div>
                    </div>
                )}

                {/* Error state */}
                {isError && (
                    <Alert variant="destructive" className="my-4">
                        <AlertDescription>
                            {error?.message ||
                                "Failed to load content. Please try again."}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Only show content grid when not loading */}
                {!isLoading && !isError && (
                    <>
                        {debouncedSearchTerm && (
                            <p className="text-sm text-muted-foreground mb-4">
                                {filteredContent.length} results for "
                                {debouncedSearchTerm}"
                            </p>
                        )}

                        {filteredContent && filteredContent.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                            >
                                {filteredContent.map((item) => (
                                    <motion.div key={item.id} variants={item}>
                                        <Card className="overflow-hidden transition-all hover:shadow-md">
                                            <CardHeader className="p-4">
                                                <CardTitle className="line-clamp-1 text-lg">
                                                    {item.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                <YoutubeEmbed
                                                    url={
                                                        item.url ||
                                                        item.youtubeUrl ||
                                                        `https://www.youtube.com/watch?v=${
                                                            item.videoId ||
                                                            item.id
                                                        }`
                                                    }
                                                    title={item.title}
                                                />
                                            </CardContent>
                                            <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                                                <Link
                                                    href={`/users/${item.user.id}`}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={
                                                                item.user
                                                                    .profilePictureUrl
                                                                    ? item.user.profilePictureUrl.startsWith(
                                                                          "http"
                                                                      )
                                                                        ? item
                                                                              .user
                                                                              .profilePictureUrl
                                                                        : `${BASE_URL}${item.user.profilePictureUrl}`
                                                                    : "/placeholder.svg?height=32&width=32"
                                                            }
                                                            alt={item.user.name}
                                                        />
                                                        <AvatarFallback>
                                                            {item.user.name.charAt(
                                                                0
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm font-medium">
                                                        {item.user.name}
                                                    </span>
                                                </Link>
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                item.addedAt
                                                            ),
                                                            "d MMMM yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                                <div className="flex flex-col items-center space-y-2 text-center">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                    <h3 className="font-semibold">
                                        No content found
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search or filters.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {contentData?.pagination &&
                    contentData.pagination.totalPages > 1 &&
                    !isLoading &&
                    !debouncedSearchTerm && (
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() =>
                                            setCurrentPage((prev) =>
                                                Math.max(prev - 1, 1)
                                            )
                                        }
                                        disabled={
                                            !contentData.pagination
                                                .hasPreviousPage
                                        }
                                        className={
                                            !contentData.pagination
                                                .hasPreviousPage
                                                ? "pointer-events-none opacity-50"
                                                : "cursor-pointer"
                                        }
                                    />
                                </PaginationItem>

                                {Array.from(
                                    {
                                        length: contentData.pagination
                                            .totalPages,
                                    },
                                    (_, i) => i + 1
                                ).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            onClick={() => setCurrentPage(page)}
                                            isActive={
                                                contentData.pagination
                                                    .currentPage === page
                                            }
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
                                                    contentData.pagination
                                                        .totalPages
                                                )
                                            )
                                        }
                                        disabled={
                                            !contentData.pagination.hasNextPage
                                        }
                                        className={
                                            !contentData.pagination.hasNextPage
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
