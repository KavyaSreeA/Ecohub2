# EcoHub Documentation

## API Integration Docs

| Document | Description | Priority |
|----------|-------------|----------|
| [API-Integration-Status.md](./API-Integration-Status.md) | Overall status of all API integrations | 📋 Overview |
| [Google-Maps-API-Setup.md](./Google-Maps-API-Setup.md) | Google Maps API setup instructions | ⚠️ Action Required |
| [NREL-API-Setup.md](./NREL-API-Setup.md) | Solar data API setup | 🔧 Optional Enhancement |

---

## Quick Status

| API | Status | Action Needed |
|-----|--------|---------------|
| Firebase Auth | ✅ Active | None |
| OpenWeatherMap | ✅ Active | None |
| Stream Chat | ✅ Configured | None |
| Google Maps | ⚠️ Pending | Enable APIs in Cloud Console |
| NREL | 🔧 Mock | Get free API key |
| Stripe/Razorpay | 🔧 Mock | Add real keys for payments |
| SendGrid | 🔧 Mock | Add real key for emails |

---

## Configuration File

All API keys are stored in:
```
src/config/config.ts
```

---

## For Developers

### Adding a New API Integration

1. Add config to `src/config/config.ts`
2. Create service file in `src/services/`
3. Create component(s) using the service
4. Add documentation in `docs/`
5. Update `API-Integration-Status.md`

### Environment Variables (Production)

For production deployment, move API keys to environment variables:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_OPENWEATHER_API_KEY=xxx
VITE_GOOGLE_MAPS_API_KEY=xxx
VITE_STREAM_CHAT_KEY=xxx
```

---

## Last Updated
January 12, 2026
