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
    const body = await request.json();
    const { id, lead, comments, duedate, assignedTo, status } = body;

    if (!id) {
      return NextResponse.json({ message: "Follow-up ID is required" }, { status: 400 });
    }

    const updatePayload: Record<string, any> = {};
    if (status) updatePayload.status = status;
    if (duedate) updatePayload.duedate = duedate;
    if (comments !== undefined) updatePayload.comments = comments;
    if (lead) updatePayload.lead = lead;
    if (assignedTo) updatePayload.assignedTo = assignedTo;

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

    return NextResponse.json({ data: updated, followup: updated, message: "Follow-up updated", success: true });
  } catch (err) {
    console.error("Update followup error:", err);
    return NextResponse.json({ message: "Failed to update follow-up" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}
