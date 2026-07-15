"use server";

// This is a simulated resume parser. In a real application, you would use a service like AWS Textract,
// Google Cloud Document AI, or a Python backend with PyPDF2 and an NLP model.
export async function parseResume(resumeUrl: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Return a mocked parsed result based on the URL
  return {
    skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Next.js"],
    education: "B.S. in Computer Science - Mock University",
    experience: "Software Engineer at TechCorp (2020 - Present)\n- Built awesome features.\n- Reduced latency by 50%."
  };
}
