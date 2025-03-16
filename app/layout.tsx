import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/app-context";
import AuthMiddleware from "@/middleware/auth-middleware";
import "./globals.css";

export const metadata = {
    title: "CSMBD Social Platform",
    description: "A social platform for sharing content",
    generator: "v0.dev",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className="dark">
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                >
                    <Providers>
                        <AppProvider>
                            <AuthMiddleware>{children}</AuthMiddleware>
                        </AppProvider>
                    </Providers>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
