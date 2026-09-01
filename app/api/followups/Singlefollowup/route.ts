import FollowUp from "@/app/models/followup";
import Lead from "@/app/models/lead";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    
    await connectDB();
    const _l = Lead;
    const _u = User;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Follow-up ID is required" }, { status: 400 });
    }

    const singlefollowup = await FollowUp.findOne({
      _id: id,
      organization: membership.organization,
    })
      .populate("lead")
      .populate("assignedTo")
      .populate("CreatedBy");

    if (!singlefollowup) {
      return NextResponse.json({ message: "Follow-up not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Follow-up details", singlefollowup, success: true },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Fetch single followup error:", err);
    return NextResponse.json(
      { message: "Failed to fetch follow-up" },
      { status: 500 }
    );
  }
}
