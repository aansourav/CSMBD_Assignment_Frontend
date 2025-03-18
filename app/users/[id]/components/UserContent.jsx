import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import YoutubeEmbed from "@/components/youtube-embed";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Youtube } from "lucide-react";

export default function UserContent({ user }) {
    return (
        <div className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">Shared Videos</h2>

            {user.youtubeLinks && user.youtubeLinks.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {user.youtubeLinks.map((link, index) => (
                        <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">
                                        {link.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Added on{" "}
                                        {format(
                                            new Date(link.addedAt),
                                            "d MMMM yyyy"
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <YoutubeEmbed
                                        url={
                                            link.url ||
                                            link.youtubeUrl ||
                                            `https://www.youtube.com/watch?v=${
                                                link.videoId || link.id
                                            }`
                                        }
                                        title={link.title}
                                    />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center space-y-2 text-center">
                        <Youtube className="h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No videos shared yet</h3>
                        <p className="text-sm text-muted-foreground">
                            This user hasn't shared any YouTube videos.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
