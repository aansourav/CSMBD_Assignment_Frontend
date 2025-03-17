"use client";

import MainLayout from "@/components/layout/main-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton, LoadingOverlay } from "@/components/ui/loading-spinner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import YoutubeEmbed from "@/components/youtube-embed";
import { API_URL, BASE_URL } from "@/config/url";
import { useApp } from "@/context/app-context";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { del, get, post } from "@/services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { motion } from "framer-motion";
import {
    Mail,
    MapPin,
    Plus,
    Save,
    Trash2,
    Upload,
    User,
    Youtube,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

// Profile validation schema
const ProfileSchema = Yup.object().shape({
    name: Yup.string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be less than 50 characters")
        .required("Name is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    bio: Yup.string().max(500, "Bio must be less than 500 characters"),
    location: Yup.string().max(
        100,
        "Location must be less than 100 characters"
    ),
});

// YouTube link validation schema
const YouTubeLinkSchema = Yup.object().shape({
    title: Yup.string()
        .max(100, "Title must be less than 100 characters")
        .required("Title is required"),
    youtubeUrl: Yup.string()
        .matches(
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/,
            "Please enter a valid YouTube URL"
        )
        .required("YouTube URL is required"),
});

export default function ProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isAuthenticated, refreshAccessToken, setLoading } = useApp();
    const [profileError, setProfileError] = useState("");
    const [youtubeError, setYoutubeError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState("");

    // Fetch profile data using React Query
    const {
        data: profileData,
        isLoading,
        error,
        isError,
    } = useQuery({
        queryKey: ["profile"],
        queryFn: () =>
            get("/users/profile/me", {}, refreshAccessToken).then(
                (response) => response.data
            ),
        enabled: !!isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        onError: (error) => {
            setProfileError(error.message || "Failed to load profile data");
        },
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData) => {
            try {
                // Create a FormData object for multipart/form-data
                const formData = new FormData();
                formData.append("name", updatedData.name);
                formData.append("email", updatedData.email);

                if (updatedData.bio) {
                    formData.append("bio", updatedData.bio);
                }

                if (updatedData.location) {
                    formData.append("location", updatedData.location);
                }

                if (profilePicture) {
                    formData.append("profilePicture", profilePicture);
                    console.log(
                        "Adding profile picture to form data:",
                        profilePicture.name
                    );
                }

                // Log the API URL for debugging
                console.log(
                    "Profile update API URL:",
                    `${API_URL}/users/profile/me`
                );

                // Get the current access token
                const accessToken = localStorage.getItem("accessToken");

                // Custom fetch for FormData (we can't use the API service directly because
                // it automatically sets Content-Type: application/json, which won't work with FormData)
                const response = await fetch(`${API_URL}/users/profile/me`, {
                    method: "PUT",
                    headers: {
                        // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                // Handle token expiration
                if (response.status === 401 && refreshAccessToken) {
                    try {
                        // Try to refresh the token
                        const newToken = await refreshAccessToken();

                        // Retry the request with the new token
                        const retryResponse = await fetch(
                            `${API_URL}/users/profile/me`,
                            {
                                method: "PUT",
                                headers: {
                                    Authorization: `Bearer ${newToken}`,
                                },
                                body: formData,
                            }
                        );

                        if (!retryResponse.ok) {
                            const errorData = await retryResponse.json();
                            console.error(
                                "Profile update retry error:",
                                errorData
                            );
                            throw new Error(
                                errorData.message ||
                                    "Failed to update profile after token refresh"
                            );
                        }

                        return retryResponse.json();
                    } catch (refreshError) {
                        console.error(
                            "Token refresh failed during profile update:",
                            refreshError
                        );
                        throw new Error("Session expired. Please login again.");
                    }
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Profile update error response:", errorData);
                    throw new Error(
                        errorData.message || "Failed to update profile"
                    );
                }

                return response.json();
            } catch (error) {
                console.error("Profile update error:", error);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("Profile update success:", data);
            // Invalidate and refetch the profile data
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setSuccessMessage("Profile updated successfully");

            // Reset profile picture state
            setProfilePicture(null);
            setProfilePicturePreview("");
        },
        onError: (error) => {
            console.error("Profile update error:", error);
            setProfileError(error.message || "Failed to update profile");
        },
    });

    // Add YouTube link mutation
    const addYoutubeMutation = useMutation({
        mutationFn: (linkData) => {
            return post(
                "/users/profile/youtube",
                linkData,
                {},
                refreshAccessToken
            );
        },
        onSuccess: (data) => {
            console.log("YouTube link added successfully:", data);
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setSuccessMessage("YouTube link added successfully");
        },
        onError: (error) => {
            console.error("YouTube link error:", error);
            setYoutubeError(error.message || "Failed to add YouTube link");
        },
    });

    // Delete YouTube link mutation
    const deleteYoutubeMutation = useMutation({
        mutationFn: (linkId) => {
            return del(
                `/users/profile/youtube/${linkId}`,
                {},
                refreshAccessToken
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setSuccessMessage("YouTube link removed successfully");
        },
        onError: (error) => {
            setYoutubeError(error.message || "Failed to remove YouTube link");
        },
    });

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/signin");
        }
    }, [isAuthenticated, router]);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Handle profile picture change
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

    // Handle profile update
    const handleProfileUpdate = async (values, { setSubmitting }) => {
        setProfileError("");
        setSuccessMessage("");
        setLoading(true);

        try {
            await updateProfileMutation.mutateAsync(values);
        } catch (error) {
            console.error("Profile update error:", error);
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    // Handle YouTube link add
    const handleAddYoutubeLink = async (
        values,
        { setSubmitting, resetForm }
    ) => {
        setYoutubeError("");
        setSuccessMessage("");
        setLoading(true);

        console.log("Adding YouTube link with values:", values);

        // Extract video ID from URL
        const url = values.youtubeUrl;
        const videoId = url.includes("youtube.com/watch?v=")
            ? url.split("v=")[1].split("&")[0]
            : url.includes("youtu.be/")
            ? url.split("youtu.be/")[1]
            : "";

        if (!videoId) {
            setYoutubeError("Could not extract video ID from URL");
            setLoading(false);
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
                title: values.title,
            };

            console.log("Sending YouTube link data:", payload);

            await addYoutubeMutation.mutateAsync(payload);
            resetForm();
        } catch (error) {
            console.error("Add YouTube link error:", error);
            // Error is already set by the mutation's onError
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    // Handle YouTube link delete
    const handleDeleteYoutubeLink = async (linkId) => {
        setLoading(true);

        try {
            await deleteYoutubeMutation.mutateAsync(linkId);
        } catch (error) {
            console.error("Delete YouTube link error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debug and handle profile data when it loads
    useEffect(() => {
        if (profileData) {
            console.log("Profile data loaded:", profileData);
            console.log("Profile picture URL:", profileData.profilePictureUrl);
            console.log("YouTube links:", profileData.youtubeLinks);

            // If we have a profile picture URL from the API, test if it's valid
            if (profileData.profilePictureUrl) {
                const fullUrl = profileData.profilePictureUrl.startsWith("http")
                    ? profileData.profilePictureUrl
                    : `${BASE_URL}${profileData.profilePictureUrl}`;

                console.log("Trying to load profile picture from:", fullUrl);
            }
        }
    }, [profileData]);

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // Show loading state while fetching profile data
    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <LoadingOverlay message="Loading profile data..." />
                </div>
            </MainLayout>
        );
    }

    // Show error message if profile data fetch fails
    if (isError) {
        return (
            <MainLayout>
                <div className="space-y-6">
                    <Alert variant="destructive">
                        <AlertDescription>
                            {error?.message ||
                                "Failed to load profile data. Please try again."}
                        </AlertDescription>
                    </Alert>
                    <Button onClick={() => router.push("/")}>
                        Back to Home
                    </Button>
                </div>
            </MainLayout>
        );
    }

    const user = profileData;

    // Function to handle profile picture errors
    const handleProfilePictureError = (e) => {
        console.error("Error loading profile picture");
        e.target.src = "/placeholder.svg";
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Profile
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and content.
                    </p>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="content">Content</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-4 pt-4">
                        <Card>
                            {updateProfileMutation.isPending && (
                                <LoadingOverlay message="Updating profile..." />
                            )}
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>
                                    Update your profile information and how
                                    others see you on the site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {profileError && (
                                    <Alert
                                        variant="destructive"
                                        className="mb-4"
                                    >
                                        <AlertDescription>
                                            {profileError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {successMessage && (
                                    <Alert className="mb-4 border-green-500 text-green-500">
                                        <AlertDescription>
                                            {successMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Formik
                                    initialValues={{
                                        name: user.name || "",
                                        email: user.email || "",
                                        bio: user.bio || "",
                                        location: user.location || "",
                                    }}
                                    validationSchema={ProfileSchema}
                                    onSubmit={handleProfileUpdate}
                                    enableReinitialize
                                >
                                    {({ isSubmitting, errors, touched }) => (
                                        <Form className="space-y-6">
                                            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                                                <div className="relative">
                                                    <Avatar className="h-24 w-24">
                                                        <AvatarImage
                                                            src={
                                                                profilePicturePreview ||
                                                                getProfilePictureUrl(
                                                                    user.profilePictureUrl
                                                                )
                                                            }
                                                            alt={user.name}
                                                            onError={
                                                                handleProfilePictureError
                                                            }
                                                        />
                                                        <AvatarFallback className="text-2xl">
                                                            {user.name?.charAt(
                                                                0
                                                            ) || "U"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <Label
                                                        htmlFor="profile-picture"
                                                        className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        <span className="sr-only">
                                                            Upload profile
                                                            picture
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="profile-picture"
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={
                                                            handleProfilePictureChange
                                                        }
                                                    />
                                                </div>

                                                <div className="w-full space-y-4">
                                                    <div className="grid gap-4 sm:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="name">
                                                                <User className="mr-1 inline-block h-4 w-4" />
                                                                Name
                                                            </Label>
                                                            <Field
                                                                as={Input}
                                                                id="name"
                                                                name="name"
                                                                placeholder="Your name"
                                                                className={
                                                                    errors.name &&
                                                                    touched.name
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
                                                            <Label htmlFor="email">
                                                                <Mail className="mr-1 inline-block h-4 w-4" />
                                                                Email
                                                            </Label>
                                                            <Field
                                                                as={Input}
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                disabled
                                                                className="bg-muted cursor-not-allowed"
                                                            />
                                                            <p className="text-sm text-muted-foreground">
                                                                Email cannot be
                                                                changed
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="location">
                                                            <MapPin className="mr-1 inline-block h-4 w-4" />
                                                            Location
                                                        </Label>
                                                        <Field
                                                            as={Input}
                                                            id="location"
                                                            name="location"
                                                            placeholder="Your location"
                                                            className={
                                                                errors.location &&
                                                                touched.location
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="location"
                                                            component="div"
                                                            className="text-sm text-destructive"
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor="bio">
                                                            Bio
                                                        </Label>
                                                        <Field
                                                            as={Textarea}
                                                            id="bio"
                                                            name="bio"
                                                            placeholder="Tell us about yourself"
                                                            rows={4}
                                                            className={
                                                                errors.bio &&
                                                                touched.bio
                                                                    ? "border-destructive"
                                                                    : ""
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="bio"
                                                            component="div"
                                                            className="text-sm text-destructive"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isSubmitting ||
                                                        updateProfileMutation.isPending
                                                    }
                                                >
                                                    <LoadingButton
                                                        loading={
                                                            isSubmitting ||
                                                            updateProfileMutation.isPending
                                                        }
                                                    >
                                                        <div className="flex items-center">
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </div>
                                                    </LoadingButton>
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content" className="space-y-4 pt-4">
                        <Card>
                            {(addYoutubeMutation.isPending ||
                                deleteYoutubeMutation.isPending) && (
                                <LoadingOverlay message="Updating content..." />
                            )}
                            <CardHeader>
                                <CardTitle>Your YouTube Content</CardTitle>
                                <CardDescription>
                                    Add and manage YouTube videos on your
                                    profile.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {youtubeError && (
                                    <Alert variant="destructive">
                                        <AlertDescription>
                                            {youtubeError}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {successMessage && (
                                    <Alert className="border-green-500 text-green-500">
                                        <AlertDescription>
                                            {successMessage}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Formik
                                    initialValues={{
                                        title: "",
                                        youtubeUrl: "",
                                    }}
                                    validationSchema={YouTubeLinkSchema}
                                    onSubmit={handleAddYoutubeLink}
                                >
                                    {({ isSubmitting, errors, touched }) => (
                                        <Form className="space-y-4">
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label htmlFor="title">
                                                        Video Title
                                                    </Label>
                                                    <Field
                                                        as={Input}
                                                        id="title"
                                                        name="title"
                                                        placeholder="Enter video title"
                                                        className={
                                                            errors.title &&
                                                            touched.title
                                                                ? "border-destructive"
                                                                : ""
                                                        }
                                                    />
                                                    <ErrorMessage
                                                        name="title"
                                                        component="div"
                                                        className="text-sm text-destructive"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="youtubeUrl">
                                                        YouTube URL
                                                    </Label>
                                                    <Field
                                                        as={Input}
                                                        id="youtubeUrl"
                                                        name="youtubeUrl"
                                                        placeholder="https://youtube.com/watch?v=..."
                                                        className={
                                                            errors.youtubeUrl &&
                                                            touched.youtubeUrl
                                                                ? "border-destructive"
                                                                : ""
                                                        }
                                                    />
                                                    <ErrorMessage
                                                        name="youtubeUrl"
                                                        component="div"
                                                        className="text-sm text-destructive"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        isSubmitting ||
                                                        addYoutubeMutation.isPending
                                                    }
                                                >
                                                    <LoadingButton
                                                        loading={
                                                            isSubmitting ||
                                                            addYoutubeMutation.isPending
                                                        }
                                                    >
                                                        <div className="flex items-center">
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Video
                                                        </div>
                                                    </LoadingButton>
                                                </Button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>

                                <Separator />

                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium">
                                        Your Videos
                                    </h3>

                                    {user.youtubeLinks &&
                                    user.youtubeLinks.length > 0 ? (
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            {user.youtubeLinks.map(
                                                (link, index) => (
                                                    <motion.div
                                                        key={link.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        transition={{
                                                            delay: index * 0.1,
                                                        }}
                                                    >
                                                        <Card>
                                                            <CardHeader className="p-4">
                                                                <CardTitle className="flex items-center justify-between text-lg">
                                                                    <span className="line-clamp-1">
                                                                        {
                                                                            link.title
                                                                        }
                                                                    </span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive"
                                                                        onClick={() =>
                                                                            handleDeleteYoutubeLink(
                                                                                link.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deleteYoutubeMutation.isPending
                                                                        }
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                        <span className="sr-only">
                                                                            Delete
                                                                        </span>
                                                                    </Button>
                                                                </CardTitle>
                                                                <CardDescription>
                                                                    Added on{" "}
                                                                    {format(
                                                                        new Date(
                                                                            link.addedAt
                                                                        ),
                                                                        "d MMMM yyyy"
                                                                    )}
                                                                </CardDescription>
                                                            </CardHeader>
                                                            <CardContent className="p-4 pt-0">
                                                                <YoutubeEmbed
                                                                    url={
                                                                        link.url ||
                                                                        link.youtubeUrl ||
                                                                        `https://www.youtube.com/watch?v=${
                                                                            link.videoId ||
                                                                            link.id
                                                                        }`
                                                                    }
                                                                    title={
                                                                        link.title
                                                                    }
                                                                />
                                                            </CardContent>
                                                        </Card>
                                                    </motion.div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                                            <div className="flex flex-col items-center space-y-2 text-center">
                                                <Youtube className="h-10 w-10 text-muted-foreground" />
                                                <h3 className="font-semibold">
                                                    No videos yet
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Add YouTube videos to share
                                                    on your profile.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </MainLayout>
    );
}
