import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default async function PublicJobsPage(props: {
  searchParams?: Promise<{ query?: string; location?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const location = searchParams?.location || "";

  let jobs: any[] = [];
  try {
    const res = await fetch(`http://localhost:5000/api/jobs?search=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      jobs = data.jobs || [];
    }
  } catch (e) {
    console.warn("Backend not reachable. Showing empty list.");
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-primary">Find Your Next Dream Job</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse thousands of job openings from top companies around the world.
        </p>
      </div>

      {/* Search Filters */}
      <div className="bg-card shadow-sm border rounded-xl p-4 mb-8">
        <form className="flex flex-col sm:flex-row gap-4" method="GET" action="/jobs">
          <Input 
            name="query" 
            placeholder="Job title, keywords, or company..." 
            defaultValue={query} 
            className="flex-1"
          />
          <Input 
            name="location" 
            placeholder="Location (e.g. Remote, New York)" 
            defaultValue={location} 
            className="flex-1"
          />
          <Button type="submit" size="lg" className="sm:w-auto w-full">Search Jobs</Button>
        </form>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            No jobs found matching your criteria. Try adjusting your search!
          </div>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="transition-all hover:shadow-md hover:border-primary/50 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                      <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {job.company?.name || "Company"} • {job.location}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                    {job.salaryRange || "Competitive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {job.skillsReq.split(",").filter(Boolean).map((skill: string) => (
                    <Badge key={skill.trim()} variant="outline" className="bg-background text-xs">{skill.trim()}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 flex justify-end">
                <Link href={`/jobs/${job.id}`}>
                  <Button variant="default">View Details</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
