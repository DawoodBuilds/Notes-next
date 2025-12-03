import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const isForbiddenRoute = createRouteMatcher(["/icon.png", "/og-image.png"]);

export default clerkMiddleware((auth, req) => {
  if (isForbiddenRoute(req)) {
    const url = new URL("/dashboard", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
