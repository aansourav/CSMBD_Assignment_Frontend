import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export default function UserAbout({ user }) {
    return (
        <div className="space-y-4 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle>About {user.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-medium">Bio</h3>
                        <p className="text-muted-foreground">
                            {user.bio || "No bio provided"}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-muted-foreground">
                            {user.location || "No location provided"}
                        </p>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>

                    {user.createdAt && (
                        <>
                            <Separator />
                            <div>
                                <h3 className="font-medium">Member Since</h3>
                                <p className="text-muted-foreground">
                                    {format(
                                        new Date(user.createdAt),
                                        "d MMMM yyyy"
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
