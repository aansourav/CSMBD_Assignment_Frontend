import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ContentPagination({
    pagination,
    currentPage,
    onPageChange,
}) {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() =>
                            onPageChange(Math.max(currentPage - 1, 1))
                        }
                        disabled={!pagination.hasPreviousPage}
                        className={
                            !pagination.hasPreviousPage
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                ).map((page) => (
                    <PaginationItem key={page}>
                        <PaginationLink
                            onClick={() => onPageChange(page)}
                            isActive={pagination.currentPage === page}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={() =>
                            onPageChange(
                                Math.min(currentPage + 1, pagination.totalPages)
                            )
                        }
                        disabled={!pagination.hasNextPage}
                        className={
                            !pagination.hasNextPage
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
