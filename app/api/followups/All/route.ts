import FollowUp from "@/app/models/followup";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const Allfollowup = await FollowUp.find()
    if (!Allfollowup) {
      return NextResponse.json(
        { message: "No follow-ups found" },
        { status: 404 }
      );
    }
    return NextResponse.json( 
      { message: "Follow-ups", data: Allfollowup },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err?.message ?? err, "failed");
    return NextResponse.json(
      { message: "Failed to find followups" },
      { status: 500 }
    );
  }
}