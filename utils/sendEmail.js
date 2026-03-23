import sgMail from "@sendgrid/mail";

const sendEmail = async ({ to, subject = "Verification OTP", html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: process.env.EMAIL_USER,
    subject,
    html,
  };

  return sgMail.send(msg);
};

export default sendEmail;
