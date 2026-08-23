import { clerkMiddleware } from "@clerk/nextjs/server";

// Authentication and authorization are enforced at each protected resource.
// The proxy only provides Clerk's request context, avoiding deprecated and
// potentially divergent path-based authorization.
export default clerkMiddleware();

export const config = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api)(.*)"] };
