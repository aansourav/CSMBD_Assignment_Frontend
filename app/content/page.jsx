"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useApp } from "@/context/app-context"
import { dummyUsers } from "@/data/dummy-data"
import YoutubeEmbed from "@/components/youtube-embed"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function ContentPage() {
  const { setLoading, loading } = useApp()
  const [content, setContent] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    // Simulate loading data
    setLoading(true)

    setTimeout(() => {
      // Collect all YouTube links from all users
      let allContent = []
      dummyUsers.forEach((user) => {
        if (user.youtubeLinks && user.youtubeLinks.length > 0) {
          const userContent = user.youtubeLinks.map((link) => ({
            ...link,
            user: {
              id: user.id,
              name: user.name,
              profilePictureUrl: user.profilePictureUrl,
            },
          }))
          allContent = [...allContent, ...userContent]
        }
      })

      // Filter content based on search term
      const filteredContent = allContent.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))

      // Sort content
      const sortedContent = [...filteredContent]
      if (sortBy === "newest") {
        sortedContent.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
      } else if (sortBy === "oldest") {
        sortedContent.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt))
      }

      // Pagination
      const itemsPerPage = 6
      const totalItems = sortedContent.length
      const calculatedTotalPages = Math.ceil(totalItems / itemsPerPage)

      setTotalPages(calculatedTotalPages)

      // Get current page items
      const startIndex = (currentPage - 1) * itemsPerPage
      const paginatedContent = sortedContent.slice(startIndex, startIndex + itemsPerPage)

      setContent(paginatedContent)
      setLoading(false)
    }, 500)
  }, [searchTerm, sortBy, currentPage, setLoading])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value)
    setCurrentPage(1) // Reset to first page on new sort
  }

  // Animation variants for staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Content</h1>
            <p className="text-muted-foreground">Discover videos shared by users on the platform.</p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search content..."
                className="pl-8"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex h-[400px] items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />
              <p className="text-lg font-medium text-muted-foreground">Loading content...</p>
            </div>
          </div>
        )}

        {/* Only show content grid when not loading */}
        {!loading && (
          <>
            {content.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {content.map((item) => (
                  <motion.div key={item.id} variants={item}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-1 text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <YoutubeEmbed url={item.url} title={item.title} />
                      </CardContent>
                      <CardFooter className="flex items-center justify-between bg-muted/50 p-4">
                        <Link href={`/users/${item.user.id}`} className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={item.user.profilePictureUrl || "/placeholder.svg?height=32&width=32"}
                              alt={item.user.name}
                            />
                            <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{item.user.name}</span>
                        </Link>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span>{new Date(item.addedAt).toLocaleDateString()}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex h-[400px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center space-y-2 text-center">
                  <Search className="h-10 w-10 text-muted-foreground" />
                  <h3 className="font-semibold">No content found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                </div>
              </div>
            )}
          </>
        )}

        {totalPages > 1 && !loading && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </MainLayout>
  )
}

