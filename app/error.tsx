"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 py-8 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </span>
      <h2 className="text-lg font-semibold">This view couldn't be loaded</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Something went wrong while loading the dashboard data. This is usually temporary — try
        reloading this view.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
