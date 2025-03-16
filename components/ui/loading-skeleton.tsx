import { Skeleton } from "@/components/ui/skeleton"

export function UserCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-1 text-center">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-3 w-32 mx-auto" />
          </div>
        </div>
      </div>
      <div className="flex justify-between bg-muted/50 px-6 py-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  )
}

export function ContentCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div className="p-4">
        <Skeleton className="h-5 w-3/4 mb-2" />
      </div>
      <div className="p-4 pt-0">
        <Skeleton className="aspect-video w-full rounded-md" />
      </div>
      <div className="flex items-center justify-between bg-muted/50 p-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <Skeleton className="h-24 w-24 rounded-full mx-auto sm:mx-0" />
            <div className="w-full space-y-4 mt-4 sm:mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

