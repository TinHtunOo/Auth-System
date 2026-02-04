import { hashPassword, verifyPassword } from "../lib/auth/password";

async function main() {
  const plainPassword = "mySecretPassword123";

  console.log("🔐 Testing password hashing...\n");
  console.log("Plain password:", plainPassword);

  // Hash the password
  const hashed = await hashPassword(plainPassword);
  console.log("Hashed password:", hashed);
  console.log("Hash length:", hashed.length, "characters\n");

  // Verify correct password
  const isValid = await verifyPassword(plainPassword, hashed);
  console.log("✅ Correct password verification:", isValid);

  // Verify wrong password
  const isInvalid = await verifyPassword("wrongPassword", hashed);
  console.log("❌ Wrong password verification:", isInvalid);

  // Hash same password again - different hash!
  const hashed2 = await hashPassword(plainPassword);
  console.log("\n🔄 Same password, different hash:");
  console.log("Hash 1:", hashed);
  console.log("Hash 2:", hashed2);
  console.log("Are they different?", hashed !== hashed2);
  console.log(
    "But both verify correctly?",
    await verifyPassword(plainPassword, hashed2),
  );
}

main();
