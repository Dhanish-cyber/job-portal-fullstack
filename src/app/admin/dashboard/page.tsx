import { auth } from "@/auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteUserAction, deleteJobAction } from "@/app/actions/admin";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return <div>Unauthorized.</div>;
  }

  let metrics = {
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    activeJobs: 0
  };

  let users: any[] = [];
  let jobs: any[] = [];

  try {
    const token = (session as any).accessToken;
    const res = await fetch("http://localhost:5000/api/users/admin/stats", {
      headers: { "Authorization": `Bearer ${token}` },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      metrics = data.stats;
      users = data.recentUsers || [];
      jobs = data.recentJobs || [];
      // map job properties for UI
      jobs = jobs.map((j: any) => ({ ...j, isActive: j.status === 'open', company: { name: j.company_name } }));
    }
  } catch (e) {
    console.warn("Backend not connected yet.");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Platform-wide analytics and reporting.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs Posted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.totalJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{metrics.activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{metrics.totalApplications}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Users Management */}
        <div className="bg-card shadow-sm border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{user.name || user.email}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  {user.role !== "ADMIN" && (
                    <form action={async () => { "use server"; await deleteUserAction(user.id); }}>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs Management */}
        <div className="bg-card shadow-sm border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
          <div className="space-y-4">
            {jobs.map(job => (
              <div key={job.id} className="flex justify-between items-center border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">{job.company?.name} • {job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={job.isActive ? "default" : "secondary"}>
                    {job.isActive ? "Active" : "Closed"}
                  </Badge>
                  <form action={async () => { "use server"; await deleteJobAction(job.id); }}>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
