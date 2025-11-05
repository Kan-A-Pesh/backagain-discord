"use client";

import { useStatuses } from "@/lib/hooks/use-statuses";
import { ResetTimer } from "@/components/reset-timer";
import { StatusQueue } from "@/components/status-queue";

export default function Home() {
  const { statuses, isLoading, error } = useStatuses();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <section className="flex w-full max-w-3xl flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold">Status Queue</h1>
          <p className="text-muted-foreground">
            See when your status update will be processed
            <br />
            Wanna change my status? DM me <code>!bio &lt;text&gt;</code>
          </p>
        </div>

        {/* Reset Timer */}
        <div className="flex justify-center">
          <ResetTimer />
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Status Queue */}
        <StatusQueue statuses={statuses} isLoading={isLoading} />
      </section>
    </main>
  );
}
