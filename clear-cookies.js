// Simple script to clear cookies and restart development
require('dotenv').config();
const http = require('http');

console.log('🧹 Clearing cookies and restarting development environment...\n');

const port = process.env.PORT || 5000;
const options = {
  hostname: 'localhost',
  port: port,
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
  console.log('⚠️  Could not clear cookies via API (server might not be running on port ' + port + ')');
  console.log('💡 Try clearing your browser cookies manually:');
  console.log('   - Press F12 to open DevTools');
  console.log('   - Go to Application tab');
  console.log('   - Click on Cookies');
  console.log('   - Delete all cookies for localhost');
});

req.end();
