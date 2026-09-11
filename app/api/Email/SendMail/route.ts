import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailFrom = process.env.EMAIL_FROM || smtpUser;
    const searchParams = new URL(request.url).searchParams;
    const emailTo = searchParams.get("to") || process.env.EMAIL_TO;

    if (!smtpHost || !smtpUser || !smtpPass || !emailFrom || !emailTo) {
      return NextResponse.json(
        {
          success: false,
          error: "SMTP_HOST, SMTP_USER, SMTP_PASS, EMAIL_FROM, and EMAIL_TO are required.",
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const info = await transporter.sendMail({
      from: emailFrom,
      to: emailTo,
      subject: searchParams.get("subject") || "Leadwise email test",
      text:
        searchParams.get("text") ||
        "This is a test email sent with Nodemailer.",
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}