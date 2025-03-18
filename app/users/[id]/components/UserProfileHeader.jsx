import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar, Mail, MapPin, Youtube } from "lucide-react";
import { useState } from "react";

export default function UserProfileHeader({ user, currentUserId }) {
    const [imageError, setImageError] = useState(false);

    return (
        <Card>
            <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                        }}
                    >
                        <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                            {/* Only show AvatarImage if not in error state */}
                            {!imageError && (
                                <AvatarImage
                                    src={getProfilePictureUrl(
                                        user.profilePictureUrl
                                    )}
                                    alt={user.name}
                                    onError={(e) => {
                                        console.error(
                                            "Image failed to load:",
                                            e.target.src
                                        );
                                        setImageError(true);
                                    }}
                                />
                            )}
                            <AvatarFallback className="text-2xl">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </motion.div>

                    <div className="space-y-2">
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl">
                                {user.name}{" "}
                                {currentUserId &&
                                    user.id === currentUserId &&
                                    "(You)"}
                            </h1>
                            <p className="text-muted-foreground">
                                {user.bio || "No bio provided"}
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                            {user.location && (
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <MapPin className="h-3 w-3" />
                                    {user.location}
                                </Badge>
                            )}
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <Mail className="h-3 w-3" />
                                {user.email}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <Youtube className="h-3 w-3" />
                                {user.youtubeLinks?.length || 0} videos
                            </Badge>
                            {user.createdAt && (
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <Calendar className="h-3 w-3" />
                                    Joined{" "}
                                    {format(
                                        new Date(user.createdAt),
                                        "d MMMM yyyy"
                                    )}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
