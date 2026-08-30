import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await request.json();

    // Validate fields
        if (!name || !email || !password ||!role) {
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
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "agent",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
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
    console.error("Signup error:", error);

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
