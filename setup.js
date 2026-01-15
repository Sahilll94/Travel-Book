#!/usr/bin/env node

/**
 * Setup script for Travel Book contributors
 * This script helps set up the development environment with mock data
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = colors.white) {
  console.log(`${color}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function title(message) {
  console.log();
  log(`${colors.bright}${colors.cyan}🎭 ${message}${colors.reset}`);
  log('─'.repeat(50), colors.dim);
}

function setupEnvironment() {
  title('Setting up Travel Book development environment');
  
  const envPath = join(__dirname, '.env');
  const envExamplePath = join(__dirname, '.env.example');
  
  if (!existsSync(envPath)) {
    if (existsSync(envExamplePath)) {
      try {
        const envExampleContent = readFileSync(envExamplePath, 'utf8');
        writeFileSync(envPath, envExampleContent);
        success('Created .env file from .env.example');
      } catch (err) {
        error('Failed to create .env file');
        console.error(err);
        return false;
      }
    } else {
      warning('.env.example not found, creating basic .env file');
      const basicEnv = `# Travel Book Environment Variables
VITE_BACKEND_URL=http://localhost:3000/
`;
      try {
        writeFileSync(envPath, basicEnv);
        success('Created basic .env file');
      } catch (err) {
        error('Failed to create .env file');
        console.error(err);
        return false;
      }
    }
  } else {
    info('.env file already exists');
  }
  
  return true;
}

function showNextSteps() {
  console.log();
  title('🚀 You\'re all set!');
  
  log('Next steps:', colors.bright);
  console.log();
  log('1. Start the development server:', colors.white);
  log('   npm run dev', colors.cyan);
  console.log();
  log('2. Open your browser to:', colors.white);
  log('   http://localhost:5173', colors.cyan);
  console.log();
  log('3. Login with any credentials:', colors.white);
  log('   Email: test@example.com', colors.cyan);
  log('   Password: password123', colors.cyan);
  console.log();
  
  info('All features work with realistic mock data!');
  info('Check out CONTRIBUTING.md for detailed development guidelines.');
  
  console.log();
  log('Happy coding! 🎉', colors.magenta);
  console.log();
}

function main() {
  console.clear();
  
  log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║            🧳 Travel Book - Contributor Setup                ║
║                                                              ║
║            Welcome to the Travel Book project!              ║
║         This script will set up mock data for testing       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`, colors.cyan);

  if (setupEnvironment()) {
    showNextSteps();
  } else {
    console.log();
    error('Setup failed. Please check the errors above and try again.');
    process.exit(1);
  }
}

main();
