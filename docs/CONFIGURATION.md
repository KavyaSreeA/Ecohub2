# EcoHub Platform - Configuration Guide

Complete guide to configuring the EcoHub Platform for development and production environments.

## Table of Contents

- [Environment Variables](#environment-variables)
- [API Configuration](#api-configuration)
- [Database Configuration](#database-configuration)
- [External Service Integration](#external-service-integration)
- [Security Configuration](#security-configuration)
- [Performance Configuration](#performance-configuration)

---

## Environment Variables

### Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual values

3. Never commit `.env` to version control (already in `.gitignore`)

### Required Variables

#### Server Configuration

```bash
# Server Port
PORT=4000

# Environment (development, staging, production)
NODE_ENV=production
```

#### Authentication

```bash
# JWT Secret Key (MUST be changed in production)
JWT_SECRET=your-super-secret-jwt-key-here-change-me

# Token expiration (e.g., 7d, 24h, 60m)
JWT_EXPIRES_IN=7d
```

---

## API Configuration

The platform uses a centralized configuration file located at `src/config/config.ts`.

### Configuration Structure

```typescript
export const config = {
  auth: { ... },        // Authentication providers
  database: { ... },    // Database connections
  forum: { ... },       // Forum/Community services
  energy: { ... },      // Renewable energy APIs
  maps: { ... },        // Maps and geolocation
  transport: { ... },   // Transportation APIs
  waste: { ... },       // Waste exchange services
  payments: { ... },    // Payment gateways
  ai: { ... },          // AI/ML services
  email: { ... },       // Email services
  analytics: { ... },   // Analytics platforms
  storage: { ... },     // Cloud storage
  security: { ... }     // Security services
}
```

---

## External Service Integration

### 1. Authentication Services

#### Firebase Authentication

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD-your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

**Setup**:
1. Create Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Email/Password authentication
3. Copy configuration from Project Settings
4. Add environment variables

#### Auth0 (Alternative)

```bash
# Auth0 Configuration
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
```

**Setup**:
1. Create Auth0 account at [auth0.com](https://auth0.com)
2. Create application (Single Page Application)
3. Configure callback URLs
4. Copy domain and client ID

---

### 2. Database Configuration

#### MongoDB Atlas (Recommended for Production)

```bash
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecohub?retryWrites=true&w=majority
```

**Setup**:
1. Create MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster (Free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string from "Connect" button

**Configuration Options**:
```javascript
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
}
```

#### Supabase (Alternative)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### 3. Maps & Geolocation

#### Google Maps API

```bash
# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-your-google-maps-api-key
```

**Setup**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project
3. Enable APIs: Maps JavaScript API, Geocoding API, Places API
4. Create credentials (API Key)
5. Restrict API key to your domain

**Required APIs**:
- Maps JavaScript API
- Geocoding API
- Places API
- Directions API
- Distance Matrix API

#### Mapbox (Alternative)

```bash
# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token
```

**Setup**:
1. Create account at [mapbox.com](https://www.mapbox.com)
2. Generate access token
3. Configure URL restrictions

---

### 4. Renewable Energy APIs

#### NREL (National Renewable Energy Laboratory)

```bash
# NREL Developer API
NREL_API_KEY=your-nrel-api-key
```

**Setup**:
1. Register at [developer.nrel.gov](https://developer.nrel.gov)
2. Request API key
3. Free tier: 1,000 requests/hour

**Available Endpoints**:
- Solar Resource Data
- PVWatts Calculator
- Utility Rates
- Incentives and Policies

#### OpenWeather API

```bash
# OpenWeather Configuration
OPENWEATHER_API_KEY=your-openweather-api-key
```

**Setup**:
1. Create account at [openweathermap.org](https://openweathermap.org)
2. Generate API key
3. Free tier: 1,000 calls/day

---

### 5. Payment Gateways

#### Stripe

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key
STRIPE_SECRET_KEY=sk_test_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

**Setup**:
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Set up webhooks for payment events
4. Test with provided test cards

**Webhook Events**:
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.succeeded`

#### Razorpay (India)

```bash
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
```

**Setup**:
1. Create account at [razorpay.com](https://razorpay.com)
2. Get API keys from Settings → API Keys
3. Configure webhook URL

---

### 6. Email Services

#### SendGrid

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

**Setup**:
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Create API key with Full Access
3. Verify sender identity
4. Free tier: 100 emails/day

**Email Templates**:
- Welcome email
- Password reset
- Campaign donation confirmation
- Event registration confirmation

#### Mailgun (Alternative)

```bash
# Mailgun Configuration
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=mg.yourdomain.com
```

---

### 7. AI/ML Services

#### OpenAI

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key
```

**Setup**:
1. Create account at [platform.openai.com](https://platform.openai.com)
2. Generate API key
3. Set up billing (pay-as-you-go)

**Use Cases**:
- Enhanced solar calculator recommendations
- Chatbot support
- Content generation for campaigns

#### Google Gemini

```bash
# Google Gemini Configuration
GOOGLE_GEMINI_API_KEY=your-gemini-api-key
```

---

### 8. Analytics

#### Google Analytics 4

```bash
# Google Analytics Configuration
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Setup**:
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get Measurement ID
3. Configure data streams
4. Set up custom events

#### Mixpanel

```bash
# Mixpanel Configuration
MIXPANEL_TOKEN=your-mixpanel-token
```

---

### 9. Cloud Storage

#### AWS S3

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ecohub-uploads
```

**Setup**:
1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 permissions
4. Generate access keys

**Bucket Policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::ecohub-uploads/*"
    }
  ]
}
```

#### Cloudinary

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

### 10. Security Services

#### Google reCAPTCHA

```bash
# reCAPTCHA Configuration
VITE_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

**Setup**:
1. Register site at [google.com/recaptcha](https://www.google.com/recaptcha)
2. Choose reCAPTCHA v3
3. Add your domain
4. Get site and secret keys

---

## Database Configuration

### MongoDB Production Setup

#### Connection Pool Configuration

```javascript
const mongoConfig = {
  maxPoolSize: 50,           // Maximum connections
  minPoolSize: 10,           // Minimum connections
  maxIdleTimeMS: 30000,      // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4                  // Use IPv4
}
```

#### Indexes for Performance

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ createdAt: -1 })

// Campaigns collection
db.campaigns.createIndex({ status: 1, category: 1 })
db.campaigns.createIndex({ createdAt: -1 })

// Waste listings collection
db.wasteListings.createIndex({ category: 1, location: 1 })
db.wasteListings.createIndex({ status: 1, createdAt: -1 })

// Energy projects collection
db.energyProjects.createIndex({ type: 1, status: 1 })
db.energyProjects.createIndex({ location: "2dsphere" })
```

#### Backup Strategy

```bash
# Daily backups
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Automated backup script
0 2 * * * /usr/local/bin/backup-mongodb.sh
```

---

## Security Configuration

### JWT Configuration

```javascript
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  algorithm: 'HS256',
  issuer: 'ecohub-platform',
  audience: 'ecohub-users'
}
```

### CORS Configuration

```javascript
const corsOptions = {
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    process.env.NODE_ENV === 'development' ? 'http://localhost:5173' : null
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
}
```

### Rate Limiting

```javascript
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
}
```

### Helmet Security Headers

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))
```

---

## Performance Configuration

### Caching Strategy

#### Redis Configuration

```bash
# Redis Connection
REDIS_URL=redis://username:password@host:port
REDIS_PASSWORD=your-redis-password
```

**Cache Configuration**:
```javascript
const cacheConfig = {
  ttl: 3600,              // 1 hour default TTL
  checkPeriod: 600,       // Check for expired keys every 10 min
  maxKeys: 1000           // Maximum keys in cache
}
```

#### Application-Level Caching

```javascript
// Cache API responses
const cacheMiddleware = {
  energySources: 3600,      // 1 hour
  campaigns: 600,           // 10 minutes
  routes: 1800,             // 30 minutes
  wasteListings: 300        // 5 minutes
}
```

### Compression

```javascript
app.use(compression({
  level: 6,                 // Compression level (0-9)
  threshold: 1024,          // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false
    }
    return compression.filter(req, res)
  }
}))
```

---

## Configuration Best Practices

### 1. Environment-Specific Configurations

```javascript
const config = {
  development: {
    apiUrl: 'http://localhost:4000',
    debug: true,
    logLevel: 'debug'
  },
  staging: {
    apiUrl: 'https://staging-api.ecohub.com',
    debug: true,
    logLevel: 'info'
  },
  production: {
    apiUrl: 'https://api.ecohub.com',
    debug: false,
    logLevel: 'error'
  }
}
```

### 2. Secrets Management

**Development**: Use `.env` file

**Production Options**:
- AWS Secrets Manager
- Azure Key Vault
- HashiCorp Vault
- Kubernetes Secrets

### 3. Configuration Validation

```javascript
// Validate required environment variables on startup
const requiredEnvVars = [
  'NODE_ENV',
  'PORT',
  'JWT_SECRET',
  'MONGODB_URI'
]

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
})
```

---

## Mock API Configuration (Development)

For development and testing, the platform includes mock API configurations:

### Location

`src/config/config.ts` and `src/services/apiService.ts`

### Mock Services Included

- Authentication (JWT-based)
- Database operations (in-memory)
- Forum and community features
- Energy calculations
- Maps and routing (static data)
- Payment processing (test mode)
- Email notifications (console logging)

### Switching to Production APIs

Replace mock values with real API keys in `.env`:

```bash
# Before (Mock)
VITE_GOOGLE_MAPS_API_KEY=MOCK_Google_Maps_API_Key

# After (Production)
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-your-real-api-key
```

---

## Monitoring & Logging

### Application Monitoring

```bash
# New Relic
NEW_RELIC_LICENSE_KEY=your-license-key
NEW_RELIC_APP_NAME=EcoHub-Production

# Sentry Error Tracking
SENTRY_DSN=https://your-sentry-dsn
```

### Logging Configuration

```javascript
const winston = require('winston')

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})
```

---

## Configuration Checklist

### Development Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Set `NODE_ENV=development`
- [ ] Configure `PORT` (default: 4000)
- [ ] Set `JWT_SECRET`
- [ ] Install dependencies: `npm install`

### Production Deployment
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure production database (MongoDB Atlas)
- [ ] Set up real API keys for all services
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up monitoring and logging
- [ ] Configure automated backups
- [ ] Enable rate limiting
- [ ] Set up CI/CD pipeline

---

*Last Updated: January 2026*
