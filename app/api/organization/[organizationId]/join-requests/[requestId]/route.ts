import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import OrganizationMember from "@/app/models/organizationMember";
import WorkspaceJoinRequest from "@/app/models/workspaceJoinRequest";
import { getCurrentUser, forbiddenResponse, unauthorizedResponse } from "@/app/lib/auth";

export async function PATCH(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const { organizationId, requestId } = await params;
    const { action } = await request.json();
    if (!["approve", "reject"].includes(action)) return NextResponse.json({ success: false, message: "Action must be approve or reject." }, { status: 400 });

    await connectDB();
    const membership = await OrganizationMember.findOne({ user: user._id, organization: organizationId }).lean();
    if (!membership || membership.role !== "Admin") return forbiddenResponse("Only workspace Admins can review join requests.");

    const joinRequest = await WorkspaceJoinRequest.findOne({ _id: requestId, organization: organizationId, status: "pending" });
    if (!joinRequest) return NextResponse.json({ success: false, message: "Pending request not found." }, { status: 404 });

    if (action === "approve") {
      const existingMembership = await OrganizationMember.exists({ user: joinRequest.user });
      if (existingMembership) {
        joinRequest.status = "rejected";
        joinRequest.reviewedBy = user._id;
        joinRequest.reviewedAt = new Date();
        await joinRequest.save();
        return NextResponse.json({ success: false, message: "This user already belongs to a workspace." }, { status: 409 });
      }
      await OrganizationMember.create({ user: joinRequest.user, organization: organizationId, role: "employee" });
    }

    joinRequest.status = action === "approve" ? "approved" : "rejected";
    joinRequest.reviewedBy = user._id;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save();
    return NextResponse.json({ success: true, message: action === "approve" ? "Request approved." : "Request rejected." });
  } catch (error) {
    if (error?.code === 11000) return NextResponse.json({ success: false, message: "This user already belongs to a workspace." }, { status: 409 });
    console.error("Review join request error:", error);
    return NextResponse.json({ success: false, message: "Unable to review request." }, { status: 500 });
  }
}
