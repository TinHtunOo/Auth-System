import { NextResponse } from "next/server";

export async function POST() {
  // Create response
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );

  // Delete the token cookie
  response.cookies.delete("token");

  return response;
}
