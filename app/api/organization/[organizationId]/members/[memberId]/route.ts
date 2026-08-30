import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import OrganizationMember from "@/app/models/organizationMember";
import { getCurrentUser, forbiddenResponse, unauthorizedResponse } from "@/app/lib/auth";

const assignableRoles = ["employee", "viewer"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ organizationId: string; memberId: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) return unauthorizedResponse();
    const { organizationId, memberId } = await params;
    const { role } = await request.json();
    if (!assignableRoles.includes(role)) {
      return NextResponse.json({ success: false, message: "Role must be employee or viewer." }, { status: 400 });
    }

    await connectDB();
    const caller = await OrganizationMember.findOne({ user: currentUser._id, organization: organizationId }).lean();
    if (!caller || caller.role !== "Admin") return forbiddenResponse("Only workspace Admins can update positions.");

    const member = await OrganizationMember.findOneAndUpdate(
      { _id: memberId, organization: organizationId },
      { role },
      { new: true }
    ).populate("user", "name email avatar");
    if (!member) return NextResponse.json({ success: false, message: "Member not found." }, { status: 404 });

    return NextResponse.json({ success: true, member: { membershipId: member._id, user: member.user, organizationRole: member.role } });
  } catch (error) {
    console.error("Update member role error:", error);
    return NextResponse.json({ success: false, message: "Unable to update position." }, { status: 500 });
  }
}
