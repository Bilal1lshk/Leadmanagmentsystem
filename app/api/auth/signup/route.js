import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";

export async function POST(request) {
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
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
