"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(data: {
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  skillsReq: string;
  experience: string;
  companyName: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch("http://localhost:5000/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      title: data.title,
      description: data.description,
      location: data.location,
      salaryRange: data.salaryRange,
      skillsRequired: data.skillsReq,
      experienceRequired: data.experience,
      companyName: data.companyName,
    })
  });

  if (!res.ok) {
    throw new Error("Failed to create job");
  }

  revalidatePath("/recruiter/jobs");
  redirect("/recruiter/jobs");
}

export async function toggleJobStatus(jobId: string, isActive: boolean) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;
  const status = isActive ? "open" : "closed";

  const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error("Failed to update job status");
  }

  revalidatePath("/recruiter/jobs");
}

export async function deleteJob(jobId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to delete job");
  }

  revalidatePath("/recruiter/jobs");
}
