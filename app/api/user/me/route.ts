import { NextResponse } from "next/server";
import { getAuthUser, unauthorizedResponse } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // 1. Get authenticated user
  const authUser = await getAuthUser();

  // 2. If not authenticated, return 401
  if (!authUser) {
    return unauthorizedResponse();
  }

  // 3. Get full user data from database
  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      // Don't select password!
    },
  });

  // 4. If user not found (shouldn't happen, but handle it)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // 5. Return user data
  return NextResponse.json({ user });
}
