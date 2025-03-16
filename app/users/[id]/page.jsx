"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import MainLayout from "@/components/layout/main-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Youtube, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useApp } from "@/context/app-context"
import { dummyUsers } from "@/data/dummy-data"
import YoutubeEmbed from "@/components/youtube-embed"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function UserProfilePage() {
  const { id } = useParams()
  const { setLoading, loading } = useApp()
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)

    setTimeout(() => {
      const foundUser = dummyUsers.find((user) => user.id === id)
      setUser(foundUser || null)
      setLoading(false)
    }, 500)
  }, [id, setLoading])

  if (!user) {
    return (
      <MainLayout>
        {/* Show loading state when data is being fetched */}
        {loading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-lg font-medium text-muted-foreground">Loading user profile...</p>
            </div>
          </div>
        ) : (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">User not found</h2>
              <p className="text-muted-foreground">The user you're looking for doesn't exist or has been removed.</p>
            </div>
          </div>
        )}
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-y-0 sm:space-x-4 sm:text-left">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
                  <AvatarImage
                    src={user.profilePictureUrl || "/placeholder.svg?height=128&width=128"}
                    alt={user.name}
                  />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </motion.div>

              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">{user.name}</h1>
                  <p className="text-muted-foreground">{user.bio || "No bio provided"}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {user.location && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Youtube className="h-3 w-3" />
                    {user.youtubeLinks?.length || 0} videos
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 pt-4">
            <h2 className="text-xl font-semibold">Shared Videos</h2>

            {user.youtubeLinks && user.youtubeLinks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.youtubeLinks.map((link, index) => (
                  <motion.div
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg">{link.title}</CardTitle>
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
                  <h3 className="font-semibold">No videos shared yet</h3>
                  <p className="text-sm text-muted-foreground">This user hasn't shared any YouTube videos.</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>About {user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Bio</h3>
                  <p className="text-muted-foreground">{user.bio || "No bio provided"}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">{user.location || "No location provided"}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium">Member Since</h3>
                  <p className="text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}

