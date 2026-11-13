import nodemailer from "nodemailer";
import { ETHEREAL_HOST, ETHEREAL_PORT, getEtherealAccount, isDevelopment } from "./ethereal";

let transporter: nodemailer.Transporter;

export const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) return transporter;

  if (isDevelopment()) {
    // A fixed account from the env, or a throwaway one created now (see ethereal.ts)
    const account = getEtherealAccount() ?? (await nodemailer.createTestAccount());
    transporter = nodemailer.createTransport({
      host: ETHEREAL_HOST,
      port: ETHEREAL_PORT,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    });
    console.log(
      getEtherealAccount()
        ? `Using Ethereal account ${account.user} - inbox: https://ethereal.email/messages`
        : `Using a throwaway Ethereal account (set ETHEREAL_USER / ETHEREAL_PASS for a fixed one): ${account.user} / ${account.pass}`
    );
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("Using real SMTP account:", process.env.SMTP_USER);
  }

  return transporter;
};
