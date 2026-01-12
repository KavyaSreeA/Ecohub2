# EcoHub API Integration Status

## Overview
This document tracks the status of all API integrations in the EcoHub Unified Platform.

---

## ✅ Active Integrations

### 1. Firebase Authentication
| Status | ✅ Active |
|--------|-----------|
| **API Key** | `AIzaSyCvRKfV2Kq6RcxVBK4KhMsl9w2R1pvxvsI` |
| **Project** | `ecohub-c936c` |

**Features Enabled:**
- ✅ Email/Password authentication
- ✅ Google Sign-In
- ✅ Password reset
- ✅ Server-side token verification (Firebase Admin SDK)

**Files:**
- `src/services/firebase.ts`
- `src/context/AuthContext.tsx`
- `server/index.js`

---

### 2. OpenWeatherMap API
| Status | ✅ Active |
|--------|-----------|
| **API Key** | `b0763003e31fa4d63b684e4c162bfe0d` |

**Features Enabled:**
- ✅ Current weather data
- ✅ 5-day forecast
- ✅ Solar irradiance estimation
- ✅ Weather-based solar calculations

**Endpoints Used:**
- `/weather` - Current conditions
- `/forecast` - 5-day forecast

**Files:**
- `src/components/WeatherWidget.tsx`
- `src/services/solarAIService.ts`

---

### 3. Stream Chat API
| Status | ✅ Configured |
|--------|---------------|
| **API Key** | `ueapfn2bgxzp` |

**Features Enabled:**
- ✅ Real-time messaging
- ✅ Topic channels (General, Solar, Conservation, Transport, Waste)
- ✅ User authentication integration

**Files:**
- `src/components/CommunityChat.tsx`

---

### 4. Google Maps Platform
| Status | ⚠️ API Activation Required |
|--------|----------------------------|
| **API Key** | `AIzaSyD-e_4ZAS_9BzyGArjA6rsuC4y_QnwxjHs` |

**Features Ready (pending API activation):**
- 🔄 Interactive maps
- 🔄 EV charging station finder
- 🔄 Bike share locations
- 🔄 Transit stops
- 🔄 Route planning with CO₂ comparison

**Required APIs to Enable:**
1. Maps JavaScript API
2. Places API
3. Directions API
4. Geocoding API
5. Distance Matrix API

**Files:**
- `src/services/mapsService.ts`
- `src/components/GreenTransportMap.tsx`

📝 See `docs/Google-Maps-API-Setup.md` for setup instructions.

---

## 🔧 Mock/Placeholder Integrations

### Auth0 (Alternative Auth)
| Status | Configured but disabled |
|--------|-------------------------|
| **Domain** | `dev-24kylvqlbsnnr126.us.auth0.com` |
| **Client ID** | `uWAMs192KrLSdTEptu0talXLiEeBSh2J` |

---

### NREL API (Solar Data)
| Status | Mock - needs real key |
|--------|----------------------|
| **Current Key** | `MOCK_NREL_API_Key_EcoHub2026` |

**To Activate:**
1. Get API key from https://developer.nrel.gov/signup/
2. Update `config.ts` with real key

---

### Discourse Forum API
| Status | Mock |
|--------|------|
| **Base URL** | `https://forum.ecohub.com` |

---

### Payment APIs

#### Stripe
| Status | Mock - needs real keys |
|--------|------------------------|
| **Publishable Key** | `pk_test_MOCK...` |

#### Razorpay
| Status | Mock - needs real keys |
|--------|------------------------|
| **Key ID** | `rzp_test_MOCK...` |

---

### Email APIs

#### SendGrid
| Status | Mock - needs real key |
|--------|----------------------|
| **Current Key** | `SG.MOCK...` |

---

## 📊 Config File Location

All API configurations are in:
```
src/config/config.ts
```

---

## 🔐 Security Notes

1. **Never commit real API keys to version control**
2. Firebase Admin SDK key (`*firebase-adminsdk*.json`) is in `.gitignore`
3. For production, use environment variables
4. Restrict API keys by domain/IP in respective consoles

---

## 📅 Last Updated
January 12, 2026
