import "dotenv/config";
import {
  createPasswordResetToken,
  validatePasswordResetToken,
} from "../lib/auth/password-reset-tokens";
import { sendPasswordResetEmail } from "../lib/email/mailer";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🔑 Testing password reset flow...\n");

  // Create test user
  const user = await prisma.user.create({
    data: {
      email: "resettest@example.com",
      password: "oldHashedPassword",
      name: "Reset Test",
    },
  });
  console.log("✅ Test user created:", user.email);

  // Create reset token
  const token = await createPasswordResetToken(user.id);
  console.log("✅ Reset token created:", token);
  console.log("Token length:", token.length);

  // Send email
  await sendPasswordResetEmail(user.email, token);
  console.log("✅ Check the preview URL above!");

  // Validate token
  const validatedUserId = await validatePasswordResetToken(token);
  console.log("✅ Token validates to user:", validatedUserId === user.id);

  // Clean up
  await prisma.user.delete({ where: { id: user.id } });
  console.log("\n✅ Test complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
