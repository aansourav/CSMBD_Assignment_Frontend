"use client";

import MainLayout from "@/components/layout/main-layout";
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
import { useApp } from "@/context/app-context";
import { dummyUsers } from "@/data/dummy-data";
import { motion } from "framer-motion";
import { Search, User, Youtube } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
    const { setLoading, loading } = useApp();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        // Simulate loading data
        setLoading(true);

        setTimeout(() => {
            // Filter users based on search term
            const filteredUsers = dummyUsers.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Pagination
            const itemsPerPage = 8;
            const totalItems = filteredUsers.length;
            const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage);

            setTotalPages(calculatedTotalPages);

            // Get current page items
            const startIndex = (currentPage - 1) * itemsPerPage;
            const paginatedUsers = filteredUsers.slice(
                startIndex,
                startIndex + itemsPerPage
            );

            setUsers(paginatedUsers);
            setLoading(false);
        }, 500);
    }, [searchTerm, currentPage, setLoading]);

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
                    </div>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex h-[400px] items-center justify-center">
                        <div className="flex flex-col items-center space-y-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-lg font-medium text-muted-foreground">
                                Loading users...
                            </p>
                        </div>
                    </div>
                )}

                {/* Only show users grid when not loading */}
                {!loading && (
                    <>
                        {users.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                            >
                                {users.map((user) => (
                                    <motion.div key={user.id} variants={item}>
                                        <Link href={`/users/${user.id}`}>
                                            <Card className="overflow-hidden transition-all hover:shadow-md">
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col items-center space-y-4">
                                                        <Avatar className="h-20 w-20">
                                                            <AvatarImage
                                                                src={
                                                                    user.profilePictureUrl ||
                                                                    "/placeholder.svg?height=80&width=80"
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

                {totalPages > 1 && !loading && (
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

                            {[...Array(totalPages)].map((_, i) => (
                                <PaginationItem key={i}>
                                    <PaginationLink
                                        onClick={() => setCurrentPage(i + 1)}
                                        isActive={currentPage === i + 1}
                                    >
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        setCurrentPage((prev) =>
                                            Math.min(prev + 1, totalPages)
                                        )
                                    }
                                    disabled={currentPage === totalPages}
                                    className={
                                        currentPage === totalPages
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
