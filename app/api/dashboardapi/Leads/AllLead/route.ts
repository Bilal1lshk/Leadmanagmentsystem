import { NextResponse } from "next/server";
import leadmodel from "@/app/models/lead.js";
import dbConnect from "@/app/config/mongodbconnection.js"
export async function GET() {
  try {
    await dbConnect();

    const data = await leadmodel.find();

    if (data.length === 0) {
      return NextResponse.json(
        {
          message: "No leads found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully loaded",
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Failed to load leads",
        success: false,
      },
      { status: 500 }
    );
  }
}