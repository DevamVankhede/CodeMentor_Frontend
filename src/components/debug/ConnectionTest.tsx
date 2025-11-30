'use client';
import React, { useState, useEffect } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function ConnectionTest() {
  const [status, setStatus] = useState<'testing' | 'connected' | 'failed'>('testing');
  const [message, setMessage] = useState('Testing connection...');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Testing connection...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setStatus('connected');
        setMessage(`✅ Connected! API Status: ${data.status}`);
      } else {
        setStatus('failed');
        setMessage(`❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus('failed');
      setMessage(`❌ Connection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'connected' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {status === 'failed' && <XCircle className="w-5 h-5 text-red-500" />}
          {status === 'testing' && <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />}
          Backend Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-text-secondary mb-2">
              Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
            </p>
            <p className={`text-sm font-medium ${
              status === 'connected' ? 'text-green-500' : 
              status === 'failed' ? 'text-red-500' : 
              'text-blue-500'
            }`}>
              {message}
            </p>
          </div>
          <Button
            onClick={testConnection}
            loading={status === 'testing'}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Test Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}