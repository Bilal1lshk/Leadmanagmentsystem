import { NextResponse } from "next/server";
import { Resend } from "resend";
async function sendEmail() {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            throw new Error("Resend API key is not defined in environment variables.");
        }
        const resend = new Resend(resendApiKey)
        const data = resend.emails.send({
            from: "bilalsheikhsb77@gmail.com",
            to: "bdigitalstudio@gmail.com",
            subject: "Checking resend email",
            html: "<h1>its working<?h1>"
        })
        NextResponse.json({
            message: "done"
        })

    } catch (err) {
        console.log(err)
    }



}