import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth/jwt";
import { validateLogin } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { email, password } = body;

    // 2. Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // 3. Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
          suggestion:
            'Double-check your credentials or use "Forgot password" to reset.',
        },
        { status: 401 },
      );
    }

    // 4. Compare password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
          suggestion:
            'If you forgot your password, click "Forgot password" below.',
        },
        { status: 401 },
      );
    }

    // 5. Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.email,
    });

    // 6. Create response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 200 },
    );

    // 7. Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
