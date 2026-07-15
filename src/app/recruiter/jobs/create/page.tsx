import { auth } from "@/auth";
import { redirect } from "next/navigation";
import JobForm from "@/components/forms/JobForm";

export default async function CreateJobPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "RECRUITER") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground mt-2">
          Fill out the details below to publish a job posting to the portal.
        </p>
      </div>
      
      <JobForm />
    </div>
  );
}
