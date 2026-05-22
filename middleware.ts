import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = [
    "/login",
    "/forget-password",
    "/reset-password",
    "/verify-otp",
  ];
  
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(`/(auth)${path}`) || pathname.startsWith(path) || pathname === path,
  );

  // If user is authenticated as ADMIN and tries to access auth pages
  if (token && token.role === "ADMIN" && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not authenticated or not an admin, and tries to access protected paths
  if (!isPublicPath && !pathname.startsWith("/api")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|images|public|favicon.ico).*)",
  ],
};
