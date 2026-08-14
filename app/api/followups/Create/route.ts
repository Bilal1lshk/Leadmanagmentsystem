import FollowUp from "@/app/models/followup";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newFollowUp = await FollowUp.create({
      lead: body.lead,
      comments: body.comments,
      duedate: body.duedate,
      CreatedBy: body.createdBy,
      assignedTo: body.assignedTo,
    });

    if (!newFollowUp) {
      return NextResponse.json(
        { message: "Follow-up could not be created" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Follow-up created", data: newFollowUp },
      { status: 201 }
    );
  } catch (err: any) {
    console.log(err?.message ?? err, "failed");
    return NextResponse.json(
      { message: "Failed to create follow-up" },
      { status: 500 }
    );
  }
}