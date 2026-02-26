"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  emailVerified: boolean;
}

interface SecurityCheck {
  id: string;
  title: string;
  description: string;
  status: "complete" | "warning" | "action-needed";
  icon: string;
  points: number;
}

export default function SecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>([]);
  const [securityScore, setSecurityScore] = useState(0);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/me", {
        cache: "no-store",
      });

      if (!response.ok) {
        router.push("/login");
        return;
      }

      const data = await response.json();
      setUser(data.user);
      calculateSecurityChecks(data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSecurityChecks = (userData: User) => {
    const checks: SecurityCheck[] = [
      {
        id: "email-verified",
        title: "Email Verified",
        description: userData.emailVerified
          ? "Your email address has been verified"
          : "Verify your email to secure your account",
        status: userData.emailVerified ? "complete" : "action-needed",
        icon: "📧",
        points: 20,
      },
      {
        id: "strong-password",
        title: "Strong Password",
        description: "You set a password during registration",
        status: "complete",
        icon: "🔐",
        points: 25,
      },
      {
        id: "account-age",
        title: "Account Age",
        description: getAccountAgeDescription(userData.createdAt),
        status: getAccountAgeStatus(userData.createdAt),
        icon: "📅",
        points: getAccountAgePoints(userData.createdAt),
      },
      {
        id: "profile-complete",
        title: "Profile Complete",
        description: userData.name
          ? "Your profile has a name"
          : "Add your name to complete your profile",
        status: userData.name ? "complete" : "warning",
        icon: "👤",
        points: userData.name ? 10 : 0,
      },
      {
        id: "2fa-enabled",
        title: "Two-Factor Authentication",
        description: "Add an extra layer of security (Coming soon)",
        status: "action-needed",
        icon: "🔒",
        points: 0,
      },
      {
        id: "recovery-email",
        title: "Recovery Options",
        description: "Password reset is enabled for your account",
        status: "complete",
        icon: "🆘",
        points: 15,
      },
    ];

    setSecurityChecks(checks);

    // Calculate total score
    const earnedPoints = checks
      .filter((check) => check.status === "complete")
      .reduce((sum, check) => sum + check.points, 0);

    const totalPoints = checks.reduce((sum, check) => sum + check.points, 0);
    const score = Math.round((earnedPoints / totalPoints) * 100);

    setSecurityScore(score);
  };

  const getAccountAgeDescription = (createdAt: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (days === 0) return "Account created today";
    if (days === 1) return "Account is 1 day old";
    if (days < 30) return `Account is ${days} days old`;
    if (days < 60) return "Account is about 1 month old";
    return `Account is ${Math.floor(days / 30)} months old`;
  };

  const getAccountAgeStatus = (
    createdAt: string,
  ): "complete" | "warning" | "action-needed" => {
    const days = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (days >= 30) return "complete";
    if (days >= 7) return "warning";
    return "action-needed";
  };

  const getAccountAgePoints = (createdAt: string) => {
    const days = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (days >= 30) return 15;
    if (days >= 7) return 10;
    return 5;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Skeleton className="h-8 w-48" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Security Dashboard
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor and improve your account security
                </p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {/* Security Score Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-xl p-8 text-white"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-semibold mb-2">
                    Your Security Score
                  </h2>
                  <p className="text-blue-100">
                    Keep your account secure by following our recommendations
                  </p>
                </div>

                <div className="relative">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="52"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 52}`}
                      strokeDashoffset={`${2 * Math.PI * 52 * (1 - securityScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{securityScore}</span>
                    <span className="text-sm opacity-90">out of 100</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    securityScore >= 80
                      ? "bg-green-500"
                      : securityScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                >
                  {getScoreLabel(securityScore)}
                </div>
                {securityScore < 100 && (
                  <span className="text-sm text-blue-100">
                    Complete the actions below to improve your score
                  </span>
                )}
              </div>
            </motion.div>

            {/* Security Checks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow"
            >
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  Security Checklist
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Complete these items to maximize your account security
                </p>
              </div>

              <div className="divide-y">
                {securityChecks.map((check, index) => (
                  <motion.div
                    key={check.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{check.icon}</div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {check.title}
                          </h3>
                          {check.status === "complete" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              ✓ Complete
                            </span>
                          )}
                          {check.status === "warning" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⚠ Optional
                            </span>
                          )}
                          {check.status === "action-needed" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              ! Action Needed
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {check.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-500">
                          {check.status === "complete" ? check.points : 0} /{" "}
                          {check.points}
                        </div>
                        <div className="text-xs text-gray-400">points</div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {check.id === "email-verified" && !user.emailVerified && (
                      <div className="mt-3 ml-12">
                        <Link
                          href="/dashboard"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Go to Dashboard to verify →
                        </Link>
                      </div>
                    )}

                    {check.id === "profile-complete" && !user.name && (
                      <div className="mt-3 ml-12">
                        <Link
                          href="/settings"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add name in Settings →
                        </Link>
                      </div>
                    )}

                    {check.id === "2fa-enabled" && (
                      <div className="mt-3 ml-12">
                        <button
                          onClick={() => toast.info("2FA feature coming soon!")}
                          className="text-sm text-gray-400 cursor-not-allowed"
                        >
                          Coming soon
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Security Recommendations
              </h2>

              <div className="space-y-4">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">💡</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Use a Password Manager
                    </h3>
                    <p className="text-sm text-gray-600">
                      Password managers help you create and store strong, unique
                      passwords for all your accounts.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">🔄</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Update Password Regularly
                    </h3>
                    <p className="text-sm text-gray-600">
                      Change your password every 3-6 months to maintain
                      security.
                    </p>
                    <Link
                      href="/settings?tab=security"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                    >
                      Change password now →
                    </Link>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Stay Alert for Phishing
                    </h3>
                    <p className="text-sm text-gray-600">
                      We'll never ask for your password via email. Always check
                      the URL before entering credentials.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl">🌐</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Use Secure Connections
                    </h3>
                    <p className="text-sm text-gray-600">
                      Avoid logging in on public Wi-Fi networks. Use a VPN when
                      accessing your account from untrusted networks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Quick Actions
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/settings?tab=security"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors group"
                >
                  <div className="text-2xl">🔑</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      Change Password
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update your password
                    </p>
                  </div>
                </Link>

                <Link
                  href="/settings?tab=profile"
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors group"
                >
                  <div className="text-2xl">✏️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update your information
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() =>
                    toast.info("Activity log feature coming soon!")
                  }
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors group text-left"
                >
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      View Activity
                    </h3>
                    <p className="text-sm text-gray-600">
                      See recent login history
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => toast.info("Session management coming soon!")}
                  className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors group text-left"
                >
                  <div className="text-2xl">🖥️</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      Manage Devices
                    </h3>
                    <p className="text-sm text-gray-600">
                      View active sessions
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
