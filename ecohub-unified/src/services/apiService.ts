// Centralized API Service for EcoHub Platform
// Connects mock API keys to all features

import { config } from '../config/config';

const API_BASE_URL = '/api';

// ==================== AUTHENTICATION SERVICE ====================
export const authService = {
  login: async (email: string, password: string) => {
    // Uses JWT authentication (config.auth.jwt)
    console.log('[Auth] Using JWT Secret:', config.auth.jwt.secret.substring(0, 10) + '...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (name: string, email: string, password: string) => {
    console.log('[Auth] Firebase API Key:', config.auth.firebase.apiKey.substring(0, 15) + '...');
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },

  verify: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Google OAuth (Mock)
  googleSignIn: async () => {
    console.log('[Auth] Firebase Project:', config.auth.firebase.projectId);
    return {
      success: true,
      user: { id: 'google_user_123', email: 'demo@gmail.com', name: 'Demo User' },
      token: 'mock_google_token_' + Date.now(),
    };
  },
};

// ==================== FORUM SERVICE ====================
export const forumService = {
  getPosts: async () => {
    console.log('[Forum] Discourse API Key:', config.forum.discourse.apiKey.substring(0, 15) + '...');
    const response = await fetch(`${API_BASE_URL}/conservation/forum`);
    return response.json();
  },

  createPost: async (title: string, message: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, message }),
    });
    return response.json();
  },

  likePost: async (postId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  addComment: async (postId: string, comment: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });
    return response.json();
  },
};

// ==================== RENEWABLE ENERGY SERVICE ====================
export const energyService = {
  getSources: async () => {
    const response = await fetch(`${API_BASE_URL}/energy/sources`);
    return response.json();
  },

  getProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/energy/projects`);
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/energy/stats`);
    return response.json();
  },

  // NREL Solar Resource API (Mock)
  getSolarResource: async (lat: number, lon: number) => {
    console.log('[Energy] NREL API Key:', config.energy.nrel.apiKey.substring(0, 15) + '...');
    console.log('[Energy] Fetching solar data for:', { lat, lon });
    // Mock response - in production would call NREL API
    return {
      avgDni: 5.5, // Direct Normal Irradiance (kWh/m2/day)
      avgGhi: 4.8, // Global Horizontal Irradiance
      avgTilt: 5.2, // Tilted surface irradiance
      optimalTilt: lat * 0.76, // Optimal tilt angle
    };
  },

  // OpenWeather Solar Data (Mock)
  getWeatherData: async (lat: number, lon: number) => {
    console.log('[Energy] OpenWeather API Key:', config.energy.openWeather.apiKey.substring(0, 15) + '...');
    return {
      clouds: 20,
      sunrise: '06:30',
      sunset: '18:45',
      uvIndex: 7,
      temperature: 28,
      humidity: 65,
    };
  },

  // Solcast Solar Forecast (Mock)
  getSolarForecast: async (lat: number, lon: number) => {
    console.log('[Energy] Solcast API Key:', config.energy.solcast.apiKey.substring(0, 15) + '...');
    return {
      forecast: [
        { time: '09:00', ghi: 450, dni: 520 },
        { time: '12:00', ghi: 850, dni: 920 },
        { time: '15:00', ghi: 620, dni: 680 },
        { time: '18:00', ghi: 180, dni: 200 },
      ],
    };
  },

  calculateSolar: async (data: {
    rooftopArea: number;
    monthlyBill: number;
    roofType: string;
    sunlightExposure: string;
    location?: string;
  }) => {
    console.log('[Energy] Using Solar AI Model:', config.ai.solarAI.model);
    const response = await fetch(`${API_BASE_URL}/energy/solar-calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// ==================== MAPS & TRANSPORTATION SERVICE ====================
export const mapsService = {
  // Google Maps Geocoding (Mock)
  geocode: async (address: string) => {
    console.log('[Maps] Google Maps API Key:', config.maps.google.apiKey.substring(0, 15) + '...');
    // Mock response
    return {
      lat: 19.076,
      lng: 72.8777,
      formattedAddress: address + ', India',
      placeId: 'ChIJ-mock-place-id',
    };
  },

  // Reverse Geocode (Mock)
  reverseGeocode: async (lat: number, lng: number) => {
    return {
      address: '123 Green Street, Mumbai, Maharashtra 400001',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001',
    };
  },

  // Get Directions (Mock)
  getDirections: async (origin: string, destination: string, mode: string = 'transit') => {
    console.log('[Maps] Getting directions:', { origin, destination, mode });
    return {
      distance: '12.5 km',
      duration: '35 mins',
      steps: [
        { instruction: 'Head north on Main St', distance: '0.5 km', duration: '2 mins' },
        { instruction: 'Turn right onto Transit Ave', distance: '2.0 km', duration: '5 mins' },
        { instruction: 'Take bus line 42', distance: '8.0 km', duration: '20 mins' },
        { instruction: 'Walk to destination', distance: '2.0 km', duration: '8 mins' },
      ],
      co2Saved: '2.8 kg',
      polyline: 'mock_encoded_polyline_string',
    };
  },

  // Get Nearby Places (Mock)
  getNearbyPlaces: async (lat: number, lng: number, type: string) => {
    return [
      { name: 'EV Charging Station', distance: '0.5 km', rating: 4.5 },
      { name: 'Bike Rental', distance: '0.8 km', rating: 4.2 },
      { name: 'Bus Stop', distance: '0.2 km' },
    ];
  },

  // Get Nearby Transit (Mock)
  getNearbyTransit: async (lat: number, lng: number) => {
    return {
      busStops: [
        { name: 'Central Station', distance: '200m', lines: ['42', '56', '78'] },
        { name: 'Market Square', distance: '450m', lines: ['12', '23'] },
      ],
      metroStations: [
        { name: 'Green Line - Downtown', distance: '300m', nextTrain: '5 mins' },
      ],
      bikeShares: [
        { name: 'CitiBike Station', distance: '150m', availableBikes: 8, availableDocks: 12 },
      ],
    };
  },
};

export const transportService = {
  getRoutes: async () => {
    const response = await fetch(`${API_BASE_URL}/transport/routes`);
    return response.json();
  },

  getVehicles: async () => {
    const response = await fetch(`${API_BASE_URL}/transport/vehicles`);
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/transport/stats`);
    return response.json();
  },

  // Book a ride (Mock)
  bookRide: async (pickup: string, destination: string, vehicleType: string) => {
    console.log('[Transport] Google Transit API Key:', config.transport.googleTransit.apiKey.substring(0, 15) + '...');
    return {
      bookingId: 'RIDE_' + Date.now(),
      status: 'confirmed',
      estimatedPickup: '5 mins',
      fare: Math.floor(Math.random() * 200) + 50,
      co2Saved: '2.5 kg',
    };
  },

  // Calculate carbon savings for route
  calculateCO2Savings: (distance: number, mode: string) => {
    const carEmissions = 0.21; // kg CO2 per km
    const modeEmissions: Record<string, number> = {
      bus: 0.089,
      metro: 0.041,
      bike: 0,
      walking: 0,
      electric: 0.053,
      'electric-auto': 0.045,
      'electric-car': 0.053,
      'electric-bus': 0.03,
    };
    const emissions = modeEmissions[mode] || 0;
    return Number(((carEmissions - emissions) * distance).toFixed(2));
  },
};

