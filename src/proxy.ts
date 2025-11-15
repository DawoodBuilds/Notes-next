import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const protectedPaths = ["/dashboard"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  const ForbiddenPath = ["/images", "/favicon.ico"];
  const isForbiddenPath = ForbiddenPath.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isForbiddenPath) {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  const authPaths = ["/login", "/register"];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/images/:path*",
    "/favicon.ico",
  ],
};
