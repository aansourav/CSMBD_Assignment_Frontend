"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useApp } from "@/context/app-context";
import { post } from "@/services/api";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// Login validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
    const router = useRouter();
    const { login, setLoading, refreshAccessToken, isAuthenticated } = useApp();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (values, { setSubmitting }) => {
        setLoginError("");
        setLoading(true);

        try {
            // Use the API service to make the request
            const response = await post("/auth/signin", {
                email: values.email,
                password: values.password,
            });

            // Handle successful login
            if (response.success) {
                const { accessToken, refreshToken, user } = response.data;

                // Login user with the returned data
                login(user, accessToken, refreshToken);

                // Redirect to profile page
                router.push("/");
            } else {
                // Handle unsuccessful login but with a success:false response
                setLoginError(
                    response.message ||
                        "Login failed. Please check your credentials."
                );
            }
        } catch (error) {
            console.error("Login error:", error);
            setLoginError(error.message || "Invalid email or password");
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex items-center justify-center bg-background p-4 ">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md "
                >
                    <Card className="border-muted/40 shadow-lg bg-gray-950">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Sign In
                            </CardTitle>
                            <CardDescription>
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loginError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>
                                        {loginError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Formik
                                initialValues={{ email: "", password: "" }}
                                validationSchema={LoginSchema}
                                onSubmit={handleLogin}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Field
                                                as={Input}
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="name@example.com"
                                                className={
                                                    errors.email &&
                                                    touched.email
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="text-sm text-destructive"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="password"
                                                    name="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    className={
                                                        errors.password &&
                                                        touched.password
                                                            ? "border-destructive pr-10"
                                                            : "pr-10"
                                                    }
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                                                    onClick={() =>
                                                        setShowPassword(
                                                            !showPassword
                                                        )
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showPassword
                                                            ? "Hide password"
                                                            : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="text-sm text-destructive"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center">
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Signing In...
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <LogIn className="mr-2 h-4 w-4" />
                                                    Sign In
                                                </div>
                                            )}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </MainLayout>
    );
}
