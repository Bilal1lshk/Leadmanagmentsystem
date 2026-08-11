import { NextResponse } from "next/server";
import dbConnect from "../../../config/mongodbconnection";
import taskmodel from "../../../models/task";
import "../../../models/lead";
import "../../../models/user";

export async function GET() {
  try {
    await dbConnect();
    const alltasks = await taskmodel
      .find()
      .populate("leadId", "personId status")
      .populate("assignedTo", "name email avatar")
      .lean();
    if (!alltasks || alltasks.length === 0)
      return NextResponse.json({ message: "No tasks found" }, { status: 404 });
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