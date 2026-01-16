// EcoHub Platform Configuration
// API keys are loaded from environment variables for security
// In development, fallback values are used if env vars are not set

// Helper to get env variable (works in both Vite and Node.js)
const getEnv = (key: string, fallback: string = ''): string => {
  // Vite frontend (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as Record<string, string>)[key] || fallback;
  }
  // Node.js backend (process.env)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  return fallback;
};

export const config = {
  // ==================== AUTHENTICATION APIs ====================
  auth: {
    // Firebase Authentication
    firebase: {
      apiKey: getEnv('VITE_FIREBASE_API_KEY', 'AIzaSyCvRKfV2Kq6RcxVBK4KhMsl9w2R1pvxvsI'),
      authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN', 'ecohub-c936c.firebaseapp.com'),
      projectId: getEnv('VITE_FIREBASE_PROJECT_ID', 'ecohub-c936c'),
      storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET', 'ecohub-c936c.appspot.com'),
      messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', '951878074060'),
      appId: getEnv('VITE_FIREBASE_APP_ID', '1:951878074060:web:91ef9398b297f518fc8c69'),
      enabled: true,
    },
    // Auth0 Alternative
    auth0: {
      domain: getEnv('VITE_AUTH0_DOMAIN', 'dev-24kylvqlbsnnr126.us.auth0.com'),
      clientId: getEnv('VITE_AUTH0_CLIENT_ID', 'uWAMs192KrLSdTEptu0talXLiEeBSh2J'),
      audience: 'https://api.ecohub.com',
      enabled: false,
    },
    // JWT Configuration (for backend API calls)
    jwt: {
      secret: getEnv('JWT_SECRET', 'ecohub-jwt-secret-key-2026'),
      expiresIn: '7d',
    },
  },

  // ==================== DATABASE APIs ====================
  database: {
    // MongoDB Atlas
    mongodb: {
      uri: getEnv('MONGODB_URI', 'mongodb+srv://ecohub-demo:MOCK_PASSWORD@cluster0.mongodb.net/ecohub'),
      dbName: 'ecohub',
      enabled: true,
    },
    // Firebase Firestore
    firestore: {
      projectId: 'ecohub-demo',
      apiKey: getEnv('VITE_FIRESTORE_API_KEY', ''),
      enabled: false,
    },
    // Supabase Alternative
    supabase: {
      url: getEnv('VITE_SUPABASE_URL', ''),
      anonKey: getEnv('VITE_SUPABASE_ANON_KEY', ''),
      enabled: false,
    },
  },

  // ==================== FORUM & COMMUNITY APIs ====================
  forum: {
    // Discourse API
    discourse: {
      baseUrl: 'https://forum.ecohub.com',
      apiKey: getEnv('DISCOURSE_API_KEY', ''),
      apiUsername: 'system',
      enabled: true,
    },
    // Stream Chat for Real-time
    streamChat: {
      apiKey: getEnv('VITE_STREAM_CHAT_API_KEY', 'ueapfn2bgxzp'),
      apiSecret: getEnv('STREAM_CHAT_API_SECRET', 'pcxxwbhywkk73skyvbum68eatdctpg2nppdjxmvtk36etanv8x7zsadfa7hkn2tk'),
      enabled: true,
    },
  },

  // ==================== RENEWABLE ENERGY APIs ====================
  energy: {
    // NREL (National Renewable Energy Laboratory) API
    nrel: {
      apiKey: getEnv('VITE_NREL_API_KEY', 'DEMO_KEY'),
      baseUrl: 'https://developer.nrel.gov/api',
      endpoints: {
        pvWatts: '/pvwatts/v6',
        solarResource: '/solar/solar_resource/v1',
        utilityRates: '/utility_rates/v3',
      },
      enabled: true,
    },
    // OpenWeatherMap for Solar Irradiance
    openWeather: {
      apiKey: getEnv('VITE_OPENWEATHER_API_KEY', 'b0763003e31fa4d63b684e4c162bfe0d'),
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      endpoints: {
        solar: '/solar_radiation',
        weather: '/weather',
        forecast: '/forecast',
      },
      enabled: true,
    },
    // Solcast Solar Forecasting
    solcast: {
      apiKey: getEnv('SOLCAST_API_KEY', ''),
      baseUrl: 'https://api.solcast.com.au',
      enabled: false,
    },
  },

  // ==================== MAPS & TRANSPORTATION APIs ====================
  maps: {
    // Google Maps Platform
    google: {
      apiKey: getEnv('VITE_GOOGLE_MAPS_API_KEY', 'AIzaSyD-e_4ZAS_9BzyGArjA6rsuC4y_QnwxjHs'),
      services: {
        maps: true,
        places: true,
        directions: true,
        geocoding: true,
        distanceMatrix: true,
      },
      enabled: true,
    },
    // Mapbox Alternative
    mapbox: {
      accessToken: getEnv('VITE_MAPBOX_TOKEN', ''),
      style: 'mapbox://styles/mapbox/streets-v11',
      enabled: false,
    },
    // OpenRouteService (Free Alternative)
    openRouteService: {
      apiKey: getEnv('VITE_ORS_API_KEY', ''),
      baseUrl: 'https://api.openrouteservice.org',
      enabled: false,
    },
  },

  transport: {
    // Transit APIs
    googleTransit: {
      apiKey: getEnv('VITE_GOOGLE_TRANSIT_KEY', ''),
      enabled: true,
    },
    // Uber/Lyft Integration
    rideshare: {
      uberClientId: getEnv('VITE_UBER_CLIENT_ID', ''),
      lyftClientId: getEnv('VITE_LYFT_CLIENT_ID', ''),
      enabled: false,
    },
    // Bike Share APIs (GBFS)
    gbfs: {
      baseUrl: 'https://gbfs.citibikenyc.com/gbfs/gbfs.json',
      enabled: true,
    },
  },

  // ==================== WASTE EXCHANGE APIs ====================
  waste: {
    // Geocoding for Location-based listings
    geocoding: {
      provider: 'google',
      apiKey: getEnv('VITE_GEOCODING_API_KEY', ''),
      enabled: true,
    },
    // Earth911 Recycling API
    earth911: {
      apiKey: getEnv('EARTH911_API_KEY', ''),
      baseUrl: 'https://api.earth911.com',
      enabled: true,
    },
    // iRecycle API
    irecycle: {
      apiKey: getEnv('IRECYCLE_API_KEY', ''),
      enabled: false,
    },
  },

  // ==================== PAYMENT APIs ====================
  payments: {
    // Stripe
    stripe: {
      publishableKey: getEnv('VITE_STRIPE_PUBLISHABLE_KEY', 'pk_test_MOCK'),
      secretKey: getEnv('STRIPE_SECRET_KEY', 'sk_test_MOCK'),
      webhookSecret: getEnv('STRIPE_WEBHOOK_SECRET', ''),
      enabled: true,
    },
    // Razorpay (for India)
    razorpay: {
      keyId: getEnv('VITE_RAZORPAY_KEY_ID', 'rzp_test_MOCK'),
      keySecret: getEnv('RAZORPAY_KEY_SECRET', ''),
      enabled: true,
    },
    // PayPal
    paypal: {
      clientId: getEnv('VITE_PAYPAL_CLIENT_ID', ''),
      clientSecret: getEnv('PAYPAL_CLIENT_SECRET', ''),
      mode: 'sandbox',
      enabled: false,
    },
  },

  // ==================== AI/ML APIs ====================
  ai: {
    // OpenAI for Solar Recommendations
    openai: {
      apiKey: getEnv('OPENAI_API_KEY', 'sk-MOCK'),
      model: 'gpt-4',
      maxTokens: 2000,
      enabled: true,
    },
    // Google Gemini Alternative
    gemini: {
      apiKey: getEnv('GEMINI_API_KEY', ''),
      model: 'gemini-pro',
      enabled: false,
    },
    // Custom Solar AI Model
    solarAI: {
      endpoint: '/api/energy/solar-calculate',
      model: 'ecohub-solar-advisor-v1',
      enabled: true,
    },
  },

  // ==================== EMAIL & NOTIFICATIONS APIs ====================
  email: {
    // SendGrid
    sendgrid: {
      apiKey: getEnv('SENDGRID_API_KEY', 'SG.MOCK'),
      fromEmail: 'noreply@ecohub.com',
      templates: {
        welcome: 'd-mock-template-welcome',
        verification: 'd-mock-template-verify',
        donation: 'd-mock-template-donation',
        passwordReset: 'd-mock-template-password-reset',
      },
      enabled: true,
    },
    // Mailgun Alternative
    mailgun: {
      apiKey: getEnv('MAILGUN_API_KEY', ''),
      domain: 'mg.ecohub.com',
      enabled: false,
    },
    // Push Notifications (OneSignal)
    oneSignal: {
      appId: getEnv('ONESIGNAL_APP_ID', ''),
      apiKey: getEnv('ONESIGNAL_API_KEY', ''),
      enabled: false,
    },
  },

  // ==================== ANALYTICS APIs ====================
  analytics: {
    // Google Analytics 4
    googleAnalytics: {
      measurementId: getEnv('VITE_GA_MEASUREMENT_ID', 'G-MOCK'),
      enabled: true,
    },
    // Mixpanel
    mixpanel: {
      token: getEnv('VITE_MIXPANEL_TOKEN', ''),
      enabled: false,
    },
    // Segment
    segment: {
      writeKey: getEnv('VITE_SEGMENT_WRITE_KEY', ''),
      enabled: false,
    },
  },

  // ==================== CLOUD STORAGE APIs ====================
  storage: {
    // AWS S3
    aws: {
      accessKeyId: getEnv('AWS_ACCESS_KEY_ID', ''),
      secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', ''),
      region: 'us-east-1',
      bucket: 'ecohub-uploads',
      enabled: false,
    },
    // Cloudinary for Images
    cloudinary: {
      cloudName: getEnv('VITE_CLOUDINARY_CLOUD_NAME', 'ecohub-demo'),
      apiKey: getEnv('CLOUDINARY_API_KEY', ''),
      apiSecret: getEnv('CLOUDINARY_API_SECRET', ''),
      enabled: true,
    },
    // Firebase Storage
    firebaseStorage: {
      bucket: 'ecohub-demo.appspot.com',
      enabled: false,
    },
  },

  // ==================== SECURITY APIs ====================
  security: {
    // reCAPTCHA v3
    recaptcha: {
      siteKey: getEnv('VITE_RECAPTCHA_SITE_KEY', '6LcZ-UcsAAAAABULUof5I363Tidim7r5tI3LsWzP'),
      secretKey: getEnv('RECAPTCHA_SECRET_KEY', '6LcZ-UcsAAAAAE0VL_FdG31ExAq2n0IT2wfk-L9l'),
      enabled: true,
    },
    // Cloudflare Turnstile (Alternative)
    turnstile: {
      siteKey: getEnv('VITE_TURNSTILE_SITE_KEY', ''),
      secretKey: getEnv('TURNSTILE_SECRET_KEY', ''),
      enabled: false,
    },
    // Rate Limiting
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 100,
      enabled: true,
    },
  },

  // ==================== SOLAR CALCULATION CONSTANTS ====================
  solar: {
    costPerWatt: 45,
    panelWattage: 400,
    panelSizeSqFt: 18,
    electricityRatePerKwh: 8,
    sunHoursDefault: 5,
    systemEfficiency: 0.85,
    annualDegradation: 0.005,
    installationCostPercent: 0.15,
    maintenanceCostPerYear: 5000,
    subsidyPercent: 0.40,
    co2OffsetPerKwh: 0.82,
    panelLifespanYears: 25,
  },

  // Roof type efficiency multipliers
  roofTypes: {
    flat: { name: 'Flat Roof', efficiency: 0.90, suitability: 'Excellent' },
    sloped: { name: 'Sloped Roof', efficiency: 1.0, suitability: 'Ideal' },
    metal: { name: 'Metal Roof', efficiency: 0.95, suitability: 'Very Good' },
    tile: { name: 'Tile Roof', efficiency: 0.85, suitability: 'Good' },
    complex: { name: 'Complex/Multiple Angles', efficiency: 0.75, suitability: 'Moderate' },
  },

  // Sunlight exposure options
  sunlightExposure: {
    excellent: { name: 'Excellent (6+ hours)', hours: 6.5, multiplier: 1.1 },
    good: { name: 'Good (5-6 hours)', hours: 5.5, multiplier: 1.0 },
    moderate: { name: 'Moderate (4-5 hours)', hours: 4.5, multiplier: 0.85 },
    limited: { name: 'Limited (3-4 hours)', hours: 3.5, multiplier: 0.7 },
  },
};

