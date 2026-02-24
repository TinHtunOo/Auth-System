import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth/password";
import { createToken } from "@/lib/auth/jwt";
import { validateRegistration } from "@/lib/auth/validation";
import { createVerificationToken } from "@/lib/auth/tokens";
import { sendVerificationEmail } from "@/lib/email/mailer";

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { email, password, name } = body;

    // 2. Validate input
    const validation = validateRegistration({ email, password, name });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // 3. Check if user already exists
    // Use prisma.user.findUnique({ where: { email } })
    // If exists, return error
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
          suggestion:
            "Try logging in instead, or use a different email address.",
        },
        { status: 409 },
      );
    }

    // 4. Hash password
    // Use hashPassword(password)
    const hashedPassword = await hashPassword(password);

    // 5. Create user in database
    // Use prisma.user.create({ data: { email, password: hashedPassword, name } })
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });

    // 6. Create verification token and send email
    try {
      const verificationToken = await createVerificationToken(user.id);
      await sendVerificationEmail(email, verificationToken);
      console.log("✅ Verification email sent to:", email);
    } catch (emailError) {
      // Don't fail registration if email fails
      // Just log the error
      console.error("❌ Failed to send verification email:", emailError);
    }

    // 6. Create JWT token
    // Use createToken({ userId: user.id, email: user.email })
    const token = createToken({ userId: user.id, email: user.email });

    // 7. Create response with cookie
    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 },
    );

    // 8. Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
