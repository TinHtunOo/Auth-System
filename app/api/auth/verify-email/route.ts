import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateVerificationToken } from "@/lib/auth/tokens";

export async function POST(request: Request) {
  try {
    // 1. Get token from request body
    const body = await request.json();
    const { token } = body;

    // 2. Check token exists in request
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // 3. Validate token (returns userId or null)
    const userId = await validateVerificationToken(token);

    // 4. If invalid or expired
    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // 5. Check if user is already verified
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 200 },
      );
    }

    // 6. Update user emailVerified = true
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: true },
    });

    // 7. Delete the used token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // 8. Return success
    return NextResponse.json(
      { message: "Email verified successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