// ==================== WASTE EXCHANGE SERVICE ====================
export const wasteService = {
  getListings: async () => {
    const response = await fetch(`${API_BASE_URL}/waste/listings`);
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/waste/categories`);
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/waste/stats`);
    return response.json();
  },

  createListing: async (listing: {
    title: string;
    category: string;
    quantity: string;
    location: string;
    price: string;
    description?: string;
  }) => {
    console.log('[Waste] Geocoding API Key:', config.waste.geocoding.apiKey.substring(0, 15) + '...');
    const response = await fetch(`${API_BASE_URL}/waste/listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listing),
    });
    return response.json();
  },

  // Find recycling centers (Mock - Earth911 API)
  findRecyclingCenters: async (material: string, lat: number, lng: number) => {
    console.log('[Waste] Earth911 API Key:', config.waste.earth911.apiKey.substring(0, 15) + '...');
    return [
      { id: '1', name: 'Green Recyclers Inc', distance: '1.2 km', accepts: ['plastic', 'paper', 'metal'], address: '123 Eco Lane' },
      { id: '2', name: 'EcoWaste Solutions', distance: '2.8 km', accepts: ['electronics', 'batteries'], address: '456 Green Street' },
      { id: '3', name: 'City Recycling Center', distance: '4.5 km', accepts: ['all'], address: '789 Recycle Road' },
    ];
  },

  // Contact seller (Mock)
  contactSeller: async (listingId: string, message: string) => {
    return {
      success: true,
      messageId: 'MSG_' + Date.now(),
      message: 'Your message has been sent to the seller.',
    };
  },
};

// ==================== CONSERVATION SERVICE ====================
export const conservationService = {
  getCampaigns: async () => {
    const response = await fetch(`${API_BASE_URL}/conservation/campaigns`);
    return response.json();
  },

  getCampaign: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/conservation/campaigns/${id}`);
    return response.json();
  },

  getEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/conservation/events`);
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/conservation/stats`);
    return response.json();
  },

  // Join campaign
  joinCampaign: async (campaignId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/conservation/campaigns/${campaignId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },

  // Register for event
  registerEvent: async (eventId: string, token: string) => {
    const response = await fetch(`${API_BASE_URL}/conservation/events/${eventId}/register`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  },
};

// ==================== PAYMENT SERVICE ====================
export const paymentService = {
  // Stripe Payment (Mock)
  createStripePayment: async (amount: number, currency: string = 'usd') => {
    console.log('[Payment] Stripe Publishable Key:', config.payments.stripe.publishableKey.substring(0, 20) + '...');
    // Mock payment intent
    return {
      clientSecret: 'pi_mock_secret_' + Date.now(),
      paymentIntentId: 'pi_mock_' + Date.now(),
      amount,
      currency,
    };
  },

  // Razorpay Payment (Mock)
  createRazorpayOrder: async (amount: number) => {
    console.log('[Payment] Razorpay Key ID:', config.payments.razorpay.keyId.substring(0, 15) + '...');
    return {
      orderId: 'order_mock_' + Date.now(),
      amount: amount * 100, // Razorpay uses paise
      currency: 'INR',
      keyId: config.payments.razorpay.keyId,
    };
  },

  // PayPal Payment (Mock)
  createPayPalOrder: async (amount: number) => {
    console.log('[Payment] PayPal Client ID:', config.payments.paypal.clientId.substring(0, 15) + '...');
    return {
      orderId: 'PAYPAL_' + Date.now(),
      approvalUrl: 'https://sandbox.paypal.com/mock-approval',
      amount,
    };
  },

  // Process donation
  processDonation: async (campaignId: string, amount: number, paymentMethod: string) => {
    return {
      success: true,
      transactionId: 'txn_' + Date.now(),
      campaignId,
      amount,
      paymentMethod,
      message: 'Thank you for your donation!',
      receipt: 'RCP_' + Date.now(),
    };
  },

  // Get payment history
  getPaymentHistory: async (token: string) => {
    return [
      { id: 'txn_1', amount: 1000, campaign: 'Save the Amazon', date: '2026-01-01', status: 'completed' },
      { id: 'txn_2', amount: 500, campaign: 'Ocean Cleanup', date: '2025-12-15', status: 'completed' },
    ];
  },
};

// ==================== AI SERVICE ====================
export const aiService = {
  // OpenAI Chat (Mock)
  getAIResponse: async (prompt: string) => {
    console.log('[AI] OpenAI API Key:', config.ai.openai.apiKey.substring(0, 10) + '...');
    console.log('[AI] Using model:', config.ai.openai.model);
    // Mock AI response
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    return {
      response: 'Based on your inputs, I recommend a 3kW solar system with 8 panels. This will generate approximately 400 kWh per month and save you around Rs. 3,000 monthly.',
      model: config.ai.openai.model,
      tokens: 150,
    };
  },

  // Google Gemini (Mock)
  getGeminiResponse: async (prompt: string) => {
    console.log('[AI] Gemini API Key:', config.ai.gemini.apiKey.substring(0, 15) + '...');
    return {
      response: 'Your solar installation analysis is ready...',
      model: config.ai.gemini.model,
    };
  },

  // Solar AI Recommendations
  getSolarRecommendations: async (systemSize: number, location: string) => {
    return [
      { icon: 'home', title: 'Ideal for Home', description: 'Perfect size for residential use' },
      { icon: 'tree', title: 'Eco Impact', description: `Offset ${(systemSize * 1.2).toFixed(1)} tons of CO2 annually` },
      { icon: 'coins', title: 'Great ROI', description: 'Payback period under 4 years with subsidies' },
      { icon: 'zap', title: 'Energy Independence', description: 'Reduce grid dependency by 80%' },
    ];
  },

  // Chat with AI about sustainability
  chatWithAI: async (message: string, context: string = 'sustainability') => {
    return {
      reply: `Here's some information about ${context}: ${message.slice(0, 50)}...`,
      suggestions: ['Learn more about solar', 'Calculate your savings', 'Find green transport'],
    };
  },
};

// ==================== EMAIL SERVICE ====================
export const emailService = {
  // SendGrid Email (Mock)
  sendEmail: async (to: string, templateId: string, data: Record<string, string>) => {
    console.log('[Email] SendGrid API Key:', config.email.sendgrid.apiKey.substring(0, 10) + '...');
    console.log('[Email] Sending to:', to, 'Template:', templateId);
    return {
      success: true,
      messageId: 'msg_' + Date.now(),
      to,
      template: templateId,
    };
  },

  sendWelcomeEmail: async (email: string, name: string) => {
    return emailService.sendEmail(email, config.email.sendgrid.templates.welcome, { name });
  },

  sendVerificationEmail: async (email: string, verificationLink: string) => {
    return emailService.sendEmail(email, config.email.sendgrid.templates.verification, { verificationLink });
  },

  sendDonationReceipt: async (email: string, amount: number, campaign: string) => {
    return emailService.sendEmail(email, config.email.sendgrid.templates.donation, {
      amount: amount.toString(),
      campaign,
    });
  },

  sendPasswordReset: async (email: string, resetLink: string) => {
    return emailService.sendEmail(email, config.email.sendgrid.templates.passwordReset, { resetLink });
  },
};

// ==================== ANALYTICS SERVICE ====================
export const analyticsService = {
  trackEvent: (eventName: string, properties: Record<string, unknown>) => {
    if (config.analytics.googleAnalytics.enabled) {
      console.log('[Analytics] GA4 Event:', eventName, properties);
      console.log('[Analytics] Measurement ID:', config.analytics.googleAnalytics.measurementId);
      // In production: gtag('event', eventName, properties);
    }
  },

  trackPageView: (pagePath: string) => {
    console.log('[Analytics] Page View:', pagePath);
    // In production: gtag('config', measurementId, { page_path: pagePath });
  },

  trackConversion: (conversionType: string, value: number) => {
    console.log('[Analytics] Conversion:', conversionType, 'Value:', value);
  },

  identifyUser: (userId: string, traits: Record<string, unknown>) => {
    console.log('[Analytics] Identify User:', userId, traits);
  },
};

// ==================== STORAGE SERVICE ====================
export const storageService = {
  // Cloudinary Upload (Mock)
  uploadImage: async (file: File) => {
    console.log('[Storage] Cloudinary Cloud Name:', config.storage.cloudinary.cloudName);
    console.log('[Storage] Cloudinary API Key:', config.storage.cloudinary.apiKey.substring(0, 15) + '...');
    return {
      success: true,
      url: `https://res.cloudinary.com/${config.storage.cloudinary.cloudName}/image/upload/v${Date.now()}/ecohub/${file.name}`,
      publicId: 'ecohub/' + file.name.replace(/\.[^/.]+$/, ''),
      format: file.name.split('.').pop(),
    };
  },

  // Delete image
  deleteImage: async (publicId: string) => {
    return { success: true, deleted: publicId };
  },

  // Get signed URL for private files
  getSignedUrl: async (publicId: string) => {
    return {
      url: `https://res.cloudinary.com/${config.storage.cloudinary.cloudName}/image/upload/s--signature--/${publicId}`,
      expiresAt: Date.now() + 3600000, // 1 hour
    };
  },
};

// ==================== SECURITY SERVICE ====================
export const securityService = {
  // Verify reCAPTCHA (Mock)
  verifyRecaptcha: async (token: string) => {
    console.log('[Security] reCAPTCHA Site Key:', config.security.recaptcha.siteKey.substring(0, 15) + '...');
    return {
      success: true,
      score: 0.9, // 0.0 - 1.0, higher is more likely human
      action: 'submit',
    };
  },

  // Check rate limit (Mock)
  checkRateLimit: (ip: string) => {
    console.log('[Security] Rate limit check for:', ip);
    return {
      allowed: true,
      remaining: 95,
      resetAt: Date.now() + config.security.rateLimit.windowMs,
    };
  },

  // Validate input (Mock)
  sanitizeInput: (input: string) => {
    return input.replace(/<[^>]*>/g, '').trim();
  },
};

// ==================== DASHBOARD SERVICE ====================
export const dashboardService = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
    return response.json();
  },

  getUserActivity: async (token: string) => {
    return [
      { type: 'conservation', action: 'Joined campaign', date: '2026-01-05' },
      { type: 'energy', action: 'Calculated solar savings', date: '2026-01-04' },
      { type: 'transport', action: 'Booked eco ride', date: '2026-01-03' },
      { type: 'waste', action: 'Listed recyclables', date: '2026-01-02' },
    ];
  },

  getImpactSummary: async (token: string) => {
    return {
      co2Saved: '125 kg',
      treesPlanted: 5,
      ridesCompleted: 12,
      wasteRecycled: '45 kg',
      donationsTotal: 2500,
    };
  },
};

// Export all services
export const apiServices = {
  auth: authService,
  forum: forumService,
  energy: energyService,
  maps: mapsService,
  transport: transportService,
  waste: wasteService,
  conservation: conservationService,
  payment: paymentService,
  ai: aiService,
  email: emailService,
  analytics: analyticsService,
  storage: storageService,
  security: securityService,
  dashboard: dashboardService,
};

export default apiServices;
