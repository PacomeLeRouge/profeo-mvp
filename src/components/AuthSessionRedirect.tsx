"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Redirige vers /auth/continue dès que Clerk a une session (ex. après vérification e-mail). */
export function AuthSessionRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/auth/continue");
    }
  }, [isLoaded, isSignedIn, router]);

  return null;
}
