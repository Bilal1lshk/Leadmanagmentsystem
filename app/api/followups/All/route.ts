import FollowUp from "@/app/models/followup";
import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    await connectDB();
    const Allfollowup = await FollowUp.find({ organization: membership.organization })
    return NextResponse.json( 
      { message: "Follow-ups", data: Allfollowup },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to find followups" },
      { status: 500 }
    );
  }
}
