import { clerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default clerkMiddleware();
export function proxy(request: NextRequest) {
  const forbiddenPaths = ["/icon.png", "/og-image.png"];
  const isForbiddenPath = forbiddenPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );
  if (isForbiddenPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/icon.png",
    "/og-image.png",
  ],
};
