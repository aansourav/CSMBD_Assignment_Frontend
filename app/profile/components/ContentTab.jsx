import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import YoutubeAddForm from "./YoutubeAddForm";
import YoutubeVideoList from "./YoutubeVideoList";

export default function ContentTab({ user, refreshAccessToken, setLoading }) {
    const [youtubeError, setYoutubeError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your YouTube Content</CardTitle>
                <CardDescription>
                    Add and manage YouTube videos on your profile.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {youtubeError && (
                    <Alert variant="destructive">
                        <AlertDescription>{youtubeError}</AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert className="border-green-500 text-green-500">
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                <YoutubeAddForm
                    refreshAccessToken={refreshAccessToken}
                    setLoading={setLoading}
                    setYoutubeError={setYoutubeError}
                    setSuccessMessage={setSuccessMessage}
                />

                <Separator />

                <YoutubeVideoList
                    user={user}
                    refreshAccessToken={refreshAccessToken}
                    setLoading={setLoading}
                />
            </CardContent>
        </Card>
    );
}
