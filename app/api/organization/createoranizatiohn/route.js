import { NextResponse } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import Organization from "@/app/models/organization";
import OrganizationMember from "@/app/models/organizationMember";
import { getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

/**
 * POST /api/organization/createoranizatiohn
 *
 * Creates a new Organization for the authenticated user.
 * The creator automatically becomes the Owner and an Admin member of the org.
 *
 * Request body:
 *   { name: string, companySize?: string }
 *
 * Response:
 *   201 { success, message, organization: { _id, name, companysize, plan } }
 */
export async function POST(request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return unauthorizedResponse("You must be logged in to perform this action.");
    }

    // ── Parse & validate body ──────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const companySize = body.companySize || "1-10";

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Organization name is required." },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { success: false, message: "Organization name must be 100 characters or fewer." },
        { status: 400 }
      );
    }

    const validSizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
    if (!validSizes.includes(companySize)) {
      return NextResponse.json(
        { success: false, message: "Invalid company size value." },
        { status: 400 }
      );
    }

    // ── 4. Connect to DB ──────────────────────────────────────────────────────
    await connectDB();

    // ── 5. Check for duplicate name owned by this user ────────────────────────
    const existing = await Organization.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      owner: currentUser._id,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "You already have an organization with this name." },
        { status: 409 }
      );
    }

    // ── 6. Create Organization ────────────────────────────────────────────────
    // owner and createdBy always come from the server-side verified user —
    // never from the client request body.
    const organization = await Organization.create({
      name,
      companysize: companySize,
      owner: currentUser._id,
      createdBy: currentUser._id,
      plan: "free",
    });

    // ── 7. Create OrganizationMember (creator = Admin) ────────────────────────
    // If this fails, remove the orphaned organization before responding.
    try {
      await OrganizationMember.create({
        user: currentUser._id,
        organization: organization._id,
        role: "Admin",
      });
    } catch (memberErr) {
      // Compensating write — keep DB consistent without a transaction
      await Organization.findByIdAndDelete(organization._id);
      throw memberErr;
    }

    // ── 8. Respond ────────────────────────────────────────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: "Organization created successfully.",
        organization: {
          _id: organization._id,
          name: organization.name,
          companysize: organization.companysize,
          plan: organization.plan,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create organization error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
