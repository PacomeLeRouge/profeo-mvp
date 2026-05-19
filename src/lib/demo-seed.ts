/** IDs créés par `npm run db:seed` — exclus des tableaux de bord production. */
export const DEMO_SEED_USER_PREFIX = "seed_";

export function isDemoSeedUserId(userId: string) {
  return userId.startsWith(DEMO_SEED_USER_PREFIX);
}
