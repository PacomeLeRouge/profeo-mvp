const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeContactEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !EMAIL_RE.test(trimmed)) {
    throw new Error("Adresse e-mail invalide");
  }
  if (trimmed.length > 254) {
    throw new Error("Adresse e-mail trop longue");
  }
  return trimmed;
}

/** E-mail de contact explicite du profil, sinon e-mail de connexion Clerk. */
export function resolveContactEmail(
  profileContactEmail: string | null | undefined,
  accountEmail: string
): string {
  const candidate = profileContactEmail?.trim() || accountEmail.trim();
  return normalizeContactEmail(candidate);
}
