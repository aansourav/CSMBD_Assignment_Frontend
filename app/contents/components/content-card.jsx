import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import YoutubeEmbed from "@/components/youtube-embed";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import Link from "next/link";

export default function ContentCard({ item }) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-4">
                <CardTitle className="line-clamp-1 text-lg">
                    {item.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <YoutubeEmbed
                    url={
                        item.url ||
                        item.youtubeUrl ||
                        `https://www.youtube.com/watch?v=${
                            item.videoId || item.id
                        }`
                    }
                    title={item.title}
                />
            </CardContent>
            <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                <Link
                    href={`/users/${item.user.id}`}
                    className="flex items-center space-x-2"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage
                            src={getProfilePictureUrl(
                                item.user.profilePictureUrl
                            )}
                            alt={item.user.name}
                        />
                        <AvatarFallback>
                            {item.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                        {item.user.name}
                    </span>
                </Link>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{format(new Date(item.addedAt), "d MMMM yyyy")}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
