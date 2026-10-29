const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting NextStep Development Environment...\n');

// Start the backend server
const backend = spawn('node', ['app.js'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Start the React development server
const frontend = spawn('npm', ['start'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, BROWSER: 'none' }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend error:', err);
});
