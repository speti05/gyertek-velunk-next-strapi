/**
 * Ethereal (https://ethereal.email) is a fake SMTP service: it accepts every e-mail and
 * delivers none, so in development (and in the e2e runs) nothing reaches a real inbox.
 * Its web inbox at https://ethereal.email/messages shows what was sent, after logging in
 * with the account below.
 *
 * With ETHEREAL_USER / ETHEREAL_PASS set, every run uses that fixed account; without them
 * mailer.ts creates a throwaway one on each start (its login is only in the console log).
 */
export const ETHEREAL_HOST = "smtp.ethereal.email";
export const ETHEREAL_PORT = 587; // STARTTLS

export const isDevelopment = () => process.env.NODE_ENV === "development";

export const getEtherealAccount = (): { user: string; pass: string } | null => {
  const user = process.env.ETHEREAL_USER;
  const pass = process.env.ETHEREAL_PASS;
  return user && pass ? { user, pass } : null;
};
