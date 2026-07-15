"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function deleteUserAction(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const token = (session as any).accessToken;

  const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  revalidatePath("/admin/dashboard");
}

export async function deleteJobAction(jobId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
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

  revalidatePath("/admin/dashboard");
}
