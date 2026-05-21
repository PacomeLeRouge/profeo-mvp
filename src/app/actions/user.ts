"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { ensureDbUser, requireAuthUserId, syncClerkRole } from "@/lib/auth";
import type { Role } from "@/lib/types";

export async function setUserRole(role: "student" | "tutor") {
  const userId = await requireAuthUserId();
  const user = await ensureDbUser();
  if (!user) {
    throw new Error("Session introuvable. Reconnectez-vous.");
  }

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await syncClerkRole(role);

  revalidatePath("/", "layout");
}

export async function getCurrentUserAction() {
  const user = await ensureDbUser();
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    role: user.role as Role,
    email: user.email,
    emailContactConsentAt: user.emailContactConsentAt?.toISOString() ?? null,
  };
}
