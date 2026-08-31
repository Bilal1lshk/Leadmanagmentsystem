import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import FollowUp from "@/app/models/followup";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first." }, { status: 403 });

    await connectDB();
    const { id, status, duedate } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "Follow-up ID is required" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (status) updatePayload.status = status;
    if (duedate) updatePayload.duedate = duedate;

    const updated = await FollowUp.findOneAndUpdate(
      { _id: id, organization: membership.organization },
      updatePayload,
      { new: true }
    )
      .populate("lead")
      .populate("assignedTo")
      .populate("CreatedBy");

    if (!updated) {
      return NextResponse.json({ message: "Follow-up not found" }, { status: 404 });
    }

    return NextResponse.json({ data: updated, message: "Follow-up status updated", success: true });
  } catch (err) {
    console.error("Update followup error:", err);
    return NextResponse.json({ message: "Failed to update follow-up" }, { status: 500 });
  }
}
