import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationsToggle } from "@/components/NotificationsToggle";

export default async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              JobPortal Pro
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/jobs" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Browse Jobs
            </Link>
            {role === "CANDIDATE" && (
              <Link href="/candidate/profile" className="transition-colors hover:text-foreground/80 text-foreground/60">
                My Profile
              </Link>
            )}
            {role === "RECRUITER" && (
              <Link href="/recruiter/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Recruiter Dashboard
              </Link>
            )}
            {role === "ADMIN" && (
              <Link href="/admin/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                Admin Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {session ? (
            <div className="flex items-center space-x-4">
              <NotificationsToggle />
              <Link href="/chat" className="text-xl opacity-80 hover:opacity-100 transition-opacity" title="Messages">💬</Link>
              <span className="text-sm font-medium ml-2">{session.user?.name || session.user?.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
