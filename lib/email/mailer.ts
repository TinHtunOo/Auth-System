import nodemailer from "nodemailer";

/**
 * Creates an Ethereal test account for development
 * Ethereal catches emails so they're not actually sent
 */
async function createTestTransporter() {
  // Create a test account on Ethereal
  const testAccount = await nodemailer.createTestAccount();

  // Create transporter using test account
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return { transporter, testAccount };
}

/**
 * Sends a verification email
 * @param to - Recipient email address
 * @param token - Verification token
 */
export async function sendVerificationEmail(
  to: string,
  token: string,
): Promise<void> {
  // Build verification URL
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  // Create test transporter (development)
  const { transporter, testAccount } = await createTestTransporter();

  // Send email
  const info = await transporter.sendMail({
    from: '"Auth System" <noreply@authsystem.com>',
    to,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify your email address</h2>
        <p>Thanks for signing up! Please verify your email by clicking the button below:</p>
        
        <a 
          href="${verificationUrl}"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          "
        >
          Verify Email
        </a>
        
        <p>Or copy this link:</p>
        <p style="color: #6b7280; word-break: break-all;">${verificationUrl}</p>
        
        <p style="color: #6b7280; font-size: 14px;">
          This link expires in 24 hours.
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  // In development, log the Ethereal URL to preview the email
  console.log("📧 Email sent!");
  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
}
