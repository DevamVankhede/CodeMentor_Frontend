"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(to bottom right, #1a1a1a, #7f1d1d, #1a1a1a)'
                }}>
                    <div style={{ textAlign: 'center', padding: '1rem' }}>
                        <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                            Error
                        </h1>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e5e7eb', marginBottom: '1rem' }}>
                            Application Error
                        </h2>
                        <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>
                            {error.message || "A critical error occurred"}
                        </p>
                        <button
                            onClick={reset}
                            style={{
                                display: 'inline-block',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#dc2626',
                                color: 'white',
                                fontWeight: '500',
                                borderRadius: '0.5rem',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
