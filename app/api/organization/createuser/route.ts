import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";
import Organization from "@/app/models/organization";
import OrganizationMember from "@/app/models/organizationMember";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/app/lib/auth";

/**
 * POST /api/organization/createuser
 *
 * Allows an Organization Admin to create a new user account and
 * automatically add them as a member of the admin's organization.
 *
 * Authorization rules:
 *   - Must be authenticated (valid JWT cookie).
 *   - Must be an "Admin" member of an existing organization.
 *     Regular employees and viewers cannot create users.
 *
 * Request body:
 *   {
 *     organizationId: string,   // which org to add the user to
 *     name: string,
 *     email: string,
 *     password: string,
 *     role?: "employee" | "viewer"   // org-level role; defaults to "employee"
 *   }
 *
 * Response:
 *   201 { success, message, user: { id, name, email }, member: { role } }
 */
export async function POST(request:Request) {
  try {
    // ── 1. Authenticate ───────────────────────────────────────────────────────
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return unauthorizedResponse("You must be logged in to perform this action.");
    }

    // ── 2. Parse & validate body ──────────────────────────────────────────────
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { organizationId, name, email, password, role } = body;

    if (!organizationId) {
      return NextResponse.json(
        { success: false, message: "organizationId is required." },
        { status: 400 }
      );
    }
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const allowedOrgRoles = ["employee", "viewer"];
    const newMemberRole = role && allowedOrgRoles.includes(role) ? role : "employee";
    // Admins cannot assign another Admin through this route — Admin is reserved for the owner.

    // ── 3. Connect to DB ──────────────────────────────────────────────────────
    await connectDB();

    // ── 4. Verify the organization exists ─────────────────────────────────────
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return NextResponse.json(
        { success: false, message: "Organization not found." },
        { status: 404 }
      );
    }

    // ── 5. Authorize — current user must be an Admin of this organization ─────
    const callerMembership = await OrganizationMember.findOne({
      user: currentUser._id,
      organization: organizationId,
    });

    if (!callerMembership || callerMembership.role !== "Admin") {
      return forbiddenResponse(
        "Only an Admin of this organization can create users."
      );
    }

    // ── 6. Check if the email is already taken ────────────────────────────────
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "A user with this email already exists." },
        { status: 409 }
      );
    }

    // ── 7. Create the User ────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "agent", // platform role is always "agent" for org-created users
    });

    // ── 8. Add as OrganizationMember ──────────────────────────────────────────
    let member;
    try {
      member = await OrganizationMember.create({
        user: newUser._id,
        organization: organizationId,
        role: newMemberRole,
      });
    } catch (memberErr) {
      // Compensating write — delete the user if membership fails
      await User.findByIdAndDelete(newUser._id);
      throw memberErr;
    }

    // ── 9. Respond (never expose the hashed password) ────────────────────────
    return NextResponse.json(
      {
        success: true,
        message: `User created and added to "${organization.name}" as ${newMemberRole}.`,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
        member: {
          role: member.role,
          organization: organization.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create org user error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
