"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { clerkAppearanceDark, clerkAppearanceLight } from "@/lib/clerk-appearance";

const redirectUrl = "/auth/continue";

export function AuthClerkSignIn() {
  return (
    <div className="clutch-clerk-auth clutch-clerk-auth--dark w-full">
      <SignIn
        appearance={clerkAppearanceDark}
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
        appearance={clerkAppearanceLight}
        routing="path"
        path="/sign-up"
        signInUrl="/"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}
