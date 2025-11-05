"use client";

import { useState, useEffect, useCallback } from "react";

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

type UseStatusesReturn = {
  statuses: Status[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

export function useStatuses(): UseStatusesReturn {
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/statuses");

      if (!response.ok) {
        throw new Error(`Failed to fetch statuses: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform the dates from strings to Date objects
      const transformedStatuses = data.statuses.map((status: Status) => ({
        ...status,
        createdAt: new Date(status.createdAt),
        updatedAt: new Date(status.updatedAt),
      }));

      setStatuses(transformedStatuses);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching statuses:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchStatuses();

    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      fetchStatuses();
    }, 30000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchStatuses]);

  return {
    statuses,
    isLoading,
    error,
    refetch: fetchStatuses,
  };
}
