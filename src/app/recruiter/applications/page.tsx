import { auth } from "@/auth";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateApplicationStatus } from "@/app/actions/application";
import { Button } from "@/components/ui/button";
import InterviewDialog from "@/components/InterviewDialog";

export default async function RecruiterApplicationsPage() {
  const session = await auth();
  
  let applications: any[] = [];
  try {
    const token = (session as any).accessToken;
    const res = await fetch("http://localhost:5000/api/applications", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      applications = data.map((app: any) => ({
        id: app.id,
        status: app.status.toUpperCase(),
        job: { title: app.job_title },
        candidateProfile: {
          user: { name: app.candidate_name, email: app.candidate_email },
          experience: app.experience || "Not provided",
          education: app.education || "Not provided",
          skills: app.skills || "",
          resumeUrl: app.resume_url
        },
        interviews: app.interview ? [app.interview] : [] // The backend doesn't return interviews in getApplications list by default. Let's handle if it's missing.
      }));
    }
  } catch (e) {
    console.warn("Backend not reachable.");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Review Applications</h1>
        <p className="text-muted-foreground mt-2">Manage candidates who have applied to your jobs.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <p className="text-muted-foreground">No applications found.</p>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div>
                  <CardTitle className="text-xl">{app.candidateProfile.user.name || app.candidateProfile.user.email}</CardTitle>
                  <p className="text-sm text-muted-foreground">Applied for: <span className="font-medium text-foreground">{app.job.title}</span></p>
                </div>
                <Badge variant={
                  app.status === "REJECTED" ? "destructive" :
                  app.status === "SELECTED" ? "default" :
                  "secondary"
                }>
                  {app.status.replace("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="space-y-2">
                  <p><strong>Experience:</strong> {app.candidateProfile.experience}</p>
                  <p><strong>Education:</strong> {app.candidateProfile.education}</p>
                  <div className="flex gap-2 flex-wrap">
                    {app.candidateProfile.skills.split(",").filter(Boolean).map((skill: string) => (
                      <Badge key={skill.trim()} variant="outline" className="text-xs">{skill.trim()}</Badge>
                    ))}
                  </div>
                  {app.candidateProfile.resumeUrl && (
                    <a href={app.candidateProfile.resumeUrl} target="_blank" className="text-blue-500 hover:underline text-sm inline-block mt-2">
                      View Resume
                    </a>
                  )}
                  {app.interviews && app.interviews.length > 0 && (
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm border border-l-4 border-l-primary">
                      <strong>Interview Scheduled:</strong> {new Date(app.interviews[0].date).toLocaleString()}
                      {app.interviews[0].notes && <p className="mt-1 text-muted-foreground">{app.interviews[0].notes}</p>}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 min-w-[200px]">
                  <form action={async () => { "use server"; await updateApplicationStatus(app.id, "UNDER_REVIEW") }}>
                    <Button variant="outline" size="sm" className="w-full">Mark Under Review</Button>
                  </form>
                  <form action={async () => { "use server"; await updateApplicationStatus(app.id, "SHORTLISTED") }}>
                    <Button variant="outline" size="sm" className="w-full">Shortlist</Button>
                  </form>
                  <InterviewDialog applicationId={app.id} />
                  <form action={async () => { "use server"; await updateApplicationStatus(app.id, "SELECTED") }}>
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">Select Candidate</Button>
                  </form>
                  <form action={async () => { "use server"; await updateApplicationStatus(app.id, "REJECTED") }}>
                    <Button variant="destructive" size="sm" className="w-full">Reject</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
