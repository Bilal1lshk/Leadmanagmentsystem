import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import OrganizationMember from "@/app/models/organizationMember";
import Organization from "@/app/models/organization";
import { getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

/**
 * GET /api/organization/my
 *
 * Returns all organizations the authenticated user belongs to.
 */
export async function GET(request:Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return unauthorizedResponse("You must be logged in to perform this action.");
    }

    await connectDB();

    const memberships = await OrganizationMember.find({ user: currentUser._id })
      .populate("organization")
      .sort({ createdAt: -1 });

    const organizations = memberships
      .filter((m) => m.organization)
      .map((m) => ({
        _id: m.organization._id,
        name: m.organization.name,
        companysize: m.organization.companysize,
        plan: m.organization.plan,
        role: m.role,
      }));

    return NextResponse.json(
      {
        success: true,
        organizations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get my organizations error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
