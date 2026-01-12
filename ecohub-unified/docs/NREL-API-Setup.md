# NREL API Setup Guide

## What is NREL?
**National Renewable Energy Laboratory (NREL)** provides free APIs for solar energy calculations, including:
- **PVWatts** - Solar panel energy production estimates
- **Solar Resource** - Solar irradiance data
- **Utility Rates** - Electricity rate information

## Step 1: Get Your Free API Key

1. Go to: **https://developer.nrel.gov/signup/**
2. Fill in:
   - First Name
   - Last Name
   - Email
   - Organization (can use "Personal/Individual")
3. Click **"Sign Up"**
4. Check your email for the API key

## Step 2: Update Config

Open `src/config/config.ts` and update the NREL section:

```typescript
nrel: {
  apiKey: 'YOUR_ACTUAL_NREL_API_KEY_HERE',  // Replace this
  baseUrl: 'https://developer.nrel.gov/api',
  endpoints: {
    pvWatts: '/pvwatts/v6',
    solarResource: '/solar/solar_resource/v1',
    utilityRates: '/utility_rates/v3',
  },
  enabled: true,
},
```

## Step 3: Test the API

### Test PVWatts (Solar Calculator)
```bash
curl "https://developer.nrel.gov/api/pvwatts/v6.json?api_key=YOUR_KEY&system_capacity=4&module_type=0&losses=14&array_type=1&tilt=20&azimuth=180&lat=13.08&lon=80.27"
```

### Test Solar Resource Data
```bash
curl "https://developer.nrel.gov/api/solar/solar_resource/v1.json?api_key=YOUR_KEY&lat=13.08&lon=80.27"
```

## API Endpoints Used in EcoHub

| Endpoint | Purpose | Rate Limit |
|----------|---------|------------|
| `/pvwatts/v6` | Calculate solar panel output | 1000/hour |
| `/solar/solar_resource/v1` | Get solar irradiance data | 1000/hour |
| `/utility_rates/v3` | Get electricity rates | 1000/hour |

## Integration in EcoHub

The NREL API is used in:
- **Solar Calculator Page** (`/energy/calculator`)
- **Energy Dashboard** for accurate solar estimates

## Rate Limits

| Plan | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 1,000 | 10,000 |

## Example Response (PVWatts)

```json
{
  "inputs": {
    "lat": "13.08",
    "lon": "80.27",
    "system_capacity": "4"
  },
  "outputs": {
    "ac_annual": 5678.5,
    "solrad_annual": 5.12,
    "capacity_factor": 16.2
  }
}
```

## Troubleshooting

| Error | Solution |
|-------|----------|
| `API_KEY_INVALID` | Check key is correctly copied |
| `RATE_LIMIT_EXCEEDED` | Wait 1 hour or upgrade plan |
| `LOCATION_NOT_FOUND` | Verify lat/lon coordinates |

## Support

- NREL API Docs: https://developer.nrel.gov/docs/
- Support: https://developer.nrel.gov/contact/
