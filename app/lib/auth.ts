import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";
import connectDB from "@/app/config/mongodbconnection";
import User,{IUser} from "@/app/models/user";
import OrganizationMember, { IOrganizationMember } from "@/app/models/organizationMember";

interface DecodedToken extends JwtPayload {
  userId: string;
}

/**
 * Extracts and verifies the JWT from the HTTP-only "token" cookie,
 * then returns the full User document (without password).
 *
 * Returns null if the cookie is missing, the token is invalid, or
 * the user no longer exists in the database.
 *
 * @param request - The incoming Next.js route handler request
 */
export async function getCurrentUser(
  request: NextRequest
): Promise<IUser | null> {
  try {
    const tokenCookie = request.cookies.get("token");
    if (!tokenCookie?.value) return null;

    const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
    if (!jwtSecret) return null;

    const decoded = jwt.verify(tokenCookie.value, jwtSecret) as DecodedToken;
    if (!decoded?.userId) return null;

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    return user || null;
  } catch {
    // Handles jwt.verify errors (expired, malformed, etc.)
    return null;
  }
}

export function unauthorizedResponse(message: string = "Unauthorized"): Response {
  return Response.json({ success: false, message }, { status: 401 });
}


export function forbiddenResponse(message: string = "Forbidden"): Response {
  return Response.json({ success: false, message }, { status: 403 });
}

export async function getCurrentOrganization(
  request: NextRequest,
  currentUser?: IUser | null
): Promise<IOrganizationMember | null> {
  const user = currentUser || (await getCurrentUser(request));
  if (!user) return null;

  const requestedOrganizationId = request.headers.get("x-organization-id");
  await connectDB();

  const query: Record<string, unknown> = { user: user._id };
  if (requestedOrganizationId) query.organization = requestedOrganizationId;

  return OrganizationMember.findOne(query).sort({ createdAt: 1 }).lean();
}