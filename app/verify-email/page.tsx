"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { PageTransition } from "@/components/ui/page-transition";
import { SuccessIcon } from "@/components/ui/success-icon";

// Verification states
type VerificationStatus = "loading" | "success" | "error" | "already-verified";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Immediately Invoked Function Expression
    (async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("No verification token found");
        return;
      }

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.message === "Email already verified") {
            setStatus("already-verified");
          } else {
            setStatus("success");
            setTimeout(() => router.push("/dashboard"), 3000);
          }
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.error || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred");
      }
    })();
  }, [searchParams, router]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow text-center">
          {/* Loading State */}
          {status === "loading" && (
            <div>
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Verifying your email...
              </h2>
              <p className="text-gray-600">Please wait a moment</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div>
              <SuccessIcon className="mx-auto w-20 h-20 mb-4" />
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                Email Verified!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard in 3 seconds...
              </p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard Now
              </Link>
            </div>
          )}

          {/* Already Verified State */}
          {status === "already-verified" && (
            <div>
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                Already Verified!
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <Link
                href="/dashboard"
                className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div>
              <div className="text-5xl mb-4">❌</div>
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Verification Failed
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>
                <p className="text-sm text-gray-500">
                  You can request a new verification email from your dashboard
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
