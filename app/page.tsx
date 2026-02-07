import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-900">AuthSystem</div>
            <div className="space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="mt-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Authentication System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A production-ready authentication system built with Next.js, Prisma,
            and PostgreSQL. Featuring JWT tokens, HTTP-only cookies, and bcrypt
            password hashing.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-semibold text-lg border-2 border-blue-600"
            >
              Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-xl font-bold mb-2">Secure</h3>
              <p className="text-gray-600">
                Bcrypt password hashing and HTTP-only cookies protect your users
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-xl font-bold mb-2">Fast</h3>
              <p className="text-gray-600">
                JWT-based authentication with efficient token verification
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Production Ready</h3>
              <p className="text-gray-600">
                Built with industry best practices and security standards
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center text-gray-600">
          <p>Built as a learning project • Full-stack authentication system</p>
        </footer>
      </div>
    </div>
  );
}
