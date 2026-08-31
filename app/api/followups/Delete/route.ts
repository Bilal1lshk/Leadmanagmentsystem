import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import FollowUp from "@/app/models/followup";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first." }, { status: 403 });

    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Follow-up ID is required" }, { status: 400 });
    }

    const deleted = await FollowUp.findOneAndDelete({
      _id: id,
      organization: membership.organization,
    });

    if (!deleted) {
      return NextResponse.json({ message: "Follow-up not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Follow-up deleted successfully", success: true });
  } catch (err) {
    console.error("Delete followup error:", err);
    return NextResponse.json({ message: "Failed to delete follow-up" }, { status: 500 });
  }
}
