import "dotenv/config";
import { validateRegistration, validateLogin } from "../lib/auth/validation";

function main() {
  console.log("✅ Testing Input Validation...\n");

  // Test valid registration
  console.log("1️⃣ Valid registration:");
  const valid = validateRegistration({
    email: "user@example.com",
    password: "securePassword123",
    name: "John Doe",
  });
  console.log(valid);

  // Test invalid email
  console.log("\n2️⃣ Invalid email:");
  const invalidEmail = validateRegistration({
    email: "not-an-email",
    password: "securePassword123",
    name: "John Doe",
  });
  console.log(invalidEmail);

  // Test weak password
  console.log("\n3️⃣ Weak password:");
  const weakPassword = validateRegistration({
    email: "user@example.com",
    password: "123",
    name: "John Doe",
  });
  console.log(weakPassword);

  // Test multiple errors
  console.log("\n4️⃣ Multiple errors:");
  const multipleErrors = validateRegistration({
    email: "bad-email",
    password: "short",
    name: "",
  });
  console.log(multipleErrors);

  // Test valid login
  console.log("\n5️⃣ Valid login:");
  const validLogin = validateLogin({
    email: "user@example.com",
    password: "anyPassword",
  });
  console.log(validLogin);

  // Test invalid login
  console.log("\n6️⃣ Invalid login:");
  const invalidLogin = validateLogin({
    email: "bad-email",
    password: "",
  });
  console.log(invalidLogin);

  // Test empty name
  console.log("\n7️⃣ Empty name:");
  const emptyName = validateRegistration({
    email: "user@example.com",
    password: "securePassword123",
    name: "",
  });
  console.log(emptyName);
  // Should show: errors: [ 'Name must be between 1 and 100 characters' ]

  // Test spaces-only name
  console.log("\n8️⃣ Spaces-only name:");
  const spacesName = validateRegistration({
    email: "user@example.com",
    password: "securePassword123",
    name: "   ",
  });
  console.log(spacesName);
  // Should show: errors: [ 'Name must be between 1 and 100 characters' ]

  // Test name too long
  console.log("\n9️⃣ Name too long:");
  const longName = validateRegistration({
    email: "user@example.com",
    password: "securePassword123",
    name: "A".repeat(101),
  });
  console.log(longName);
  // Should show: errors: [ 'Name must be between 1 and 100 characters' ]
}

main();
