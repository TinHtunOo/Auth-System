import "dotenv/config";
import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/auth/password";
import { createVerificationToken } from "../lib/auth/tokens";
import { sendVerificationEmail } from "../lib/email/mailer";

async function main() {
  console.log("📧 Testing Registration + Email Flow...\n");

  // 1. Create test user (simulating registration)
  console.log("1️⃣ Creating test user...");
  const hashedPassword = await hashPassword("testPassword123");

  const user = await prisma.user.create({
    data: {
      email: "emailtest@example.com",
      password: hashedPassword,
      name: "Email Test User",
      emailVerified: false,
    },
  });
  console.log("✅ User created:", {
    id: user.id,
    email: user.email,
    emailVerified: user.emailVerified,
  });

  // 2. Create verification token
  console.log("\n2️⃣ Creating verification token...");
  const token = await createVerificationToken(user.id);
  console.log("✅ Token created:", token);
  console.log("Token length:", token.length);

  // 3. Check token in database
  console.log("\n3️⃣ Checking token in database...");
  const dbToken = await prisma.verificationToken.findUnique({
    where: { token },
  });
  console.log("Token in DB:", {
    id: dbToken?.id,
    userId: dbToken?.userId,
    expiresAt: dbToken?.expiresAt,
    matchesUser: dbToken?.userId === user.id,
  });

  // 4. Send verification email
  console.log("\n4️⃣ Sending verification email...");
  await sendVerificationEmail(user.email, token);
  console.log("✅ Check the Preview URL above!");

  // 5. Verify the URL structure
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  console.log("\n5️⃣ Verification URL structure:");
  console.log(verificationUrl);

  // 6. Check email not verified yet
  console.log("\n6️⃣ Email verification status BEFORE clicking link:");
  const unverifiedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  console.log("emailVerified:", unverifiedUser?.emailVerified); // false

  // 7. Simulate clicking the verification link
  console.log("\n7️⃣ Simulating email verification...");
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  // Delete token after use
  await prisma.verificationToken.delete({
    where: { token },
  });

  // 8. Check email verified after
  console.log("8️⃣ Email verification status AFTER clicking link:");
  const verifiedUser = await prisma.user.findUnique({
    where: { id: user.id },
  });
  console.log("emailVerified:", verifiedUser?.emailVerified); // true

  // Cleanup
  console.log("\n🗑️ Cleaning up...");
  await prisma.user.delete({ where: { id: user.id } });
  console.log("✅ Test complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
