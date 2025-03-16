"use client"

import { cn } from "@/lib/utils"

export function LoadingSpinner({ className, size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn("animate-spin rounded-full border-solid border-primary border-t-transparent", sizeClasses[size])}
      />
    </div>
  )
}

export function LoadingPage({ message = "Loading..." }) {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  )
}

export function LoadingOverlay({ message = "Loading..." }) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  )
}

export function LoadingButton({ loading, children, ...props }) {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-primary-foreground" />
        </div>
      )}
      <div className={loading ? "invisible" : ""}>{children}</div>
    </div>
  )
}