// ==================== API SERVICE HELPERS ====================
export const apiServices = {
  getEnabledServices: () => {
    const enabled: string[] = [];
    if (config.auth.firebase.enabled) enabled.push('Firebase Auth');
    if (config.database.mongodb.enabled) enabled.push('MongoDB');
    if (config.maps.google.enabled) enabled.push('Google Maps');
    if (config.energy.nrel.enabled) enabled.push('NREL Solar API');
    if (config.payments.stripe.enabled) enabled.push('Stripe Payments');
    if (config.payments.razorpay.enabled) enabled.push('Razorpay');
    if (config.ai.openai.enabled) enabled.push('OpenAI');
    if (config.email.sendgrid.enabled) enabled.push('SendGrid');
    if (config.analytics.googleAnalytics.enabled) enabled.push('Google Analytics');
    if (config.storage.cloudinary.enabled) enabled.push('Cloudinary');
    if (config.security.recaptcha.enabled) enabled.push('reCAPTCHA');
    return enabled;
  },

  getApiStatus: () => {
    return {
      auth: config.auth.firebase.enabled ? 'active' : 'inactive',
      database: config.database.mongodb.enabled ? 'active' : 'inactive',
      maps: config.maps.google.enabled ? 'active' : 'inactive',
      energy: config.energy.nrel.enabled ? 'active' : 'inactive',
      payments: config.payments.stripe.enabled || config.payments.razorpay.enabled ? 'active' : 'inactive',
      ai: config.ai.openai.enabled ? 'active' : 'inactive',
      email: config.email.sendgrid.enabled ? 'active' : 'inactive',
      analytics: config.analytics.googleAnalytics.enabled ? 'active' : 'inactive',
      storage: config.storage.cloudinary.enabled ? 'active' : 'inactive',
      security: config.security.recaptcha.enabled ? 'active' : 'inactive',
    };
  },
};

export type RoofType = keyof typeof config.roofTypes;
export type SunlightExposure = keyof typeof config.sunlightExposure;
