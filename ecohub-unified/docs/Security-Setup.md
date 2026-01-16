# EcoHub Security Features

## Overview
This document covers the security features implemented in the EcoHub platform.

---

## ✅ reCAPTCHA v3

### Status: Active

### Configuration
```typescript
// src/config/config.ts
security: {
  recaptcha: {
    siteKey: '6LcZ-UcsAAAAABULUof5I363Tidim7r5tI3LsWzP',
    secretKey: '6LcZ-UcsAAAAAE0VL_FdG31ExAq2n0IT2wfk-L9l',
    enabled: true,
  },
}
```

### Protected Forms
| Form | Action Name | File |
|------|-------------|------|
| Login | `login` | `src/pages/LoginPage.tsx` |
| Google Sign-in | `google_signin` | `src/pages/LoginPage.tsx` |
| Forgot Password | `forgot_password` | `src/pages/LoginPage.tsx` |
| Register | `register` | `src/pages/RegisterPage.tsx` |
| Google Sign-up | `google_signup` | `src/pages/RegisterPage.tsx` |

### Implementation Files
| File | Purpose |
|------|---------|
| `src/components/ReCaptchaProvider.tsx` | React context provider |
| `src/hooks/useReCaptcha.ts` | Custom hook for verification |
| `server/index.js` | Backend verification endpoint |

### Backend Verification Endpoint
```
POST /api/security/verify-recaptcha
```

**Request Body:**
```json
{
  "token": "reCAPTCHA-token-from-frontend",
  "action": "login"
}
```

**Response:**
```json
{
  "success": true,
  "score": 0.9,
  "action": "login",
  "timestamp": "2026-01-16T10:00:00.000Z"
}
```

### Score Threshold
- Scores range from `0.0` (likely bot) to `1.0` (likely human)
- Threshold: `>= 0.5` is considered valid

---

## ✅ Rate Limiting

### Status: Active

### Configuration
Three tiers of rate limiting are implemented:

| Tier | Window | Max Requests | Applies To |
|------|--------|--------------|------------|
| **General** | 15 min | 100 | All `/api/*` routes |
| **Auth** | 15 min | 10 | `/api/auth/login`, `/api/auth/register` |
| **Password Reset** | 1 hour | 3 | `/api/auth/forgot-password` |

### Response Headers
```
RateLimit-Policy: 100;w=900
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 900
```

### Rate Limit Exceeded Response
```json
{
  "success": false,
  "message": "Too many requests, please try again after 15 minutes"
}
```

### Implementation
```javascript
// server/index.js
import rateLimit from 'express-rate-limit';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
```

---

## Security Best Practices

### Do's
- ✅ Always verify reCAPTCHA token on backend for sensitive actions
- ✅ Use strict rate limiting for authentication endpoints
- ✅ Keep API keys in config file, not in code
- ✅ Monitor rate limit headers for abuse detection

### Don'ts
- ❌ Never expose `secretKey` in frontend code
- ❌ Don't disable rate limiting in production
- ❌ Don't bypass reCAPTCHA for any authentication flow

---

## Testing

### Test Rate Limiting
```bash
# Check health endpoint (see RateLimit headers)
curl -v http://localhost:4000/api/health
```

### Test reCAPTCHA Verification
```bash
# Note: Requires valid token from frontend
curl -X POST http://localhost:4000/api/security/verify-recaptcha \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN", "action": "test"}'
```

---

## Packages Used
| Package | Version | Purpose |
|---------|---------|---------|
| `react-google-recaptcha-v3` | Latest | Frontend reCAPTCHA integration |
| `express-rate-limit` | Latest | Server-side rate limiting |

---

## Last Updated
January 16, 2026
