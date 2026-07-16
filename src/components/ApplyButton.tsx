"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { applyForJob } from "@/app/actions/application";

export function ApplyButton({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="lg"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await applyForJob(jobId);
          if (res?.error) {
            alert(res.error);
          } else {
            alert("Successfully applied!");
          }
        });
      }}
    >
      {isPending ? "Applying..." : "Apply Now"}
    </Button>
  );
}
