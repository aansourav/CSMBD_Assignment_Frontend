import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import UserCard from "./UserCard";

export default function UserGrid({
    isLoading,
    isError,
    error,
    paginatedFilteredUsers,
    debouncedSearchTerm,
}) {
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

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-lg font-medium text-muted-foreground">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <Alert variant="destructive">
                <AlertDescription>
                    {error?.message ||
                        "Failed to load users. Please try again."}
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <>
            {debouncedSearchTerm && (
                <p className="text-sm text-muted-foreground mb-4">
                    {paginatedFilteredUsers.pagination?.total} results for "
                    {debouncedSearchTerm}"
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
                        <UserCard key={user.id} user={user} variants={item} />
                    ))}
                </motion.div>
            ) : (
                <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <User className="h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No users found</h3>
                        <p className="text-sm text-muted-foreground">
                            Try adjusting your search or filters.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
