import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-4">
            ✨ The #1 Platform for Tech Recruitment
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Find Your Dream Job, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Accelerate Your Career
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Connect with top companies, manage your applications effortlessly, and land the role you deserve with our premium recruitment platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/jobs">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                Browse Jobs Now
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to succeed</h2>
            <p className="mt-4 text-lg text-muted-foreground">Built for both ambitious candidates and forward-thinking recruiters.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold mb-3">AI Resume Parsing</h3>
              <p className="text-muted-foreground leading-relaxed">Instantly populate your profile by uploading your PDF resume. Our smart parser does the heavy lifting.</p>
            </div>
            
            <div className="bg-card p-8 rounded-2xl border shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6">📅</div>
              <h3 className="text-xl font-semibold mb-3">Interview Scheduling</h3>
              <p className="text-muted-foreground leading-relaxed">Recruiters can seamlessly schedule interviews directly through the platform, keeping everything organized.</p>
            </div>

            <div className="bg-card p-8 rounded-2xl border shadow-sm transition-all hover:shadow-md">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-6">💬</div>
              <h3 className="text-xl font-semibold mb-3">Direct Messaging</h3>
              <p className="text-muted-foreground leading-relaxed">Cut through the noise. Chat directly with recruiters and candidates in real-time within the app.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>© 2026 JobPortal Pro. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
