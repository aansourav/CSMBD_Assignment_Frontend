import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { post } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader2, Plus } from "lucide-react";
import * as Yup from "yup";

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

export default function YoutubeAddForm({
    refreshAccessToken,
    setLoading,
    setYoutubeError,
    setSuccessMessage,
}) {
    const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            setSuccessMessage("YouTube link added successfully");
        },
        onError: (error) => {
            setYoutubeError(error.message || "Failed to add YouTube link");
        },
    });

    const handleAddYoutubeLink = async (
        values,
        { setSubmitting, resetForm }
    ) => {
        setYoutubeError("");
        setSuccessMessage("");
        setLoading(true);

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

            await addYoutubeMutation.mutateAsync(payload);
            resetForm();
        } catch (error) {
            console.error("Add YouTube link error:", error);
        } finally {
            setSubmitting(false);
            setLoading(false);
        }
    };

    return (
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
                            <Label htmlFor="title">Video Title</Label>
                            <Field
                                as={Input}
                                id="title"
                                name="title"
                                placeholder="Enter video title"
                                className={
                                    errors.title && touched.title
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
                            <Label htmlFor="youtubeUrl">YouTube URL</Label>
                            <Field
                                as={Input}
                                id="youtubeUrl"
                                name="youtubeUrl"
                                placeholder="https://youtube.com/watch?v=..."
                                className={
                                    errors.youtubeUrl && touched.youtubeUrl
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
                                isSubmitting || addYoutubeMutation.isPending
                            }
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            <div className="flex items-center">
                                {isSubmitting ||
                                addYoutubeMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Adding video...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Video
                                    </>
                                )}
                            </div>
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
