import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import OrganizationMember from "@/app/models/organizationMember";
import WorkspaceJoinRequest from "@/app/models/workspaceJoinRequest";
import { getCurrentUser, forbiddenResponse, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request, { params }) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const { organizationId } = await params;
    await connectDB();
    const membership = await OrganizationMember.findOne({ user: user._id, organization: organizationId }).lean();
    if (!membership || membership.role !== "Admin") return forbiddenResponse("Only workspace Admins can view join requests.");

    const requests = await WorkspaceJoinRequest.find({ organization: organizationId, status: "pending" })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Get admin join requests error:", error);
    return NextResponse.json({ success: false, message: "Unable to load join requests." }, { status: 500 });
  }
}
