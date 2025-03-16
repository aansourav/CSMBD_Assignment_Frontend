"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import MainLayout from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, MapPin, Mail, Save, Plus, Trash2, Upload, Youtube } from "lucide-react"
import { motion } from "framer-motion"
import { useApp } from "@/context/app-context"
import YoutubeEmbed from "@/components/youtube-embed"
import { LoadingButton, LoadingOverlay } from "@/components/ui/loading-spinner"

// Profile validation schema
const ProfileSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  bio: Yup.string().max(500, "Bio must be less than 500 characters"),
  location: Yup.string().max(100, "Location must be less than 100 characters"),
})

// YouTube link validation schema
const YouTubeLinkSchema = Yup.object().shape({
  title: Yup.string().max(100, "Title must be less than 100 characters").required("Title is required"),
  youtubeUrl: Yup.string()
    .matches(
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/,
      "Please enter a valid YouTube URL",
    )
    .required("YouTube URL is required"),
})

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, isAuthenticated, setLoading } = useApp()
  const [profileError, setProfileError] = useState("")
  const [youtubeError, setYoutubeError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [profilePicture, setProfilePicture] = useState(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState("")
  const [isLoadingOverlayVisible, setIsLoadingOverlayVisible] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("")
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successMessage])

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePicture(file)
      setProfilePicturePreview(URL.createObjectURL(file))
    }
  }

  // Handle profile update
  const handleProfileUpdate = async (values, { setSubmitting }) => {
    setProfileError("")
    setSuccessMessage("")
    setLoading(true)
    setIsLoadingOverlayVisible(true)

    // Simulate API call
    setTimeout(() => {
      // Update user profile (in a real app, this would be saved to the database)
      const updatedUser = {
        ...user,
        name: values.name,
        email: values.email,
        bio: values.bio,
        location: values.location,
      }

      // If profile picture was changed
      if (profilePicture) {
        // In a real app, this would upload the file to a server
        updatedUser.profilePictureUrl = profilePicturePreview
      }

      // Update user in context
      setUser(updatedUser)

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setSuccessMessage("Profile updated successfully")
      setSubmitting(false)
      setLoading(false)
      setIsLoadingOverlayVisible(false)
    }, 1000)
  }

  // Handle YouTube link add
  const handleAddYoutubeLink = async (values, { setSubmitting, resetForm }) => {
    setYoutubeError("")
    setSuccessMessage("")
    setLoading(true)
    setIsLoadingOverlayVisible(true)

    // Simulate API call
    setTimeout(() => {
      // Extract video ID from URL
      const url = values.youtubeUrl
      const videoId = url.includes("youtube.com/watch?v=")
        ? url.split("v=")[1].split("&")[0]
        : url.includes("youtu.be/")
          ? url.split("youtu.be/")[1]
          : ""

      // Create new YouTube link
      const newLink = {
        id: `yt-${Date.now()}`,
        title: values.title,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        addedAt: new Date().toISOString(),
      }

      // Add link to user's YouTube links
      const updatedUser = {
        ...user,
        youtubeLinks: [...(user.youtubeLinks || []), newLink],
      }

      // Update user in context
      setUser(updatedUser)

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setSuccessMessage("YouTube link added successfully")
      resetForm()
      setSubmitting(false)
      setLoading(false)
      setIsLoadingOverlayVisible(false)
    }, 1000)
  }

  // Handle YouTube link delete
  const handleDeleteYoutubeLink = (linkId) => {
    setLoading(true)
    setIsLoadingOverlayVisible(true)

    // Simulate API call
    setTimeout(() => {
      // Filter out the deleted link
      const updatedLinks = user.youtubeLinks.filter((link) => link.id !== linkId)

      // Update user with filtered links
      const updatedUser = {
        ...user,
        youtubeLinks: updatedLinks,
      }

      // Update user in context
      setUser(updatedUser)

      // Update user in localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser))

      setSuccessMessage("YouTube link removed successfully")
      setLoading(false)
      setIsLoadingOverlayVisible(false)
    }, 500)
  }

  if (!isAuthenticated || !user) {
    return null // Will redirect in useEffect
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and content.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4 pt-4">
            <Card>
              {isLoadingOverlayVisible && <LoadingOverlay message="Updating profile..." />}
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information and how others see you on the site.</CardDescription>
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
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-6">
                      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={
                                profilePicturePreview || user.profilePictureUrl || "/placeholder.svg?height=96&width=96"
                              }
                              alt={user.name}
                            />
                            <AvatarFallback className="text-2xl">{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <Label
                            htmlFor="profile-picture"
                            className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                          >
                            <Upload className="h-4 w-4" />
                            <span className="sr-only">Upload profile picture</span>
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
                                className={errors.name && touched.name ? "border-destructive" : ""}
                              />
                              <ErrorMessage name="name" component="div" className="text-sm text-destructive" />
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
                                placeholder="Your email"
                                className={errors.email && touched.email ? "border-destructive" : ""}
                              />
                              <ErrorMessage name="email" component="div" className="text-sm text-destructive" />
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
                              className={errors.location && touched.location ? "border-destructive" : ""}
                            />
                            <ErrorMessage name="location" component="div" className="text-sm text-destructive" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Field
                              as={Textarea}
                              id="bio"
                              name="bio"
                              placeholder="Tell us about yourself"
                              rows={4}
                              className={errors.bio && touched.bio ? "border-destructive" : ""}
                            />
                            <ErrorMessage name="bio" component="div" className="text-sm text-destructive" />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          <LoadingButton loading={isSubmitting}>
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
              {isLoadingOverlayVisible && <LoadingOverlay message="Updating content..." />}
              <CardHeader>
                <CardTitle>Your YouTube Content</CardTitle>
                <CardDescription>Add and manage YouTube videos on your profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {youtubeError && (
                  <Alert variant="destructive">
                    <AlertDescription>{youtubeError}</AlertDescription>
                  </Alert>
                )}

                {successMessage && (
                  <Alert className="border-green-500 text-green-500">
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}

                <Formik
                  initialValues={{ title: "", youtubeUrl: "" }}
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
                            className={errors.title && touched.title ? "border-destructive" : ""}
                          />
                          <ErrorMessage name="title" component="div" className="text-sm text-destructive" />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="youtubeUrl">YouTube URL</Label>
                          <Field
                            as={Input}
                            id="youtubeUrl"
                            name="youtubeUrl"
                            placeholder="https://youtube.com/watch?v=..."
                            className={errors.youtubeUrl && touched.youtubeUrl ? "border-destructive" : ""}
                          />
                          <ErrorMessage name="youtubeUrl" component="div" className="text-sm text-destructive" />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                          <LoadingButton loading={isSubmitting}>
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
                  <h3 className="text-lg font-medium">Your Videos</h3>

                  {user.youtubeLinks && user.youtubeLinks.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {user.youtubeLinks.map((link, index) => (
                        <motion.div
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="flex items-center justify-between text-lg">
                                <span className="line-clamp-1">{link.title}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => handleDeleteYoutubeLink(link.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </CardTitle>
                              <CardDescription>Added on {new Date(link.addedAt).toLocaleDateString()}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <YoutubeEmbed url={link.url} title={link.title} />
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <div className="flex flex-col items-center space-y-2 text-center">
                        <Youtube className="h-10 w-10 text-muted-foreground" />
                        <h3 className="font-semibold">No videos yet</h3>
                        <p className="text-sm text-muted-foreground">Add YouTube videos to share on your profile.</p>
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
  )
}

