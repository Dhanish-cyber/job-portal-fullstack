"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function applyForJob(jobId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch("http://localhost:5000/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ jobId })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to apply");
  }

  revalidatePath(`/jobs/${jobId}`);
  revalidatePath("/candidate/dashboard");
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch(`http://localhost:5000/api/applications/${applicationId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  revalidatePath("/recruiter/applications");
}

export async function scheduleInterview(applicationId: string, scheduledTime: Date, notes: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch("http://localhost:5000/api/interviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ applicationId, scheduledTime: scheduledTime.toISOString(), notes })
  });

  if (!res.ok) {
    throw new Error("Failed to schedule interview");
  }

  revalidatePath("/recruiter/applications");
}
