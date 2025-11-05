"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ResetTimerProps {
  className?: string;
}

export function ResetTimer({ className }: ResetTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Calculate milliseconds until next 30-minute interval
  const getTimeUntilNextReset = (): number => {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Calculate minutes until next 30-minute mark (0 or 30)
    const minutesUntilReset = minutes < 30 ? 30 - minutes : 60 - minutes;

    // Total milliseconds until next reset
    const msUntilReset =
      minutesUntilReset * 60 * 1000 -
      seconds * 1000 -
      milliseconds;

    return msUntilReset;
  };

  // Format milliseconds to MM:SS
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Get the next reset time as a readable string
  const getNextResetTime = (): string => {
    const now = new Date();
    const nextReset = new Date(now);
    const minutes = now.getMinutes();

    if (minutes < 30) {
      nextReset.setMinutes(30, 0, 0);
    } else {
      nextReset.setHours(nextReset.getHours() + 1, 0, 0, 0);
    }

    return nextReset.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    // Initialize time remaining
    setTimeRemaining(getTimeUntilNextReset());

    // Update every second
    const interval = setInterval(() => {
      setTimeRemaining(getTimeUntilNextReset());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 rounded-md border bg-background px-4 py-2.5 shadow-xs transition-all dark:border-input dark:bg-input/30",
        className
      )}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">
          Next Reset
        </span>
        <span className="text-sm font-semibold text-foreground">
          {getNextResetTime()}
        </span>
      </div>
      <div className="h-8 w-px bg-border dark:bg-input" />
      <div className="flex items-baseline gap-1">
        <span className="font-mono text-2xl font-bold tabular-nums text-primary">
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  );
}
