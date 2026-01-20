# Environment Setup Guide

## Quick Setup

Run the setup script to automatically generate a secure JWT secret and create the `.env` file:

```bash
node setup-env.js
```

## Manual Setup

If you prefer to set up manually, create a `.env` file in the root directory with the following content:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecohub

# JWT Configuration
# Generate a secure random string (minimum 32 characters)
# You can use: openssl rand -base64 32
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=7d

# Cookie Configuration
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
```

## Security Notes

1. **JWT_SECRET**: Must be at least 32 characters long. For production, use a strong random string.
   - Generate using: `openssl rand -base64 32`
   - Or use the provided `setup-env.js` script

2. **COOKIE_SECURE**: 
   - Set to `false` for development (HTTP)
   - Set to `true` for production (HTTPS only)

3. **COOKIE_SAME_SITE**:
   - `lax` - Good for most cases (default)
   - `strict` - More secure but may break some flows
   - `none` - Requires `secure: true`

4. **Never commit `.env` to version control!** It's already in `.gitignore`.

## Authentication System

The application now uses:
- **httpOnly cookies** for secure token storage (primary method)
- **localStorage** as fallback for backward compatibility
- **Authorization header** support for API clients

This ensures:
- ✅ Tokens persist across page reloads
- ✅ Tokens are protected from XSS attacks (httpOnly)
- ✅ Backward compatibility with existing code
