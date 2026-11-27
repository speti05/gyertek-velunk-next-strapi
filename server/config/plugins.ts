import { EMAIL_DEFAULT_FROM_NAME } from "../src/i18n/texts-strapi";
import { ETHEREAL_HOST, ETHEREAL_PORT, getEtherealAccount, isDevelopment } from "../src/lib/email/ethereal";
import { isOutboxOnlyDelivery } from "../src/lib/email/outbox";

export default () => {
  // In development the Strapi system e-mails (password reset, e-mail confirmation) go to the
  // same Ethereal account as our own e-mails (lib/email/mailer.ts), when one is configured
  const ethereal = isDevelopment() ? getEtherealAccount() : null;
  const smtp = ethereal
    ? { host: ETHEREAL_HOST, port: ETHEREAL_PORT, secure: false, ...ethereal }
    : {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      };

  // The e2e runs keep every e-mail on the machine (see isOutboxOnlyDelivery)
  const outboxOnly = isOutboxOnlyDelivery();

  const config = {
    "users-permissions": {
      config: {
        // The plugin's own limiter (5 requests / 5 min) keys /auth/local and /auth/reset-password
        // on the IP alone. Only the e2e Strapi turns it off, like our limits in
        // lib/auth/auth-overrides.ts: every request of the suite comes from the one Next.js server.
        ratelimit: { enabled: process.env.AUTH_RATE_LIMIT_DISABLED !== "true" },
      },
    },
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: outboxOnly
          ? { jsonTransport: true }
          : {
              host: smtp.host,
              port: smtp.port,
              secure: smtp.secure,
              auth: {
                user: smtp.user,
                pass: smtp.pass,
              },
            },
        settings: {
          defaultFrom: `"${EMAIL_DEFAULT_FROM_NAME}" <${smtp.user}>`,
          defaultReplyTo: smtp.user,
        },
      },
    },
  };

  console.log(
    `Strapi Email plugin config(for reset password, email confirmation): ${outboxOnly ? "outbox only" : ethereal ? "Ethereal" : "SMTP"} as ${smtp.user}`
  );
  return config;
};
