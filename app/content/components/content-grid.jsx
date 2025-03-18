import { motion } from "framer-motion";
import { Search } from "lucide-react";
import ContentCard from "./content-card";

export default function ContentGrid({ filteredContent }) {
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

    if (!filteredContent || filteredContent.length === 0) {
        return (
            <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Search className="h-10 w-10 text-muted-foreground" />
                    <h3 className="font-semibold">No content found</h3>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filters.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
            {filteredContent.map((item) => (
                <motion.div key={item.id} variants={item}>
                    <ContentCard item={item} />
                </motion.div>
            ))}
        </motion.div>
    );
}
