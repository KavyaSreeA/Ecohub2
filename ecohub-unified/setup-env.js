import fs from 'fs';
import crypto from 'crypto';

// Generate a secure random JWT secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('base64');

const envContent = `# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecohub

# JWT Configuration
# This is a secure randomly generated JWT secret - DO NOT share or commit to version control
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
`;

// Write .env file
fs.writeFileSync('.env', envContent);

console.log('✅ .env file created successfully!');
console.log('🔐 Secure JWT secret generated and saved.');
console.log('⚠️  IMPORTANT: Never commit the .env file to version control!');
