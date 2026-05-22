import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export type LessonRequestActionStatus = "Confirmed" | "Declined";

function getSecret(): string {
  const dedicated = process.env.LESSON_REQUEST_TOKEN_SECRET?.trim();
  if (dedicated) return dedicated;
  const clerk = process.env.CLERK_SECRET_KEY?.trim();
  if (clerk) return clerk;
  throw new Error("Missing LESSON_REQUEST_TOKEN_SECRET or CLERK_SECRET_KEY");
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function createLessonRequestActionToken(
  requestId: string,
  status: LessonRequestActionStatus
): string {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${requestId}:${status}:${exp}`;
  return `${Buffer.from(payload, "utf8").toString("base64url")}.${signPayload(payload)}`;
}

export function verifyLessonRequestActionToken(
  requestId: string,
  status: LessonRequestActionStatus,
  token: string
): { valid: true } | { valid: false; reason: "expired" | "invalid" } {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) {
    return { valid: false, reason: "invalid" };
  }

  let payload: string;
  try {
    payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
  } catch {
    return { valid: false, reason: "invalid" };
  }

  const expected = signPayload(payload);
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(signature);
  if (
    expectedBuf.length !== signatureBuf.length ||
    !timingSafeEqual(expectedBuf, signatureBuf)
  ) {
    return { valid: false, reason: "invalid" };
  }

  const [tokenRequestId, tokenStatus, expRaw] = payload.split(":");
  if (tokenRequestId !== requestId || tokenStatus !== status) {
    return { valid: false, reason: "invalid" };
  }

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return { valid: false, reason: "expired" };
  }

  return { valid: true };
}

export function buildLessonRequestRespondUrl(
  requestId: string,
  status: LessonRequestActionStatus,
  appUrl: string
): string {
  const token = createLessonRequestActionToken(requestId, status);
  const params = new URLSearchParams({
    requestId,
    status,
    token,
  });
  return `${appUrl}/requests/respond?${params.toString()}`;
}
