import { NextResponse } from "next/server";
import dbConnect from "../../../config/mongodbconnection";
import taskmodel from "../../../models/task";
import "../../../models/lead";
import "../../../models/user";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first" }, { status: 403 });
    await dbConnect();
    const alltasks = await taskmodel
      .find({ organization: membership.organization })
      .populate("leadId", "personId status")
      .populate("assignedTo", "name email avatar")
      .lean();
    return NextResponse.json({
      alltasks,
      message: "All tasks fetched successfully",
      success: true,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json(
      { message: "Error in fetching tasks" },
      { status: 500 }
    );
  }
}
