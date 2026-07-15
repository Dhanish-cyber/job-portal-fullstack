import { auth } from "@/auth";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/forms/ProfileForm";

export default async function CandidateProfilePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "CANDIDATE") {
    redirect("/login");
  }

  // Normally we would fetch the profile from DB, but we will mock it if the DB is empty
  // Since we don't have a real DB connection yet, we will wrap this in a try/catch or just pass null
  let profile = null;
  try {
    const token = (session as any).accessToken;
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profile) {
        profile = {
          skills: data.profile.skills || "",
          education: typeof data.profile.education === 'string' ? data.profile.education : JSON.stringify(data.profile.education),
          experience: typeof data.profile.experience === 'string' ? data.profile.experience : JSON.stringify(data.profile.experience),
          resumeUrl: data.profile.resume_url || "",
          phone: data.profile.phone || "",
        };
      }
    }
  } catch (error) {
    console.warn("Backend connection not available yet, using empty profile.");
  }

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Candidate Profile</h1>
        <p className="text-muted-foreground mt-2">
          Update your skills, experience, and upload your resume to apply for jobs.
        </p>
      </div>
      
      <ProfileForm initialData={profile} />
    </div>
  );
}
