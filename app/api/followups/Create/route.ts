import FollowUp from "@/app/models/followup";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import Lead from "@/app/models/lead";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    await connectDB();
    const lead = await Lead.findOne({ _id: body.lead, organization: membership.organization });
    if (!lead) return NextResponse.json({ message: "Lead not found" }, { status: 404 });
    const newFollowUp = await FollowUp.create({
      organization: membership.organization,
      lead: body.lead,
      status: body.status,
      comments: body.comments,
      duedate: body.duedate,
      CreatedBy: user._id,
      assignedTo: body.assignedTo,
    });
    if (!newFollowUp) {
      return NextResponse.json(
        { message: "Follow-up could not be created" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Follow-up created", data: newFollowUp ,succes:true},
      { status: 201 ,}
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Failed to create follow-up" },
      { status: 500 }
    );
  }
}
