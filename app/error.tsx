"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <div className="flex justify-center">
                    <AlertCircle className="h-16 w-16 text-destructive" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                    Oops! Something went wrong
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    We apologize for the inconvenience. An error occurred while
                    processing your request.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset} variant="default">
                        Try again
                    </Button>
                    <Button
                        onClick={() => (window.location.href = "/")}
                        variant="outline"
                    >
                        Go to homepage
                    </Button>
                </div>
            </div>
        </div>
    );
}
