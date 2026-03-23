import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject = "Verification OTP", html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 587,
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });
  return transporter.sendMail({
    from: `"E-commerce-Store" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
