const { exec, spawn } = require('child_process');
const http = require('http');

console.log('🔄 Restarting NextStep Development Environment...\n');

// Function to clear cookies via API
function clearCookies() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/clear-cookies',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      console.log('✅ Cookies cleared successfully');
      resolve();
    });

    req.on('error', (err) => {
      console.log('⚠️  Could not clear cookies (server might not be running)');
      resolve();
    });

    req.end();
  });
}

// Function to kill existing processes
function killProcesses() {
  return new Promise((resolve) => {
    exec('taskkill /f /im node.exe', (error) => {
      if (error) {
        console.log('No existing Node processes to kill');
      } else {
        console.log('🛑 Killed existing Node processes');
      }
      resolve();
    });
  });
}

// Main restart function
async function restart() {
  try {
    // Kill existing processes
    await killProcesses();
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cookies
    await clearCookies();
    
    console.log('🚀 Starting fresh development environment...');
    console.log('📝 Instructions:');
    console.log('1. Backend will run on http://localhost:5000');
    console.log('2. Frontend will run on http://localhost:3000 or 3001');
    console.log('3. Open your browser to the frontend URL');
    console.log('4. If you see CORS errors, clear your browser cookies manually');
    console.log('\n💡 To clear browser cookies manually:');
    console.log('   - Press F12 → Application tab → Cookies → Delete all');
    console.log('   - Or use incognito/private mode\n');
    
  } catch (error) {
    console.error('Error during restart:', error);
  }
}

restart();
