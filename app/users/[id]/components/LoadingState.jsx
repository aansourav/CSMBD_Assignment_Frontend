import MainLayout from "@/components/layout/main-layout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function LoadingState() {
    return (
        <MainLayout>
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner size="lg" />
                    <p className="text-lg font-medium text-muted-foreground">
                        Loading user profile...
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
