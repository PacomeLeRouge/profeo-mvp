"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clerkAppearanceDark, clerkAppearanceLight } from "@/lib/clerk-appearance";
import { cn } from "@/lib/utils";

const redirectUrl = "/auth/continue";

export function AuthClerkSignIn() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("clutch-clerk-auth w-full", isDark && "clutch-clerk-auth--dark")}>
      <SignIn
        appearance={isDark ? clerkAppearanceDark : clerkAppearanceLight}
        routing="hash"
        signUpUrl="/sign-up"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}

export function AuthClerkSignUp() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("clutch-clerk-auth w-full", isDark && "clutch-clerk-auth--dark")}>
      <SignUp
        appearance={isDark ? clerkAppearanceDark : clerkAppearanceLight}
        routing="path"
        path="/sign-up"
        signInUrl="/"
        forceRedirectUrl={redirectUrl}
      />
    </div>
  );
}
