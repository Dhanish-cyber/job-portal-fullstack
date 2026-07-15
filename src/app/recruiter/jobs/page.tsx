import { auth } from "@/auth";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toggleJobStatus, deleteJob } from "@/app/actions/job";
import { Badge } from "@/components/ui/badge";

export default async function RecruiterJobsPage() {
  const session = await auth();
  
  let jobs: any[] = [];
  try {
    const token = (session as any).accessToken;
    const res = await fetch(`http://localhost:5000/api/jobs?recruiterId=${session?.user?.id}&status=all`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      jobs = data.jobs || [];
      // map status to isActive for the UI
      jobs = jobs.map(j => ({ ...j, isActive: j.status === 'open', skillsReq: j.skills_required, salaryRange: j.salary_range }));
    }
  } catch (e) {
    console.warn("Backend not reachable. Showing empty list.");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Jobs</h1>
          <p className="text-muted-foreground mt-2">View and manage your active and closed job postings.</p>
        </div>
        <Link href="/recruiter/jobs/create">
          <Button>Post New Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.length === 0 ? (
          <p className="text-muted-foreground col-span-full">No jobs posted yet. Create one to get started.</p>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className={!job.isActive ? "opacity-75" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <Badge variant={job.isActive ? "default" : "secondary"}>
                    {job.isActive ? "Active" : "Closed"}
                  </Badge>
                </div>
                <CardDescription>{job.location} • {job.salaryRange || "Salary Negotiable"}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {job.skillsReq.split(",").filter(Boolean).map((skill: string) => (
                    <Badge key={skill.trim()} variant="outline" className="text-xs">{skill.trim()}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <form action={async () => { "use server"; await toggleJobStatus(job.id, !job.isActive) }}>
                  <Button variant="outline" size="sm">
                    {job.isActive ? "Close Job" : "Reopen Job"}
                  </Button>
                </form>
                <form action={async () => { "use server"; await deleteJob(job.id) }}>
                  <Button variant="destructive" size="sm">Delete</Button>
                </form>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
