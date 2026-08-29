import { NextResponse } from "next/server";
import leadmodel from "@/app/models/lead";
import dbConnect from "@/app/config/mongodbconnection.ts"
import { getCurrentOrganization, getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    const membership = await getCurrentOrganization(request, user);
    if (!membership) return NextResponse.json({ message: "Select a workspace first.", success: false }, { status: 403 });
    await dbConnect();

    const data = await leadmodel.find({ organization: membership.organization });
    if (data.length === 0) {
      return NextResponse.json(
        {
          message: "No leads found",
          success: true,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully loaded",
        data,
        success: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        message: "Failed to load leads",
        success: false,
      },
      { status: 500 }
    );
  }
}
