import jwt from "jsonwebtoken";
import connectDB from "@/app/config/mongodbconnection";
import User from "@/app/models/user";
import OrganizationMember from "@/app/models/organizationMember";

/**
 * Extracts and verifies the JWT from the HTTP-only "token" cookie,
 * then returns the full User document (without password).
 *
 * Returns null if the cookie is missing, the token is invalid, or
 * the user no longer exists in the database.
 *
 * @param {Request} request - The incoming Next.js route handler request
 */
export async function getCurrentUser(request) {
  try {
    const tokenCookie = request.cookies.get("token");
    if (!tokenCookie?.value) return null;

    const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;
    if (!jwtSecret) return null;

    const decoded = jwt.verify(tokenCookie.value, jwtSecret);
    if (!decoded?.userId) return null;

    await connectDB();
    const user = await User.findById(decoded.userId).select("-password");
    return user || null;
  } catch {
    // Handles jwt.verify errors (expired, malformed, etc.)
    return null;
  }
}

/**
 * Returns a 401 JSON response. Use when getCurrentUser() returns null.
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return Response.json({ success: false, message }, { status: 401 });
}

/**
 * Returns a 403 JSON response. Use when the user is authenticated
 * but does not have the required role/permission.
 */
export function forbiddenResponse(message = "Forbidden") {
  return Response.json({ success: false, message }, { status: 403 });
}

/**
 * Resolves an organization from the request and proves that the current user
 * belongs to it. Clients may send x-organization-id; otherwise the user's
 * first membership is used. This keeps every organization-owned API scoped on
 * the server, never on a client-supplied user id.
 */
export async function getCurrentOrganization(request, currentUser) {
  const user = currentUser || (await getCurrentUser(request));
  if (!user) return null;

  const requestedOrganizationId = request.headers.get("x-organization-id");
  await connectDB();
  const query = { user: user._id };
  if (requestedOrganizationId) query.organization = requestedOrganizationId;

  return OrganizationMember.findOne(query).sort({ createdAt: 1 }).lean();
}
