import type { Transporter, SendMailOptions } from "nodemailer";

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 2000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Sends one mail, retrying transient SMTP failures with a linear backoff.
 * Rethrows the last error when every attempt failed, so the caller can alert on it.
 */
export const sendMailWithRetry = async (
  transporter: Transporter,
  options: SendMailOptions,
  label: string
) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await transporter.sendMail(options);
    } catch (err) {
      lastError = err;
      console.warn(
        `Email attempt ${attempt}/${MAX_ATTEMPTS} failed (${label} -> ${options.to}):`,
        (err as Error).message
      );
      if (attempt < MAX_ATTEMPTS) await wait(RETRY_BASE_DELAY_MS * attempt);
    }
  }

  throw lastError;
};
