import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";
export async function POST(request) {
  try {
    await connectDB();

    const { email, password, } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email });
console.log(user)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
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

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      jwtSecret,
      {
        expiresIn: "7d",
      }
    );


    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: 200
      }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response

  } catch (error) {
    console.error("Login error:", error);

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
