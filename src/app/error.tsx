"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
            <div className="text-center px-4">
                <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
                <h2 className="text-2xl font-semibold text-gray-200 mb-4">
                    Something went wrong
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {error.message || "An unexpected error occurred"}
                </p>
                <button
                    onClick={reset}
                    className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
