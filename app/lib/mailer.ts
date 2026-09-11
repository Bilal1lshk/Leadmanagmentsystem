import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail({ to, subject, text, html }: SendEmailOptions) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  if (!from) throw new Error("EMAIL_FROM or SMTP_USER is required.");

  return createTransporter().sendMail({
    from,
    to,
    subject,
    text,
    html,
  });
}

export function sendVerificationEmail(email: string, code: string) {
  return sendEmail({
    to: email,
    subject: "Verify your Leadwise account",
    text: `Your Leadwise verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Leadwise verification code is:</p><p style="font-size: 24px; font-weight: 700; letter-spacing: 6px">${code}</p><p>This code expires in 10 minutes.</p>`,
  });
}