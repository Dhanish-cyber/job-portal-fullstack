import { auth } from "@/auth";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function RecruiterDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    return <div>Unauthorized.</div>;
  }

  let metrics = {
    activeJobs: 0,
    totalApplications: 0,
    shortlistedCandidates: 0,
    interviewScheduled: 0
  };

  let jobPerformance: any[] = [];

  try {
    const token = (session as any).accessToken;
    const res = await fetch("http://localhost:5000/api/users/recruiter/stats", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      metrics = data.stats;
      jobPerformance = data.jobPerformance || [];
    }
  } catch (e) {
    console.warn("Backend not connected yet.");
  }

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recruiter Dashboard</h1>
          <p className="text-muted-foreground mt-2">Overview of your jobs and candidate pipelines.</p>
        </div>
        <Link href="/recruiter/jobs/create">
          <Button>Post New Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.totalApplications}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Shortlisted Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">{metrics.shortlistedCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{metrics.interviewScheduled}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card shadow-sm border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Job Performance</h2>
        {jobPerformance.length === 0 ? (
          <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
        ) : (
          <div className="space-y-4">
            {jobPerformance.map(job => (
              <div key={job.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-lg">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: <Badge variant={job.status === 'open' ? 'default' : 'secondary'} className="ml-1">{job.status === 'open' ? 'Active' : 'Closed'}</Badge>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-lg">{job.application_count}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Applicants</p>
                  </div>
                  <Link href={`/recruiter/jobs`}>
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
