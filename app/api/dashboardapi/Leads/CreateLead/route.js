import { NextResponse } from "next/server";
import leadmodel from "../../../../models/lead.js";
import connectDB from "@/app/config/mongodbconnection";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";
export async function POST(Request) {
  try {
    const user = await getCurrentUser(Request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(Request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first." }, { status: 403 });
    await connectDB();
    const {
      status,
      personId,
      source,
      priority,
      estimatedValue,
      assignedTo,
      lastContactedAt,
      lostReason,
    } = await Request.json();
    if (!personId || 
      !status ||
      !priority ||
      estimatedValue === undefined ||
      !lastContactedAt) {
      return NextResponse.json(
        { message: "all fields should be filled" },
        { status: 400 }
      );
    }

    if (status === "lost" && !lostReason) {
      return NextResponse.json(
        { message: "all fields should be filled" },
        { status: 400 }
      );
    }

    const created = await leadmodel.create({
      organization: membership.organization,
      personId,
      source,
      sourcedby: user._id,
      status,
      priority,
      estimatedValue,
      assignedTo,
      lastContactedAt,
      lostReason,
    })

    if(!created) return NextResponse.json({message:"Something went wrong in lead creation try again "})
    return NextResponse.json({ message: "lead created succesfully", data: created, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
