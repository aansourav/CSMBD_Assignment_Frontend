"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApp } from "@/context/app-context";
import { motion } from "framer-motion";
import { LogIn, Settings, User, UserPlus, Users, Youtube } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const { isAuthenticated } = useApp();

    const menuItems = [
        {
            title: "Browse",
            items: [
                {
                    title: "Users",
                    href: "/users",
                    icon: <Users className="h-4 w-4 mr-2" />,
                },
                {
                    title: "Content",
                    href: "/content",
                    icon: <Youtube className="h-4 w-4 mr-2" />,
                },
            ],
        },
    ];

    if (isAuthenticated) {
        menuItems.push({
            title: "Account",
            items: [
                {
                    title: "Profile",
                    href: "/profile",
                    icon: <User className="h-4 w-4 mr-2" />,
                },
                {
                    title: "Settings",
                    href: "",
                    icon: <Settings className="h-4 w-4 mr-2" />,
                },
            ],
        });
    } else {
        menuItems.push({
            title: "Account",
            items: [
                {
                    title: "Sign In",
                    href: "/signin",
                    icon: <LogIn className="h-4 w-4 mr-2" />,
                },
                {
                    title: "Sign Up",
                    href: "/signup",
                    icon: <UserPlus className="h-4 w-4 mr-2" />,
                },
            ],
        });
    }

    return (
        <div className="h-screen w-64 border-r bg-background">
            <ScrollArea className="h-full py-6 px-3 mt-6">
                <div className="flex flex-col space-y-6">
                    {menuItems.map((section, i) => (
                        <div key={i} className="space-y-2">
                            <h3 className="px-4 text-sm font-medium text-muted-foreground">
                                {section.title}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item, j) => (
                                    <motion.div
                                        key={j}
                                        whileHover={{ x: 5 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 10,
                                        }}
                                    >
                                        <Link href={item.href}>
                                            <Button
                                                variant={
                                                    pathname === item.href
                                                        ? "secondary"
                                                        : "ghost"
                                                }
                                                className="w-full justify-start"
                                            >
                                                {item.icon}
                                                {item.title}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
