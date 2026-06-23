// Simple script to clear cookies and restart development
const { exec } = require('child_process');

console.log('🧹 Clearing cookies and restarting development environment...\n');

// Clear cookies by making a request to the clear-cookies endpoint
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/auth/clear-cookies',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, (res) => {
  console.log('✅ Cookies cleared successfully');
  console.log('🚀 You can now restart your development servers');
  console.log('\nTo restart:');
  console.log('1. Stop your current servers (Ctrl+C)');
  console.log('2. Run: npm run dev');
});

req.on('error', (err) => {
  console.log('⚠️  Could not clear cookies (server might not be running)');
  console.log('💡 Try clearing your browser cookies manually:');
  console.log('   - Press F12 to open DevTools');
  console.log('   - Go to Application tab');
  console.log('   - Click on Cookies');
  console.log('   - Delete all cookies for localhost');
});

req.end();
