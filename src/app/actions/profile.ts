"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  skills?: string;
  education?: string;
  experience?: string;
  resumeUrl?: string;
  phone?: string;
  companyName?: string;
  companyWebsite?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const token = (session as any).accessToken;

  const res = await fetch("http://localhost:5000/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  const resData = await res.json();
  if (!res.ok) {
    throw new Error(resData.message || "Failed to update profile");
  }

  revalidatePath("/candidate/profile");
  revalidatePath("/recruiter/profile");
  return resData.profile;
}
