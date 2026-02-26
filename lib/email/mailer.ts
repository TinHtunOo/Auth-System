import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * Sends a verification email
 * @param to - Recipient email address
 * @param token - Verification token
 */
export async function sendVerificationEmail(
  to: string,
  token: string,
): Promise<void> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

  try {
    if (isDevelopment) {
      // Development: Just log to console
      console.log("📧 [DEV] Verification Email");
      console.log("To:", to);
      console.log("Verification URL:", verificationUrl);
      console.log("---");
      return;
    }

    // Production: Send via Resend
    await resend.emails.send({
      from: "AuthSystem <onboarding@resend.dev>", // Use your verified domain
      to,
      subject: "Verify your email address",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email address</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">AuthSystem</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Verify your email address</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                Thanks for signing up! Please verify your email by clicking the button below:
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 20px 40px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #3b82f6;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Or copy this link:</p>
              <p style="color: #9ca3af; font-size: 12px; word-break: break-all; background-color: #f9fafb; padding: 12px; border-radius: 4px; margin: 0;">
                ${verificationUrl}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
                This link expires in 24 hours.<br>
                If you didn't create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Brand Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2024 AuthSystem. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log("✅ Verification email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw error;
  }
}

/**
 * Sends a password reset email
 * @param to - Recipient email address
 * @param token - Password reset token
 */
export async function sendPasswordResetEmail(
  to: string,
  token: string,
): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    if (isDevelopment) {
      // Development: Just log to console
      console.log("📧 [DEV] Password Reset Email");
      console.log("To:", to);
      console.log("Reset URL:", resetUrl);
      console.log("---");
      return;
    }

    // Production: Send via Resend
    await resend.emails.send({
      from: "AuthSystem <onboarding@resend.dev>", // Use your verified domain
      to,
      subject: "Reset your password",
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">AuthSystem</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 20px 40px;">
              <h2 style="color: #111827; margin: 0 0 20px 0; font-size: 24px;">Reset your password</h2>
              <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
                You requested to reset your password. Click the button below to create a new password:
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding: 0 40px 20px 40px;" align="center">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius: 6px; background-color: #ef4444;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 16px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Or copy this link:</p>
              <p style="color: #9ca3af; font-size: 12px; word-break: break-all; background-color: #f9fafb; padding: 12px; border-radius: 4px; margin: 0;">
                ${resetUrl}
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px 40px 40px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 14px; line-height: 1.5; margin: 0;">
                This link expires in 1 hour.<br>
                If you didn't request a password reset, you can safely ignore this email.<br>
                Your password will not be changed.
              </p>
            </td>
          </tr>
          
          <!-- Brand Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 20px; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © 2024 AuthSystem. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log("✅ Password reset email sent to:", to);
  } catch (error) {
    console.error("❌ Failed to send password reset email:", error);
    throw error;
  }
}
