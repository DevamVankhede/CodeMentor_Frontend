'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Make this page dynamic to prevent static generation
export const dynamic = 'force-dynamic';

export default function DebugPage() {
  const [mounted, setMounted] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [geminiStatus, setGeminiStatus] = useState<string>('Checking...');
  const [isCheckingBackend, setIsCheckingBackend] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setAuthToken(localStorage.getItem('auth_token'));
      checkBackendConnection();
      checkGeminiConfig();
    }
  }, []);

  const checkBackendConnection = async () => {
    setIsCheckingBackend(true);
    try {
      const response = await fetch('/api/backend/test');
      const data = await response.json();
      setBackendStatus({
        success: data.success,
        message: data.message,
        details: data
      });
    } catch (error: any) {
      setBackendStatus({
        success: false,
        message: 'Failed to test backend connection',
        details: { error: error.message }
      });
    } finally {
      setIsCheckingBackend(false);
    }
  };

  const checkGeminiConfig = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      setGeminiStatus('❌ Not configured - Set NEXT_PUBLIC_GEMINI_API_KEY in environment variables');
    } else if (apiKey.length < 20) {
      setGeminiStatus('⚠️ Invalid key format');
    } else {
      setGeminiStatus(`✅ Configured (Key: ${apiKey.substring(0, 10)}...)`);
    }
  };
  const { user, isAuthenticated, isLoading } = useAuth();

  const makeAdmin = async () => {
    if (!user?.email) {
      alert('No user email found');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      alert('No auth token found');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/make-admin/${user.email}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        window.location.reload(); // Refresh to update user data
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error making admin:', error);
      alert('Failed to make admin');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-text-primary mb-8">Debug Information</h1>
        
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Authentication Status</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Is Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
                <p><strong>User Email:</strong> {user?.email || 'Not available'}</p>
                <p><strong>User Name:</strong> {user?.name || 'Not available'}</p>
                <p><strong>Is Admin:</strong> {user?.isAdmin ? 'Yes' : 'No'}</p>
                <p><strong>User Level:</strong> {user?.level || 'Not available'}</p>
                <p><strong>User XP:</strong> {user?.xp || 'Not available'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Full User Object</h2>
              <pre className="bg-surface-secondary p-4 rounded text-xs overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Admin Actions</h2>
              <div className="space-y-4">
                <p className="text-text-secondary">
                  If you need admin access, use one of these options:
                </p>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={makeAdmin}
                    disabled={!user?.email}
                  >
                    Make Current User Admin
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-admin`, {
                          method: 'POST',
                        });
                        
                        if (response.ok) {
                          const result = await response.json();
                          alert(`${result.message}\n\nLogin with:\nEmail: ${result.email}\nPassword: ${result.password}`);
                        } else {
                          const error = await response.json();
                          alert(`Error: ${error.message}`);
                        }
                      } catch (error) {
                        console.error('Error creating admin:', error);
                        alert('Failed to create admin user');
                      }
                    }}
                  >
                    Create Admin User
                  </Button>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    <strong>Note:</strong> This is a debug feature. In production, admin access should be managed securely.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">API Information</h2>
              <div className="space-y-2 text-sm">
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}</p>
                <p><strong>Auth Token:</strong> {mounted && authToken ? 'Present' : mounted ? 'Not found' : 'Loading...'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Backend Connection Status</h2>
              {isCheckingBackend ? (
                <p className="text-text-secondary">Checking backend connection...</p>
              ) : backendStatus ? (
                <div className="space-y-2 text-sm">
                  <p className={backendStatus.success ? 'text-green-400' : 'text-red-400'}>
                    <strong>Status:</strong> {backendStatus.success ? '✅ Connected' : '❌ Not Connected'}
                  </p>
                  <p className="text-text-secondary">{backendStatus.message}</p>
                  {backendStatus.details?.endpoint && (
                    <p className="text-text-secondary"><strong>Working Endpoint:</strong> {backendStatus.details.endpoint}</p>
                  )}
                  {!backendStatus.success && (
                    <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-xs font-semibold mb-2">Troubleshooting Steps:</p>
                      <ul className="text-xs text-text-secondary space-y-1 list-disc list-inside">
                        {backendStatus.details?.instructions?.map((step: string, idx: number) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button 
                    onClick={checkBackendConnection}
                    variant="outline"
                    className="mt-4"
                  >
                    Test Again
                  </Button>
                </div>
              ) : (
                <p className="text-text-secondary">Click "Test Again" to check backend connection</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Gemini AI Configuration</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Status:</strong> {geminiStatus}</p>
                <p className="text-text-secondary">
                  {geminiStatus.includes('❌') && (
                    <span className="block mt-2">
                      To fix: Add <code className="bg-surface-secondary px-2 py-1 rounded">NEXT_PUBLIC_GEMINI_API_KEY</code> to your Render environment variables.
                    </span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">Test Links</h2>
              <div className="space-y-2">
                <div>
                  <a href="/admin" className="text-primary-500 hover:underline">
                    Go to Admin Page
                  </a>
                </div>
                <div>
                  <a href="/explore" className="text-primary-500 hover:underline">
                    Go to Explore Page
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}