import crypto from "crypto";

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? "change-this-secret";
  return crypto.createHmac("sha256", secret).update(email.toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    const tokenBuf = Buffer.from(token, "hex");
    const expectedBuf = Buffer.from(expected, "hex");
    if (tokenBuf.length !== expectedBuf.length) return false;
    return crypto.timingSafeEqual(tokenBuf, expectedBuf);
  } catch {
    return false;
  }
}

export function buildUnsubscribeUrl(email: string): string {
  const base = process.env.STRAPI_URL ?? "http://localhost:1337";
  const token = generateUnsubscribeToken(email);
  return `${base}/api/newsletter-signups/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}
