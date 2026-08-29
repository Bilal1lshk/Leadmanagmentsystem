import { NextResponse } from "next/server";
import { getCurrentUser, unauthorizedResponse } from "@/app/lib/auth";

export async function GET(request:Request) {
  const user = await getCurrentUser(request);
  if (!user) return unauthorizedResponse();

  return NextResponse.json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}
