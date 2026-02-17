import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Generates a secure random token
 * @returns Random hex string (64 characters)
 */
export function generateToken(): string {
  // crypto.randomBytes(32) generates 32 random bytes
  // .toString('hex') converts to hex string (64 chars)
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates a verification token in the database
 * @param userId - ID of the user to verify
 * @returns The generated token string
 */
export async function createVerificationToken(userId: string): Promise<string> {
  // 1. Generate random token
  const token = generateToken();

  // 2. Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // 3. Delete any existing tokens for this user
  //    (prevent multiple valid tokens)
  await prisma.verificationToken.deleteMany({
    where: { userId },
  });

  // 4. Save token to database
  await prisma.verificationToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  // 5. Return the token (to include in email)
  return token;
}

/**
 * Validates a verification token
 * @param token - Token from email link
 * @returns userId if valid, null if invalid/expired
 */
export async function validateVerificationToken(
  token: string,
): Promise<string | null> {
  try {
    // 1. Find token in database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    // 2. If token doesn't exist
    if (!verificationToken) {
      return null;
    }

    // 3. Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return null;
    }

    // 4. Token is valid! Return userId
    return verificationToken.userId;
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}
