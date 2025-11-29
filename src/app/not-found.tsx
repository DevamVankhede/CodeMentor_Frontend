import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
            <div className="text-center px-4">
                <h1 className="text-9xl font-bold text-white mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-200 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
