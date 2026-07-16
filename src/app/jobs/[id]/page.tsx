import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { ApplyButton } from "@/components/ApplyButton";

export default async function JobDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  
  let job: any = null;
  let hasApplied = false;
  let canApply = false;

  try {
    const res = await fetch(`http://localhost:5000/api/jobs/${params.id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data) {
        job = {
          ...data,
          skillsReq: data.skills_required || "",
          salaryRange: data.salary_range || ""
        };
      }
    }

    if (session?.user && session.user.role === "CANDIDATE") {
      const token = (session as any).accessToken;
      
      // Fetch user profile to see if they can apply
      const meRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: 'no-store'
      });
      if (meRes.ok) {
        const meData = await meRes.json();
        // Assume can apply if they have an account
        canApply = true;
      }

      // Check if already applied
      const appRes = await fetch("http://localhost:5000/api/applications", {
        headers: { "Authorization": `Bearer ${token}` },
        cache: 'no-store'
      });
      if (appRes.ok) {
        const applications = await appRes.json();
        if (applications.some((app: any) => app.job_id.toString() === params.id)) {
          hasApplied = true;
        }
      }
    }
  } catch (e) {
    console.warn("Backend not connected yet.");
  }

  if (!job) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="bg-card shadow-sm border rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{job.company?.name || "Company"}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
              {job.salaryRange || "Competitive"}
            </Badge>
            <span className="text-sm text-muted-foreground">{job.location}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4 flex-wrap">
          {job.skillsReq.split(",").filter(Boolean).map((skill: string) => (
            <Badge key={skill.trim()} variant="outline" className="bg-background">{skill.trim()}</Badge>
          ))}
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {job.description}
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex justify-between items-center">
          <Link href="/jobs">
            <Button variant="ghost">← Back to Jobs</Button>
          </Link>

          {session?.user?.role === "CANDIDATE" ? (
            hasApplied ? (
              <Button disabled variant="secondary" size="lg">Already Applied</Button>
            ) : canApply ? (
              <ApplyButton jobId={job.id} />
            ) : (
              <Link href="/candidate/profile">
                <Button size="lg">Create Profile to Apply</Button>
              </Link>
            )
          ) : session?.user ? (
            <p className="text-sm text-muted-foreground">Log in as a candidate to apply.</p>
          ) : (
            <Link href="/login">
              <Button size="lg">Log in to Apply</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
