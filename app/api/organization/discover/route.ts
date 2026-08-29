import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import Organization from "@/app/models/organization";
import OrganizationMember from "@/app/models/organizationMember";
import { getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request:Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return unauthorizedResponse();
    await connectDB();

    if (await OrganizationMember.exists({ user: user._id })) {
      return NextResponse.json({ success: false, message: "You already belong to a workspace." }, { status: 409 });
    }

    const search = new URL(request.url).searchParams.get("search")?.trim();
    const filter = search ? { name: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {};
    const organizations = await Organization.find(filter)
      .select("name companysize")
      .sort({ name: 1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, organizations });
  } catch (error) {
    console.error("Discover organizations error:", error);
    return NextResponse.json({ success: false, message: "Unable to load workspaces." }, { status: 500 });
  }
}
