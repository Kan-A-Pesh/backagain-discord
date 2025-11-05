"use client";

import { cn } from "@/lib/utils";

type Requester = {
  id: string;
  username: string;
  displayName: string;
};

export type Status = {
  id: string;
  status: string;
  requester: Requester;
  createdAt: Date;
  updatedAt: Date;
};

interface StatusQueueProps {
  statuses: Status[];
  isLoading?: boolean;
  className?: string;
}

export function StatusQueue({
  statuses,
  isLoading = false,
  className,
}: StatusQueueProps) {
  // Format date to relative time (e.g., "2 hours ago") or formatted date
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    } else {
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border bg-background p-6 shadow-xs dark:border-input dark:bg-input/30",
          className,
        )}
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary dark:border-input dark:border-t-primary" />
            <p className="text-sm text-muted-foreground">Loading statuses...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (statuses.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border bg-background p-6 shadow-xs dark:border-input dark:bg-input/30",
          className,
        )}
      >
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-muted p-3 dark:bg-input/50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                No statuses yet
              </p>
              <p className="text-xs text-muted-foreground">
                Status updates will appear here when they&apos;re requested
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Status list
  return (
    <div className={cn("space-y-2", className)}>
      {statuses.map((status) => (
        <div
          key={status.id}
          className="group rounded-md border bg-card p-4 shadow-xs transition-all hover:shadow-sm dark:border-input dark:bg-card/50"
        >
          <div className="flex flex-col gap-2">
            {/* Status text */}
            <p className="text-sm font-medium text-foreground leading-relaxed">
              {status.status}
            </p>

            {/* Metadata row */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {/* Requester info */}
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {status.requester.displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium">
                  {status.requester.displayName}
                </span>
                <span className="text-muted-foreground/70">
                  @{status.requester.username}
                </span>
              </div>

              {/* Separator */}
              <span className="text-muted-foreground/50">•</span>

              {/* Timestamp */}
              <time
                dateTime={status.createdAt.toISOString()}
                title={status.createdAt.toLocaleString()}
                className="text-muted-foreground/90"
              >
                {formatTimeAgo(status.createdAt)}
              </time>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
