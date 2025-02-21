import {  clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { clerkClient } from "@clerk/nextjs/server";

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()

    const { userId } = await auth();
    if (userId) {
      const client = await clerkClient();
      const role = (await client.users.getUser(userId)).unsafeMetadata.role;

      if (isProtectedRoute(request) && role === 'RENTER') {
        const url = new URL('/listings', request.url);
        return NextResponse.redirect(url.toString(), {status: 308});
      }

      console.log("redirect to dashboard");
    }
  }
});

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)',]);

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/uploadthing(.*)',
]);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};