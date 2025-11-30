import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom right, #1a1a1a, #581c87, #1a1a1a)'
        }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
                <h1 style={{ fontSize: '6rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
                    404
                </h1>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '600', color: '#e5e7eb', marginBottom: '1rem' }}>
                    Page Not Found
                </h2>
                <p style={{ color: '#9ca3af', marginBottom: '2rem', maxWidth: '28rem', margin: '0 auto 2rem' }}>
                    The page you are looking for does not exist or has been moved.
                </p>
                <Link
                    href="/"
                    style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#9333ea',
                        color: 'white',
                        fontWeight: '500',
                        borderRadius: '0.5rem',
                        textDecoration: 'none'
                    }}
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}
