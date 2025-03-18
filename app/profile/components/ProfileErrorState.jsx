import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfileErrorState({ error }) {
    const router = useRouter();

    return (
        <MainLayout>
            <div className="space-y-6">
                <Alert variant="destructive">
                    <AlertDescription>
                        {error?.message ||
                            "Failed to load profile data. Please try again."}
                    </AlertDescription>
                </Alert>
                <Button onClick={() => router.push("/")}>Back to Home</Button>
            </div>
        </MainLayout>
    );
}
