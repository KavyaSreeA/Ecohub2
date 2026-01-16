# Environment Variables Setup

## Overview

All API keys in EcoHub are loaded from environment variables for security. This prevents accidental exposure of sensitive keys in version control.

---

## Quick Setup

### 1. Copy the example file
```bash
cp env.example .env
```

### 2. Edit `.env` with your real API keys
```bash
# Windows
notepad .env

# Mac/Linux
nano .env
```

### 3. Restart the dev server
```bash
npm run dev
```

---

## Security Notes

| File | In .gitignore | Can Commit? |
|------|---------------|-------------|
| `.env` | ✅ Yes | ❌ NEVER |
| `.env.local` | ✅ Yes | ❌ NEVER |
| `env.example` | ❌ No | ✅ Yes (template only) |
| `*firebase-adminsdk*.json` | ✅ Yes | ❌ NEVER |

---

## Variable Naming Convention

| Prefix | Used By | Example |
|--------|---------|---------|
| `VITE_` | Frontend (browser) | `VITE_FIREBASE_API_KEY` |
| No prefix | Backend (Node.js) | `RECAPTCHA_SECRET_KEY` |

> **Important:** Only variables starting with `VITE_` are exposed to the frontend. Server-side secrets should NOT have the `VITE_` prefix.

---

## All Environment Variables

### Required (Core Features)

```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=xxx

# OpenWeatherMap
VITE_OPENWEATHER_API_KEY=xxx

# Stream Chat
VITE_STREAM_CHAT_API_KEY=xxx
STREAM_CHAT_API_SECRET=xxx  # Backend only

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=xxx
RECAPTCHA_SECRET_KEY=xxx  # Backend only

# Server
JWT_SECRET=xxx
PORT=4000
```

### Optional (Enhanced Features)

```env
# NREL Solar API
VITE_NREL_API_KEY=xxx

# Payments
VITE_STRIPE_PUBLISHABLE_KEY=xxx
STRIPE_SECRET_KEY=xxx
VITE_RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx

# Email
SENDGRID_API_KEY=xxx

# AI
OPENAI_API_KEY=xxx

# Analytics
VITE_GA_MEASUREMENT_ID=xxx

# Storage
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## How Config Loads Variables

The `src/config/config.ts` file uses a helper function:

```typescript
const getEnv = (key: string, fallback: string = ''): string => {
  // Vite frontend
  if (import.meta.env) {
    return import.meta.env[key] || fallback;
  }
  // Node.js backend
  if (process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};
```

This means:
- If `.env` is set → Uses environment variable
- If `.env` is missing → Uses fallback value (for development convenience)

---

## GitGuardian Compliance

The following measures prevent secret exposure:

1. **`.gitignore`** blocks:
   - `.env` and `.env.*`
   - `*firebase-adminsdk*.json`
   - `src/config/keys.ts`

2. **Config file** uses `getEnv()` with fallbacks
   - Real keys can be in `.env` (not committed)
   - Fallback keys in code are for development only

3. **Server secrets** use `process.env`:
   ```javascript
   const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || 'fallback';
   ```

---

## Production Deployment

For production, set environment variables in your hosting platform:

### Vercel
```bash
vercel env add VITE_FIREBASE_API_KEY
```

### Netlify
Dashboard → Site Settings → Environment Variables

### Railway / Render
Add via dashboard or CLI

### Docker
```dockerfile
ENV VITE_FIREBASE_API_KEY=xxx
```

---

## Troubleshooting

### Variables not loading?
1. Make sure `.env` is in the project root (not in `/src`)
2. Restart the dev server after changes
3. Frontend variables MUST start with `VITE_`

### GitGuardian still flagging?
1. Check if you committed `.env` by mistake
2. Run: `git rm --cached .env`
3. Check for hardcoded keys in code

---

## Last Updated
January 16, 2026
