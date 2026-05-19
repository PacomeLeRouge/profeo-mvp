import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { studentProfiles, tutorProfiles, users } from "@/db/schema";
import type { Role } from "@/lib/types";

export async function requireAuthUserId() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function ensureDbUser() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (existing) return existing;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    "";

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    clerkUser.username ||
    email.split("@")[0] ||
    "Utilisateur";

  const [created] = await db
    .insert(users)
    .values({ id: userId, email, name })
    .onConflictDoNothing()
    .returning();

  if (created) return created;

  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export async function getOnboardingRedirectPath() {
  const user = await ensureDbUser();
  if (!user) return "/";

  if (!user.role) return "/role-selection";

  if (user.role === "student") {
    const profile = await db.query.studentProfiles.findFirst({
      where: eq(studentProfiles.userId, user.id),
    });
    if (!profile) return "/onboarding/student";
    return "/dashboard/student";
  }

  const profile = await db.query.tutorProfiles.findFirst({
    where: eq(tutorProfiles.userId, user.id),
  });
  if (!profile) return "/onboarding/tutor";
  return "/dashboard/tutor";
}

export async function syncClerkRole(role: Role) {
  if (!role) return;
  const { userId } = await auth();
  if (!userId) return;

  const { clerkClient } = await import("@clerk/nextjs/server");
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { role },
  });
}
