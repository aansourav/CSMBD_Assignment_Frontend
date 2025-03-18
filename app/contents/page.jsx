"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useApp } from "@/context/app-context";
import { get } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import ContentGrid from "./components/content-grid";
import ContentPagination from "./components/content-pagination";
import SearchSort from "./components/search-sort";

export default function ContentPage() {
    const { refreshAccessToken } = useApp();
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch content data with TanStack Query
    const {
        data: apiResponse,
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
            ),
        staleTime: 1000 * 60, // 1 minute
    });

    // Extract content and pagination data from API response
    const contentData = apiResponse?.data || [];
    const paginationData = apiResponse?.pagination;

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
                    <SearchSort
                        searchTerm={searchTerm}
                        onSearchChange={handleSearchChange}
                        sortBy={sortBy}
                        onSortChange={handleSortChange}
                        debouncedSearchTerm={debouncedSearchTerm}
                    />
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

                        <ContentGrid filteredContent={filteredContent} />
                    </>
                )}

                {/* Show pagination when we have pagination data */}
                {!isLoading &&
                    !isError &&
                    !debouncedSearchTerm &&
                    paginationData && (
                        <ContentPagination
                            pagination={paginationData}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
            </div>
        </MainLayout>
    );
}
