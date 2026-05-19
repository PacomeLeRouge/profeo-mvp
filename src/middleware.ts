import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isDev = process.env.NODE_ENV === "development";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  ...(isDev ? ["/dev(.*)"] : []),
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
