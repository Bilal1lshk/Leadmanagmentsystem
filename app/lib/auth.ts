import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import connectDB from "@/app/config/mongodbconnection";
import User,{IUser} from "@/app/models/user";
import OrganizationMember, { IOrganizationMember } from "@/app/models/organizationMember";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const nextAuthCookieName =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

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
  let userId: string | undefined;

  try {
    const tokenCookie = request.cookies.get("token");
    const jwtSecret = process.env.JWT_SECRET || process.env.AUTH_SECRET;

    if (tokenCookie?.value && jwtSecret) {
      const decoded = jwt.verify(tokenCookie.value, jwtSecret) as DecodedToken;
      userId = decoded?.userId;
    }
  } catch {
    userId = undefined;
  }

  if (!userId && process.env.NEXTAUTH_SECRET) {
    try {
      const nextAuthToken = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: nextAuthCookieName,
      });
      userId = typeof nextAuthToken?.id === "string" ? nextAuthToken.id : undefined;
    } catch {
      userId = undefined;
    }
  }

  if (!userId) return null;

  await connectDB();
  const user = await User.findById(userId).select("-password");
  return user || null;
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