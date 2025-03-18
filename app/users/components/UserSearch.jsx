import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Search } from "lucide-react";

export default function UserSearch({
    searchTerm,
    debouncedSearchTerm,
    handleSearchChange,
}) {
    return (
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
    );
}
