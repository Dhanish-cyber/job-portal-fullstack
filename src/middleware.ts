import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = req.auth?.user?.role

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/login" || nextUrl.pathname === "/register"
  
  if (isApiAuthRoute) return;

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn) {
    if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/recruiter") && role !== "RECRUITER" && role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl))
    }
    if (nextUrl.pathname.startsWith("/candidate") && role !== "CANDIDATE") {
      return Response.redirect(new URL("/", nextUrl))
    }
  }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
