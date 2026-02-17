import "dotenv/config";
import {
  generateToken,
  createVerificationToken,
  validateVerificationToken,
} from "../lib/auth/tokens";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🎫 Testing token utilities...\n");

  // Test 1: Generate token
  console.log("1️⃣ Generate random token:");
  const token1 = generateToken();
  const token2 = generateToken();
  console.log("Token 1:", token1);
  console.log("Token 2:", token2);
  console.log("Are they different?", token1 !== token2);
  console.log("Token length:", token1.length);

  // Test 2: Create verification token
  console.log("\n2️⃣ Create verification token in database:");

  // First create a test user
  const testUser = await prisma.user.create({
    data: {
      email: "tokentest@example.com",
      password: "hashedpassword",
      name: "Token Test User",
    },
  });
  console.log("Test user created:", testUser.id);

  const verificationToken = await createVerificationToken(testUser.id);
  console.log("Verification token:", verificationToken);

  // Test 3: Validate token
  console.log("\n3️⃣ Validate token:");
  const userId = await validateVerificationToken(verificationToken);
  console.log("Valid token result:", userId);
  console.log("Matches user?", userId === testUser.id);

  // Test 4: Invalid token
  console.log("\n4️⃣ Validate invalid token:");
  const invalidResult = await validateVerificationToken("invalid-token-xyz");
  console.log("Invalid token result:", invalidResult); // Should be null

  // Test 5: Duplicate token (should replace)
  console.log("\n5️⃣ Create second token (should replace first):");
  const secondToken = await createVerificationToken(testUser.id);
  console.log("Second token:", secondToken);
  console.log("Different from first?", secondToken !== verificationToken);

  // First token should now be invalid
  const oldTokenResult = await validateVerificationToken(verificationToken);
  console.log("Old token still valid?", oldTokenResult); // Should be null

  // Clean up
  console.log("\n🗑️ Cleaning up...");
  await prisma.user.delete({ where: { id: testUser.id } });
  console.log("✅ Test user deleted");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
