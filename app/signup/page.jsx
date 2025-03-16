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
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// Registration validation schema
const RegisterSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

export default function RegisterPage() {
    const router = useRouter();
    const { login, setLoading, refreshAccessToken, isAuthenticated } = useApp();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [registerError, setRegisterError] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/");
        }
    }, [isAuthenticated, router]);

    const handleRegister = async (values, { setSubmitting }) => {
        setRegisterError("");
        setLoading(true);

        try {
            // Use the API service to make the request
            const response = await post(
                "/auth/signup",
                {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                },
                {},
                refreshAccessToken
            );

            // Handle successful registration
            if (response.success) {
                const { accessToken, refreshToken, user } = response.data;

                // Login user with the returned data
                login(user, accessToken, refreshToken);

                // Show success toast
                toast({
                    title: "Account created successfully. You are now logged in",
                    variant: "success",
                });

                // Redirect to homepage
                router.push("/");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setRegisterError(
                error.message ||
                    "An unexpected error occurred. Please try again."
            );
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            {" "}
            <div className="flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-muted/40 shadow-lg bg-gray-950">
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Create an Account
                            </CardTitle>
                            <CardDescription>
                                Enter your information to create an account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {registerError && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>
                                        {registerError}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <Formik
                                initialValues={{
                                    name: "",
                                    email: "",
                                    password: "",
                                    confirmPassword: "",
                                }}
                                validationSchema={RegisterSchema}
                                onSubmit={handleRegister}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Name</Label>
                                            <Field
                                                as={Input}
                                                id="name"
                                                name="name"
                                                placeholder="John Doe"
                                                className={
                                                    errors.name && touched.name
                                                        ? "border-destructive"
                                                        : ""
                                                }
                                            />
                                            <ErrorMessage
                                                name="name"
                                                component="div"
                                                className="text-sm text-destructive"
                                            />
                                        </div>

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

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">
                                                Confirm Password
                                            </Label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="••••••••"
                                                    className={
                                                        errors.confirmPassword &&
                                                        touched.confirmPassword
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
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showConfirmPassword
                                                            ? "Hide password"
                                                            : "Show password"}
                                                    </span>
                                                </Button>
                                            </div>
                                            <ErrorMessage
                                                name="confirmPassword"
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
                                                    Creating Account
                                                </div>
                                            ) : (
                                                <div className="flex items-center">
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Create Account
                                                </div>
                                            )}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                        <CardFooter className="text-center">
                            <div className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    href="/signin"
                                    className="font-medium text-primary underline-offset-4 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </div>
        </MainLayout>
    );
}
