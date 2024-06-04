import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const isProtectedRoute = createRouteMatcher([
  '/game(.*)', 
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.\\..|_next).)", "/", "/(api|trpc)(.)"],
};