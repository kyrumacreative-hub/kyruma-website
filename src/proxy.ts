import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const protectedRoute = createRouteMatcher(["/portal(.*)", "/access(.*)", "/api/portal(.*)", "/api/automations(.*)"]);

export default clerkMiddleware(async (identity, request) => {
  if (protectedRoute(request)) await identity.protect();
});

export const config = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api)(.*)"] };

