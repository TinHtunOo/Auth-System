import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generates a secure random token
 */
function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a password reset token
 * @param userId - ID of the user requesting reset
 * @returns The generated token string
 */
export async function createPasswordResetToken(
  userId: string,
): Promise<string> {
  // Generate random token
  const token = generateToken();

  // Set expiration to 1 hour (shorter than email verification!)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  // Delete any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  // Save token to database
  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Validates a password reset token
 * @param token - Token from reset link
 * @returns userId if valid, null if invalid/expired
 */
export async function validatePasswordResetToken(
  token: string,
): Promise<string | null> {
  try {
    // Find token in database
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    // Token doesn't exist
    if (!resetToken) {
      return null;
    }

    // Check if expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.passwordResetToken.delete({
        where: { token },
      });
      return null;
    }

    // Token is valid
    return resetToken.userId;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}
