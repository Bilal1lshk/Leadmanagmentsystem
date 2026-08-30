import { NextRequest, NextResponse } from "next/server";
import leadmodel from "../../../../models/lead";
import connectDB from "@/app/config/mongodbconnection";
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";
import { data } from "framer-motion/client";
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
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
      email,
      phone,
      message
    } = await request.json();
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
      email,
      phone,
      message

    })

    if(!created) return NextResponse.json({message:"Something went wrong in lead creation try again "})
    return NextResponse.json({ message: "lead created succesfully", data: created, success: true }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
