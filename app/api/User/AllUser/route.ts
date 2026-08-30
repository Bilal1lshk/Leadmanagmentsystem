import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import OrganizationMember from "@/app/models/organizationMember";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    await connectDB();
    const members = await OrganizationMember.find({ organization: membership.organization }).populate("user", "name email avatar").lean();
    const allusers = members
        .filter((member) => member.user)
        .map((member) => ({ ...member.user, membershipId: member._id, organizationRole: member.role }));
    return NextResponse.json({
        allusers,
        message: "All users avaliable",
        succes: true
    })

}
