import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import YoutubeEmbed from "@/components/youtube-embed";
import { del } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Trash2, Youtube } from "lucide-react";

export default function YoutubeVideoList({
    user,
    refreshAccessToken,
    setLoading,
}) {
    const queryClient = useQueryClient();

    const deleteYoutubeMutation = useMutation({
        mutationFn: (linkId) => {
            return del(
                `/users/profile/youtube/${linkId}`,
                {},
                refreshAccessToken
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
        onError: (error) => {
            console.error("Delete YouTube link error:", error);
        },
    });

    const handleDeleteYoutubeLink = async (linkId) => {
        setLoading(true);
        try {
            await deleteYoutubeMutation.mutateAsync(linkId);
        } catch (error) {
            console.error("Delete YouTube link error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Videos</h3>

            {user.youtubeLinks && user.youtubeLinks.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    {user.youtubeLinks.map((link, index) => (
                        <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader className="p-4">
                                    <CardTitle className="flex items-center justify-between text-lg">
                                        <span className="line-clamp-1">
                                            {link.title}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() =>
                                                handleDeleteYoutubeLink(link.id)
                                            }
                                            disabled={
                                                deleteYoutubeMutation.isPending
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete
                                            </span>
                                        </Button>
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
                        <h3 className="font-semibold">No videos yet</h3>
                        <p className="text-sm text-muted-foreground">
                            Add YouTube videos to share on your profile.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
