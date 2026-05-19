import { redirect } from "next/navigation";
import { getOnboardingRedirectPath } from "@/lib/auth";

export default async function AuthContinuePage() {
  const path = await getOnboardingRedirectPath();
  redirect(path);
}
