import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import Organization from "@/app/models/organization";
import OrganizationMember from "@/app/models/organizationMember";
import WorkspaceJoinRequest from "@/app/models/workspaceJoinRequest";
import { getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const { organizationId, message = "" } = await request.json();
    if (!organizationId) return NextResponse.json({ success: false, message: "Select a workspace." }, { status: 400 });
    if (typeof message !== "string" || message.length > 500) return NextResponse.json({ success: false, message: "Message must be 500 characters or fewer." }, { status: 400 });

    await connectDB();
    if (await OrganizationMember.exists({ user: user._id })) {
      return NextResponse.json({ success: false, message: "You already belong to a workspace." }, { status: 409 });
    }
    const organization = await Organization.findById(organizationId).select("name");
    if (!organization) return NextResponse.json({ success: false, message: "Workspace not found." }, { status: 404 });

    const joinRequest = await WorkspaceJoinRequest.create({ user: user._id, organization: organization._id, message: message.trim() });
    return NextResponse.json({ success: true, message: `Request sent to ${organization.name}.`, request: joinRequest }, { status: 201 });
  } catch (error) {
    console.error("Create join request error:", error);
    return NextResponse.json({ success: false, message: "Unable to send request." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    await connectDB();
    const requests = await WorkspaceJoinRequest.find({ user: user._id }).populate("organization", "name companysize").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Get join requests error:", error);
    return NextResponse.json({ success: false, message: "Unable to load requests." }, { status: 500 });
  }
}
