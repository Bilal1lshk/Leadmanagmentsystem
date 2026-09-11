import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (typeof email !== "string" || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: "Enter the six-digit verification code." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user || user.verified) {
      return NextResponse.json({ success: false, message: "Invalid verification request." }, { status: 400 });
    }

    if (!user.verificationCodeExpiry || user.verificationCodeExpiry.getTime() < Date.now()) {
      return NextResponse.json({ success: false, message: "This code has expired. Request a new one." }, { status: 400 });
    }

    const codeHash = crypto.createHash("sha256").update(code).digest("hex");
    if (codeHash !== user.verificationCodeHash) {
      return NextResponse.json({ success: false, message: "The verification code is incorrect." }, { status: 400 });
    }

    user.verified = true;
    user.verificationCodeHash = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to verify your email." }, { status: 500 });
  }
}