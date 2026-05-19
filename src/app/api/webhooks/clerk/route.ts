import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { resolveClerkDisplayName } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    if (event.type === "user.created") {
      const { id, email_addresses, first_name, last_name, username } = event.data;

      const email =
        email_addresses.find((e) => e.id === event.data.primary_email_address_id)
          ?.email_address ??
        email_addresses[0]?.email_address ??
        "";

      const name = resolveClerkDisplayName({
        firstName: first_name,
        lastName: last_name,
        username,
        email,
      });

      await db
        .insert(users)
        .values({ id, email, name })
        .onConflictDoUpdate({
          target: users.id,
          set: { email, name, updatedAt: new Date() },
        });
    }

    if (event.type === "user.updated") {
      const { id, email_addresses } = event.data;

      const email =
        email_addresses.find((e) => e.id === event.data.primary_email_address_id)
          ?.email_address ??
        email_addresses[0]?.email_address ??
        "";

      if (!id || !email) {
        return new Response("OK", { status: 200 });
      }

      // Ne pas écraser le prénom choisi en onboarding — email uniquement.
      await db
        .update(users)
        .set({ email, updatedAt: new Date() })
        .where(eq(users.id, id));
    }

    if (event.type === "user.deleted") {
      await db.delete(users).where(eq(users.id, event.data.id!));
    }

    return new Response("OK", { status: 200 });
  } catch {
    return new Response("Webhook verification failed", { status: 400 });
  }
}
