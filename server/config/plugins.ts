export default () => {
  const config = {
    email: {
      config: {
        provider: "nodemailer",
        providerOptions: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          secure: true,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
        settings: {
          defaultFrom: `"Gyertek velünk" <${process.env.SMTP_USER}>`,
          defaultReplyTo: process.env.SMTP_USER,
        },
      },
    },
  };

  console.log("Strapi Email plugin config(for reset password, email confirmation):");
  // console.dir(config.email, { depth: 3 });
  return config;
};
