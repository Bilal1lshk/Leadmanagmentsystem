import { NextRequest, NextResponse } from "next/server";
import taskmodel from "@/app/models/task"
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const singletask = await taskmodel.findOne({ _id: userId })
    if (!singletask) return NextResponse.json({
      message: "something went wrong"
    });

   return NextResponse.json({
      message: "it worked",
      singletask,
      sucess: true
    }, { status: 200 })


  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get user ID",
      },
      { status: 500 }
    );
  }
}