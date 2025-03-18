import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export default function SearchSort({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange,
    debouncedSearchTerm,
}) {
    return (
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search content..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                {searchTerm && searchTerm !== debouncedSearchTerm && (
                    <div className="absolute right-2.5 top-2.5 h-4 w-4">
                        <LoadingSpinner size="xs" />
                    </div>
                )}
            </div>
            <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
