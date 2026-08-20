import { NextResponse } from "next/server";

// A single-follow-up endpoint has not been wired to a dynamic [id] route yet.
// Keep the route explicit instead of leaving a non-module file that breaks
// Next's route validation.
export async function GET() {
  return NextResponse.json(
    { success: false, message: "A follow-up id is required." },
    { status: 400 }
  );
}
