'use client';
import { useState } from 'react';
import { RoyalButton } from '../ui/RoyalButton';
import RoyalCard from '../ui/RoyalCard';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setStatus('Testing...');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`);
      
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Connected! API Status: ${data.status}`);
      } else {
        setStatus(`❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(`❌ Connection Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RoyalCard>
      <div className="text-center">
        <h3 className="text-xl font-gaming font-bold text-neon-blue mb-4">
          🔌 API Connection Test
        </h3>
        <p className="text-white/70 mb-4">
          Backend URL: {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
        </p>
        <div className="mb-4">
          <span className="text-white">Status: </span>
          <span className={`font-semibold ${
            status.includes('✅') ? 'text-green-400' : 
            status.includes('❌') ? 'text-red-400' : 
            'text-yellow-400'
          }`}>
            {status}
          </span>
        </div>
        <RoyalButton onClick={testConnection}>
          {isLoading ? '🔄 Testing...' : '🧪 Test Connection'}
        </RoyalButton>
      </div>
    </RoyalCard>
  );
}