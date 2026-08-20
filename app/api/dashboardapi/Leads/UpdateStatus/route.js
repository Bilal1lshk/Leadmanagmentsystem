import { NextResponse } from "next/server";
import dbConnect from "../../../../config/mongodbconnection";
import Lead from "../../../../models/lead";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function PATCH(req) {
  try {
    const user = await getCurrentUser(req);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(req, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first." }, { status: 403 });
    await dbConnect();
    const { leadId, status, lostReason } = await req.json();

    if (!leadId || !status) {
      return NextResponse.json({ message: "leadId and status are required" }, { status: 400 });
    }

    const validStatuses = ["new", "contacted", "qualified", "proposal", "won", "lost"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    const updatePayload = {
      status,
      lastContactedAt: new Date(),
      ...(status === "lost" && lostReason ? { lostReason } : {}),
    };

    const updated = await Lead.findOneAndUpdate({ _id: leadId, organization: membership.organization }, updatePayload, { new: true }).lean();
    if (!updated) return NextResponse.json({ message: "Lead not found" }, { status: 404 });

    return NextResponse.json({ lead: updated, message: "Lead status updated", success: true });
  } catch (err) {
    console.error("UpdateStatus error:", err);
    return NextResponse.json({ message: "Failed to update lead status" }, { status: 500 });
  }
}
