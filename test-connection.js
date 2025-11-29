// Test script to verify backend connectivity
// Run this in your browser console on the frontend page

async function testBackendConnection() {
  const apiUrl = 'https://localhost:7000';
  
  console.log('Testing backend connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch(`${apiUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test auth endpoint
    const authResponse = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: 'demo@codementor.ai', 
        password: 'demo123' 
      })
    });
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth test successful:', { ...authData, token: '[HIDDEN]' });
    } else {
      console.error('❌ Auth test failed:', authResponse.status, authResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('💡 Try visiting https://localhost:7000/health directly to accept the SSL certificate');
  }
}

// Run the test
testBackendConnection();