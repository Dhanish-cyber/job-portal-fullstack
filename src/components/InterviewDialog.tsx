"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { scheduleInterview } from "@/app/actions/application";

export default function InterviewDialog({ applicationId }: { applicationId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const notes = formData.get("notes") as string;

    try {
      await scheduleInterview(applicationId, new Date(date), notes);
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to schedule interview.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 w-full">
        Schedule Interview
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date & Time</Label>
            <Input id="date" name="date" type="datetime-local" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting Link / Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Zoom link, interview focus, etc." />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Interview"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
