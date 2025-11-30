'use client';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/layout/Navigation';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DebugPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  const makeAdmin = async () => {
    if (!user?.email) {
      alert('No user email found');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/make-admin/${user.email}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
                <p><strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL}</p>
                <p><strong>Auth Token:</strong> {localStorage.getItem('auth_token') ? 'Present' : 'Not found'}</p>
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