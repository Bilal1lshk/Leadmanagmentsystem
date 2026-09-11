import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";
import { sendVerificationEmail } from "@/app/lib/mailer";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await request.json();

    // Validate fields
        if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email,role and password are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;

    if (!jwtSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication secret is not configured",
        },
        { status: 503 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const verificationCodeHash = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    const newUser = await User.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || "agent",
      verified: false,
      verificationCodeHash,
      verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
      await sendVerificationEmail(newUser.email, verificationCode);
    } catch (error) {
      await User.findByIdAndDelete(newUser._id);
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email.",
        requiresVerification: true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {

    const isDbConfigError =
      error instanceof Error && error.message.includes("Missing MongoDB connection string");

    return NextResponse.json(
      {
        success: false,
        message: isDbConfigError
          ? "Database connection is not configured"
          : "Internal server error",
      },
      { status: isDbConfigError ? 503 : 500 }
    );
  }
}
