import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ErrorState({ error }) {
    return (
        <MainLayout>
            <div className="flex h-[70vh] items-center justify-center">
                <Alert variant="destructive" className="max-w-md">
                    <AlertDescription>
                        {error?.message ||
                            "Failed to load user profile. Please try again."}
                    </AlertDescription>
                </Alert>
            </div>
        </MainLayout>
    );
}
