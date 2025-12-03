// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

// export async function proxy(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   let isValidToken = false;
//   if (token) {
//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       await jwtVerify(token, secret);
//       isValidToken = true;
//     } catch {
//       isValidToken = false;
//     }
//   }

//   const protectedPaths = ["/dashboard"];
//   const isProtectedPath = protectedPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   const publicPaths = ["/"];
//   const isPublicPath = publicPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   const ForbiddenPath = ["/images", "/favicon.ico"];
//   const isForbiddenPath = ForbiddenPath.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );

//   if (isForbiddenPath) {
//     return NextResponse.redirect(new URL("/not-found", request.url));
//   }

//   const authPaths = ["/login", "/register"];
//   const isAuthPath = authPaths.some((path) =>
//     request.nextUrl.pathname.startsWith(path)
//   );
//   if (isProtectedPath && !isValidToken) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   if (isAuthPath && isValidToken) {
//     return NextResponse.redirect(new URL("/dashboard", request.url));
//   }

//   return NextResponse.next();
// }

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};