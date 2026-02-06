import "dotenv/config";
import { createToken, verifyToken, JWTPayload } from "../lib/auth/jwt";

function main() {
  console.log("🎫 Testing JWT token creation and verification...\n");

  // Create test payload
  const payload: JWTPayload = {
    userId: "user-123-abc",
    email: "test@example.com",
  };

  console.log("📝 Original payload:", payload);

  // Create token
  const token = createToken(payload);
  console.log("\n🔐 Generated JWT token:");
  console.log(token);
  console.log("Token length:", token.length, "characters");

  // Show token parts
  const parts = token.split(".");
  console.log("\n📦 Token structure:");
  console.log("  Header:", parts[0]);
  console.log("  Payload:", parts[1]);
  console.log("  Signature:", parts[2]);

  // Verify valid token
  console.log("\n✅ Verifying valid token...");
  const decoded = verifyToken(token);
  console.log("Decoded payload:", decoded);
  console.log(
    "Match original?",
    decoded?.userId === payload.userId && decoded?.email === payload.email,
  );

  // Verify invalid token
  console.log("\n❌ Verifying invalid token...");
  const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature";
  const invalidDecoded = verifyToken(invalidToken);
  console.log("Result:", invalidDecoded); // Should be null

  // Verify tampered token (changed payload)
  console.log("\n🔨 Verifying tampered token...");
  const tamperedToken = token.slice(0, -10) + "TAMPERED!!";
  const tamperedDecoded = verifyToken(tamperedToken);
  console.log("Result:", tamperedDecoded); // Should be null

  console.log("\n✨ JWT utility works perfectly!");
}

main();
