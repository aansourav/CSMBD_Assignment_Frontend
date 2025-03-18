import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { motion } from "framer-motion";
import { User, Youtube } from "lucide-react";
import Link from "next/link";

export default function UserCard({ user, variants }) {
    return (
        <motion.div variants={variants}>
            <Link href={`/users/${user.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-6">
                        <div className="flex flex-col items-center space-y-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage
                                    src={getProfilePictureUrl(
                                        user.profilePictureUrl
                                    )}
                                    alt={user.name}
                                />
                                <AvatarFallback className="text-lg">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 text-center">
                                <h3 className="font-semibold">{user.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {user.location || "No location"}
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
                            <span>{user.youtubeLinks?.length || 0}</span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}
