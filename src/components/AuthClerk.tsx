"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";

const redirectUrl = "/auth/continue";

export function AuthClerkSignIn() {
  return (
    <div className="clutch-clerk-auth w-full">
      <SignIn
        appearance={clerkAppearance}
        routing="hash"
        signUpUrl="/sign-up"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}

export function AuthClerkSignUp() {
  return (
    <div className="clutch-clerk-auth w-full">
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}
