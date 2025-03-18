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
import { Textarea } from "@/components/ui/textarea";
import { API_URL } from "@/config/url";
import { useApp } from "@/context/app-context";
import getProfilePictureUrl from "@/lib/get-profile-picture";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Mail, MapPin, Save, Upload, User } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

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

export default function ProfileInformationForm({
    user,
    refreshAccessToken,
    setLoading,
}) {
    const { setUser } = useApp();
    const [profileError, setProfileError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState("");
    const queryClient = useQueryClient();

    const updateProfileMutation = useMutation({
        mutationFn: async (updatedData) => {
            try {
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
                }

                const accessToken = localStorage.getItem("accessToken");

                const response = await fetch(`${API_URL}/users/profile/me`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: formData,
                });

                if (response.status === 401 && refreshAccessToken) {
                    try {
                        const newToken = await refreshAccessToken();
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
                            throw new Error(
                                errorData.message ||
                                    "Failed to update profile after token refresh"
                            );
                        }

                        return retryResponse.json();
                    } catch (refreshError) {
                        throw new Error("Session expired. Please login again.");
                    }
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || "Failed to update profile"
                    );
                }

                return response.json();
            } catch (error) {
                throw error;
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });

            if (data.success && data.data) {
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    const updatedUser = {
                        ...userData,
                        name: data.data.name,
                        email: data.data.email,
                        bio: data.data.bio,
                        location: data.data.location,
                        profilePictureUrl: data.data.profilePictureUrl,
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }
            }

            setSuccessMessage("Profile updated successfully");
            setProfilePicture(null);
            setProfilePicturePreview("");
        },
        onError: (error) => {
            setProfileError(error.message || "Failed to update profile");
        },
    });

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

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

    const handleProfilePictureError = (e) => {
        console.error("Error loading profile picture");
        e.target.src = "/placeholder.svg";
    };

    return (
        <Card>
            {updateProfileMutation.isPending && (
                <LoadingOverlay message="Updating profile..." />
            )}
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your profile information and how others see you on
                    the site.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {profileError && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                )}

                {successMessage && (
                    <Alert className="mb-4 border-green-500 text-green-500">
                        <AlertDescription>{successMessage}</AlertDescription>
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
                                            onError={handleProfilePictureError}
                                        />
                                        <AvatarFallback className="text-2xl">
                                            {user.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Label
                                        htmlFor="profile-picture"
                                        className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                                    >
                                        <Upload className="h-4 w-4" />
                                        <span className="sr-only">
                                            Upload profile picture
                                        </span>
                                    </Label>
                                    <Input
                                        id="profile-picture"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleProfilePictureChange}
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
                                                Email cannot be changed
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
                                        <Label htmlFor="bio">Bio</Label>
                                        <Field
                                            as={Textarea}
                                            id="bio"
                                            name="bio"
                                            placeholder="Tell us about yourself"
                                            rows={4}
                                            className={
                                                errors.bio && touched.bio
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
    );
}
