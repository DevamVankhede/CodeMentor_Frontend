"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
                    <div className="text-center px-4">
                        <h1 className="text-6xl font-bold text-white mb-4">Error</h1>
                        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                            Application Error
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            {error.message || "A critical error occurred"}
                        </p>
                        <button
                            onClick={reset}
                            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
