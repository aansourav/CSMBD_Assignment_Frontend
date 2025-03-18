import MainLayout from "@/components/layout/main-layout";
import { LoadingOverlay } from "@/components/ui/loading-spinner";

export default function ProfileLoadingState() {
    return (
        <MainLayout>
            <div className="flex items-center justify-center min-h-screen">
                <LoadingOverlay message="Loading profile data..." />
            </div>
        </MainLayout>
    );
}
