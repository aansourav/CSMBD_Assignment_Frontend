import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center space-y-6 p-8">
                <div className="flex justify-center">
                    <FileQuestion className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight">
                    404 - Page Not Found
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex justify-center">
                    <Button asChild>
                        <Link href="/">Return Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
