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

export function sendPasswordResetEmail(email: string, code: string) {
  return sendEmail({
    to: email,
    subject: "Reset your Leadwise password",
    text: `Your Leadwise password reset code is ${code}. It expires in 10 minutes. If you did not request a password reset, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #E5CB90; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #2A3F45; margin-top: 0; font-size: 20px;">Password Reset Request</h2>
        <p style="color: #5C6D71; font-size: 14px; line-height: 1.5;">We received a request to reset the password for your Leadwise account.</p>
        <p style="color: #5C6D71; font-size: 14px;">Use the verification code below to reset your password:</p>
        <div style="background-color: #FFF3C8; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0;">
          <span style="font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #04342C; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #8A8A82; font-size: 12px; line-height: 1.5;">This code will expire in <strong>10 minutes</strong>. If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}