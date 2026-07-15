"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/app/actions/profile";
import { parseResume } from "@/app/actions/resume";

export default function ProfileForm({ initialData }: { initialData: any }) {
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);

  const form = useForm({
    defaultValues: {
      skills: initialData?.skills || "",
      education: initialData?.education || "",
      experience: initialData?.experience || "",
      resumeUrl: initialData?.resumeUrl || "",
    },
  });

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      await updateProfile(values);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoFill() {
    const resumeUrl = form.getValues("resumeUrl");
    if (!resumeUrl) return alert("Please provide a Resume URL first.");
    
    setParsing(true);
    try {
      const data = await parseResume(resumeUrl);
      form.setValue("skills", data.skills.join(", "));
      form.setValue("education", data.education);
      form.setValue("experience", data.experience);
    } catch (error) {
      console.error(error);
      alert("Failed to parse resume.");
    } finally {
      setParsing(false);
    }
  }

  return (
    <div className="bg-card text-card-foreground shadow-sm rounded-xl border p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills</FormLabel>
                <FormControl>
                  <Input placeholder="React, Node.js, TypeScript" {...field} />
                </FormControl>
                <FormDescription>Separate skills with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="education"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Education</FormLabel>
                <FormControl>
                  <Textarea placeholder="B.S. in Computer Science - University Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Software Engineer at TechCorp (2020 - Present)..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resumeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://link-to-your-resume.pdf" {...field} />
                </FormControl>
                <FormDescription>
                  Upload your resume to a cloud provider and paste the link here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={handleAutoFill} disabled={parsing}>
              {parsing ? "Parsing Resume..." : "✨ Auto-fill from Resume"}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
