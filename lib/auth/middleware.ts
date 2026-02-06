import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, JWTPayload } from "./jwt";

export async function getAuthUser(): Promise<JWTPayload | null> {
  try {
    // 1. Get cookies
    const cookieStore = await cookies();

    // 2. Get token from cookies
    const token = cookieStore.get("token");

    // 3. If no token, return null
    if (!token) {
      return null;
    }

    // 4. Verify token and return user
    const user = verifyToken(token.value);

    return user;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized - Please log in" },
    { status: 401 },
  );
}
