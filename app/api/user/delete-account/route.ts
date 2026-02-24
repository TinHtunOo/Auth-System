import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: authUser.userId },
    });

    // Create response
    const response = NextResponse.json(
      { message: "Account deleted successfully" },
      { status: 200 },
    );

    // Clear auth cookie
    response.cookies.delete("token");

    return response;
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
