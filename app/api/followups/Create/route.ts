import FollowUp from "@/app/models/followup";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
export async function POST(request: Request) {
  console.log("request hitted")
  try {
    const body = await request.json();
    const Allcookie = await cookies();
    const token = Allcookie.get("token")?.value
    if (!token) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    const decoded = jwt.decode(token)
    const newFollowUp = await FollowUp.create({
      lead: body.lead,
      status: body.status,
      comments: body.comments,
      duedate: body.duedate,
      CreatedBy: decoded?.userId,
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
    console.log(err?.message ?? err, "failed");
    return NextResponse.json(
      { message: "Failed to create follow-up" },
      { status: 500 }
    );
  }
}