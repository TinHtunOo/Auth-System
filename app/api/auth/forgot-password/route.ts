import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/auth/password-reset-tokens";
import { sendPasswordResetEmail } from "@/lib/email/mailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email provided
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      // Don't reveal that user doesn't exist
      return NextResponse.json(
        {
          message: "If an account exists, a password reset email has been sent",
        },
        { status: 200 },
      );
    }

    // Create reset token
    const token = await createPasswordResetToken(user.id);

    // Send email
    try {
      await sendPasswordResetEmail(user.email, token);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      { message: "If an account exists, a password reset email has been sent" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
