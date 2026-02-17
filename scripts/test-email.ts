import "dotenv/config";
import { sendVerificationEmail } from "../lib/email/mailer";

async function main() {
  console.log("📧 Testing email sending...\n");

  await sendVerificationEmail("test@example.com", "test-token-abc123");

  console.log("\n✅ Check the preview URL above!");
  console.log("Copy and paste it in your browser to see the email");
}

main().catch(console.error);
