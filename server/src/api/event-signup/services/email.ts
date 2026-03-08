// src/api/event-signup/services/email.ts
import nodemailer from 'nodemailer';

// For development/testing, use Ethereal (fake SMTP)
let transporter: nodemailer.Transporter;

const setupTransporter = async () => {
  if (process.env.NODE_ENV === 'development') {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Using Ethereal test account:', testAccount);
  } else {
    // Production: use real SMTP
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
};

// Initialize transporter
setupTransporter();

export const sendSignupEmails = async (signupData: {
  userEmail: string;
  firstName: string;
  lastName: string;
  eventName: string;
  telephone: string;
}) => {
  // Ensure transporter is set up
  if (!transporter) {
    await setupTransporter();
  }

  const adminEmail = process.env.ADMIN_EMAIL;

  // Email to the user (confirmation)
  await transporter.sendMail({
    from: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
    to: signupData.userEmail,
    subject: `Jelentkezés túrára`,
    html: `<h2>Sikeres túrajelentkezés!</h2>
        <p>Kedves ${signupData.lastName} ${signupData.firstName}, jelentkezésedet megkaptuk. Erre a túrára jelentkeztél : ${signupData.eventName}. Hamarosan felvesszük veled a kapcsolatot.</p>`,
  });

  // Email to admin (notification)
  await transporter.sendMail({
    from: `"Gyertek velünk Túrajelentkezés" <${process.env.SMTP_USER}>`,
    to: adminEmail,
    subject: `Túrajelentkezés: ${signupData.eventName}`,
    html: `
      <h2>Új túrajelentkezés</h2>
      <p><strong>Név:</strong> ${signupData.lastName} ${signupData.firstName}</p>
      <p><strong>Email:</strong> ${signupData.userEmail}</p>
      <p><strong>Túra:</strong> ${signupData.eventName}</p>
      <p><strong>Telefonszám:</strong> ${signupData.telephone}</p>
    `,
  });
};
