import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validatePasswordResetToken } from "@/lib/auth/password-reset-tokens";
import { hashPassword } from "@/lib/auth/password";
import { isValidPassword } from "@/lib/auth/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    // Validate inputs
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 },
      );
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and less than 128 characters",
        },
        { status: 400 },
      );
    }

    // Validate token
    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 },
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Delete the used token
    await prisma.passwordResetToken.delete({
      where: { token },
    });

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
