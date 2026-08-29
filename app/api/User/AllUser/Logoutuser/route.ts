import { NextResponse } from "next/server";
import dbConnect from "@/app/config/mongodbconnection"
import usermodel from "@/app/models/user"
 export async function GET() {
    await dbConnect()
    const allusers = await usermodel.find()
    if (!allusers) return NextResponse.json({ message: "No users found" }, { status: 404 })
    return NextResponse.json({
        allusers,
        message: "All users available",
        success: true
    })
}