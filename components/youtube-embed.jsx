"use client"

import { useState, useEffect } from "react"

export default function YoutubeEmbed({ url, title }) {
  const [videoId, setVideoId] = useState("")

  useEffect(() => {
    // Extract video ID from URL
    if (url) {
      let extractedId = ""

      if (url.includes("youtube.com/watch?v=")) {
        extractedId = url.split("v=")[1]
        const ampersandPosition = extractedId.indexOf("&")
        if (ampersandPosition !== -1) {
          extractedId = extractedId.substring(0, ampersandPosition)
        }
      } else if (url.includes("youtu.be/")) {
        extractedId = url.split("youtu.be/")[1]
      }

      setVideoId(extractedId)
    }
  }, [url])

  if (!videoId) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <p className="text-sm text-muted-foreground">Invalid YouTube URL</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "YouTube video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute left-0 top-0 h-full w-full border-0"
      ></iframe>
    </div>
  )
}

