// EcoHub Platform Configuration
// All API keys are MOCK keys for development/demo purposes

export const config = {
  // ==================== AUTHENTICATION APIs ====================
  auth: {
    // Firebase Authentication
    firebase: {
      apiKey: 'AIzaSyCvRKfV2Kq6RcxVBK4KhMsl9w2R1pvxvsI',
      authDomain: 'ecohub-c936c.firebaseapp.com',
      projectId: 'ecohub-c936c',
      storageBucket: 'ecohub-c936c.appspot.com',
      messagingSenderId: '951878074060',
      appId: '1:951878074060:web:91ef9398b297f518fc8c69',
      enabled: true,
    },
    // Auth0 Alternative
    auth0: {
      domain: 'dev-24kylvqlbsnnr126.us.auth0.com',
      clientId: 'uWAMs192KrLSdTEptu0talXLiEeBSh2J',
      audience: 'https://api.ecohub.com',
      enabled: false,
    },
    // JWT Configuration (for backend API calls)
    jwt: {
      secret: 'ecohub-jwt-secret-key-2026',
      expiresIn: '7d',
    },
  },

  // ==================== DATABASE APIs ====================
  database: {
    // MongoDB Atlas (Mock)
    mongodb: {
      uri: 'mongodb+srv://ecohub-demo:MOCK_PASSWORD@cluster0.mongodb.net/ecohub',
      dbName: 'ecohub',
      enabled: true,
    },
    // Firebase Firestore (Mock)
    firestore: {
      projectId: 'ecohub-demo',
      apiKey: 'MOCK_Firestore_Key_EcoHub2026',
      enabled: false,
    },
    // Supabase Alternative (Mock)
    supabase: {
      url: 'https://ecohub-demo.supabase.co',
      anonKey: 'MOCK_Supabase_Anon_Key_EcoHub2026',
      enabled: false,
    },
  },

  // ==================== FORUM & COMMUNITY APIs ====================
  forum: {
    // Discourse API (Mock)
    discourse: {
      baseUrl: 'https://forum.ecohub.com',
      apiKey: 'MOCK_Discourse_API_Key_EcoHub2026',
      apiUsername: 'system',
      enabled: true,
    },
    // Stream Chat for Real-time
    streamChat: {
      apiKey: 'ueapfn2bgxzp',
      apiSecret: 'pcxxwbhywkk73skyvbum68eatdctpg2nppdjxmvtk36etanv8x7zsadfa7hkn2tk',
      enabled: true,
    },
  },

  // ==================== RENEWABLE ENERGY APIs ====================
  energy: {
    // NREL (National Renewable Energy Laboratory) API
    nrel: {
      apiKey: 'MOCK_NREL_API_Key_EcoHub2026',
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
      apiKey: 'b0763003e31fa4d63b684e4c162bfe0d',
      baseUrl: 'https://api.openweathermap.org/data/2.5',
      endpoints: {
        solar: '/solar_radiation',
        weather: '/weather',
        forecast: '/forecast',
      },
      enabled: true,
    },
    // Solcast Solar Forecasting (Mock)
    solcast: {
      apiKey: 'MOCK_Solcast_API_Key_EcoHub2026',
      baseUrl: 'https://api.solcast.com.au',
      enabled: false,
    },
  },

  // ==================== MAPS & TRANSPORTATION APIs ====================
  maps: {
    // Google Maps Platform
    google: {
      apiKey: 'MOCK_Google_Maps_API_Key_EcoHub2026',
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
      accessToken: 'MOCK_Mapbox_Token_EcoHub2026',
      style: 'mapbox://styles/mapbox/streets-v11',
      enabled: false,
    },
    // OpenRouteService (Free Alternative)
    openRouteService: {
      apiKey: 'MOCK_ORS_API_Key_EcoHub2026',
      baseUrl: 'https://api.openrouteservice.org',
      enabled: false,
    },
  },

  transport: {
    // Transit APIs
    googleTransit: {
      apiKey: 'MOCK_Google_Transit_Key_EcoHub2026',
      enabled: true,
    },
    // Uber/Lyft Integration (Mock)
    rideshare: {
      uberClientId: 'MOCK_Uber_Client_Id_EcoHub2026',
      lyftClientId: 'MOCK_Lyft_Client_Id_EcoHub2026',
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
      apiKey: 'MOCK_Geocoding_API_Key_EcoHub2026',
      enabled: true,
    },
    // Earth911 Recycling API (Mock)
    earth911: {
      apiKey: 'MOCK_Earth911_API_Key_EcoHub2026',
      baseUrl: 'https://api.earth911.com',
      enabled: true,
    },
    // iRecycle API (Mock)
    irecycle: {
      apiKey: 'MOCK_iRecycle_API_Key_EcoHub2026',
      enabled: false,
    },
  },

  // ==================== PAYMENT APIs ====================
  payments: {
    // Stripe
    stripe: {
      publishableKey: 'pk_test_MOCK_Stripe_Publishable_Key_EcoHub2026',
      secretKey: 'sk_test_MOCK_Stripe_Secret_Key_EcoHub2026',
      webhookSecret: 'whsec_MOCK_Stripe_Webhook_Secret_EcoHub2026',
      enabled: true,
    },
    // Razorpay (for India)
    razorpay: {
      keyId: 'rzp_test_MOCK_Razorpay_Key_EcoHub2026',
      keySecret: 'MOCK_Razorpay_Secret_EcoHub2026',
      enabled: true,
    },
    // PayPal
    paypal: {
      clientId: 'MOCK_PayPal_Client_Id_EcoHub2026',
      clientSecret: 'MOCK_PayPal_Secret_EcoHub2026',
      mode: 'sandbox',
      enabled: false,
    },
  },

  // ==================== AI/ML APIs ====================
  ai: {
    // OpenAI for Solar Recommendations
    openai: {
      apiKey: 'sk-MOCK_OpenAI_API_Key_EcoHub2026',
      model: 'gpt-4',
      maxTokens: 2000,
      enabled: true,
    },
    // Google Gemini Alternative
    gemini: {
      apiKey: 'MOCK_Google_Gemini_API_Key_EcoHub2026',
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
      apiKey: 'SG.MOCK_SendGrid_API_Key_EcoHub2026',
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
      apiKey: 'MOCK_Mailgun_API_Key_EcoHub2026',
      domain: 'mg.ecohub.com',
      enabled: false,
    },
    // Push Notifications (OneSignal)
    oneSignal: {
      appId: 'MOCK_OneSignal_App_Id_EcoHub2026',
      apiKey: 'MOCK_OneSignal_API_Key_EcoHub2026',
      enabled: false,
    },
  },

  // ==================== ANALYTICS APIs ====================
  analytics: {
    // Google Analytics 4
    googleAnalytics: {
      measurementId: 'G-MOCK_GA4_ID_ECOHUB',
      enabled: true,
    },
    // Mixpanel
    mixpanel: {
      token: 'MOCK_Mixpanel_Token_EcoHub2026',
      enabled: false,
    },
    // Segment
    segment: {
      writeKey: 'MOCK_Segment_Write_Key_EcoHub2026',
      enabled: false,
    },
  },

  // ==================== CLOUD STORAGE APIs ====================
  storage: {
    // AWS S3
    aws: {
      accessKeyId: 'MOCK_AWS_Access_Key_EcoHub2026',
      secretAccessKey: 'MOCK_AWS_Secret_Key_EcoHub2026',
      region: 'us-east-1',
      bucket: 'ecohub-uploads',
      enabled: false,
    },
    // Cloudinary for Images
    cloudinary: {
      cloudName: 'ecohub-demo',
      apiKey: 'MOCK_Cloudinary_API_Key_EcoHub2026',
      apiSecret: 'MOCK_Cloudinary_Secret_EcoHub2026',
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
    // reCAPTCHA
    recaptcha: {
      siteKey: 'MOCK_reCAPTCHA_Site_Key_EcoHub2026',
      secretKey: 'MOCK_reCAPTCHA_Secret_Key_EcoHub2026',
      enabled: true,
    },
    // Cloudflare Turnstile (Alternative)
    turnstile: {
      siteKey: 'MOCK_Turnstile_Site_Key_EcoHub2026',
      secretKey: 'MOCK_Turnstile_Secret_Key_EcoHub2026',
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
