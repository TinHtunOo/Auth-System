import { prisma } from "../lib/prisma";

async function main() {
  console.log("🔍 Testing database connection...\n");

  // 1. Create a test user
  console.log("Creating test user...");
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "not-hashed-yet", // We'll hash passwords later!
      name: "Test User",
    },
  });
  console.log("✅ User created:", user);

  // 2. Find all users
  console.log("\n📋 All users in database:");
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);

  // 3. Find user by email
  console.log("\n🔎 Finding user by email...");
  const foundUser = await prisma.user.findUnique({
    where: { email: "test@example.com" },
  });
  console.log("Found:", foundUser);

  // 4. Clean up - delete test user
  console.log("\n🗑️  Cleaning up...");
  await prisma.user.delete({
    where: { email: "test@example.com" },
  });
  console.log("✅ Test user deleted");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
