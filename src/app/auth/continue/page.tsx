import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthSyncPending } from "@/components/AuthSyncPending";
import { ensureDbUser, getOnboardingRedirectPath } from "@/lib/auth";

export default async function AuthContinuePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const user = await ensureDbUser();
  if (!user) {
    return <AuthSyncPending />;
  }

  redirect(await getOnboardingRedirectPath());
}
