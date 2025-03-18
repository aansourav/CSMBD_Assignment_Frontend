import MainLayout from "@/components/layout/main-layout";

export default function UserNotFound() {
    return (
        <MainLayout>
            <div className="flex h-[70vh] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">User not found</h2>
                    <p className="text-muted-foreground">
                        The user you're looking for doesn't exist or has been
                        removed.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
