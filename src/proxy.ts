import { clerkMiddleware } from "@clerk/nextjs/server";

// Authentication and authorization are enforced at each protected resource.
// The proxy only provides Clerk's request context, avoiding deprecated and
// potentially divergent path-based authorization.
export default clerkMiddleware({
  contentSecurityPolicy: {
    directives: {
      "connect-src": [
        "https://www.google-analytics.com",
        "https://region1.google-analytics.com",
        "https://www.facebook.com",
        "https://graph.facebook.com",
        "https://*.clarity.ms",
        "https://api.cal.com",
      ],
      "frame-src": ["https://cal.com"],
      "img-src": [
        "data:",
        "blob:",
        "https://images.unsplash.com",
        "https://www.facebook.com",
        "https://www.google-analytics.com",
        "https://*.clarity.ms",
      ],
    },
  },
});

export const config = { matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api)(.*)"] };
