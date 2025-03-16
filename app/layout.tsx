import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/context/app-context";
import AuthMiddleware from "@/middleware/auth-middleware";
import "./globals.css";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning className="dark">
            <head>
                <title>CSMBD Social Platform</title>
                <meta
                    name="description"
                    content="A social platform for sharing content"
                />
            </head>
            <body>
                <AppProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                    >
                        <AuthMiddleware>{children}</AuthMiddleware>
                        <Toaster />
                    </ThemeProvider>
                </AppProvider>
            </body>
        </html>
    );
}

import "./globals.css";

export const metadata = {
    generator: "v0.dev",
};
