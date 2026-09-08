import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
    const resendApiKey = process.env.RESEND_API_KEY;
    const to = process.env.EMAIL_TO;

    if (!resendApiKey || !to) {
        return NextResponse.json(
            {
                success: false,
                message: "Email service is not configured.",
            },
            { status: 503 }
        );
    }


    try {
        const resend = new Resend(resendApiKey);
        const { data, error } = await resend.emails.send({
            from: "delivered@resend.dev",
            to:to,
            subject: "Checking Resend email",
            html: "<h1>It is working</h1><p>This is a test email from LeadWise.</p>",
        });

        if (error) {
            const providerMessage =
                typeof error.message === "string" ? error.message : "Unknown provider error";

            return NextResponse.json(
                {
                    success: false,
                    message: providerMessage.includes("only send testing emails")
                        ? "Resend testing mode only allows delivery to your Resend account email. Update EMAIL_TO or verify a sending domain."
                        : "The email provider rejected the message.",
                },
                { status: 502 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Email sent successfully.",
                data,
            },
        );
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Unable to send email right now.",
            },
            { status: 502 }
        );
    }
}