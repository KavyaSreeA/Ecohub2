import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
<<<<<<< HEAD
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import admin from 'firebase-admin';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecohub-jwt-secret-key-2026';

// ==================== FIREBASE ADMIN INITIALIZATION ====================
// Initialize Firebase Admin SDK with service account
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let serviceAccount;
try {
  serviceAccount = require('./firebase-service-account.json');
} catch (e) {
  // Fallback: try loading from project root
  try {
    serviceAccount = require('../ecohub-c936c-firebase-adminsdk-fbsvc-70289cae69.json');
  } catch (e2) {
    console.warn('⚠ Firebase service account not found. Using project ID only.');
    serviceAccount = null;
  }
}

try {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'ecohub-c936c',
    });
    console.log('✓ Firebase Admin initialized with service account');
  } else {
    admin.initializeApp({
      projectId: 'ecohub-c936c',
    });
    console.log('✓ Firebase Admin initialized (basic mode)');
  }
} catch (error) {
  if (error.code === 'app/duplicate-app') {
    console.log('✓ Firebase Admin already initialized');
  } else {
    console.error('Firebase Admin initialization error:', error.message);
  }
}
=======

dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Import database
import db from './config/database.js';

const app = express();
const PORT = process.env.PORT || 4000;
>>>>>>> auth

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

<<<<<<< HEAD
// ==================== RATE LIMITING ====================
// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for password reset
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again after 1 hour',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general limiter to all API routes
app.use('/api/', generalLimiter);

console.log('✓ Rate limiting enabled');

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

// ==================== IN-MEMORY DATABASE ====================
const db = {
  users: [
    { id: '1', name: 'Demo User', email: 'demo@ecohub.com', password: '$2a$10$XQxBtN8xN8xN8xN8xN8xNeXQxBtN8xN8xN8xN8xN8xN8xN8xN8xN8', role: 'user', firebaseUid: null }
  ],
  
  // Conservation Data
  campaigns: [
    { id: '1', title: 'Save the Amazon Rainforest', description: 'Protect 1 million acres of rainforest', goal: 100000, raised: 75000, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', category: 'forest', status: 'active' },
    { id: '2', title: 'Ocean Cleanup Initiative', description: 'Remove plastic from Pacific Ocean', goal: 50000, raised: 32000, image: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400', category: 'ocean', status: 'active' },
    { id: '3', title: 'Wildlife Corridor Project', description: 'Create safe passages for wildlife migration', goal: 75000, raised: 45000, image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400', category: 'wildlife', status: 'active' },
    { id: '4', title: 'Coral Reef Restoration', description: 'Restore damaged coral ecosystems', goal: 60000, raised: 28000, image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400', category: 'ocean', status: 'active' }
  ],
  
  forumPosts: [
    { id: '1', title: 'Tips for reducing plastic usage', message: 'Here are my top 10 tips for reducing plastic in daily life: 1. Carry reusable bags, 2. Use metal straws, 3. Buy in bulk, 4. Choose products with minimal packaging, 5. Use refillable water bottles, 6. Avoid single-use cutlery, 7. Shop at farmers markets, 8. Make your own cleaning products, 9. Choose bar soap over liquid, 10. Compost food waste.', author: 'EcoWarrior', likes: 45, comments: 12, createdAt: '2024-01-15' },
    { id: '2', title: 'Local conservation groups in Seattle', message: 'Looking for volunteers to join our weekend cleanup initiatives! We meet every Saturday at 9 AM at Discovery Park. All ages welcome. We provide gloves and bags. Join us in making Seattle cleaner and greener!', author: 'GreenSeattle', likes: 23, comments: 8, createdAt: '2024-01-14' },
    { id: '3', title: 'Success story: Community garden', message: 'Our neighborhood transformed an abandoned lot into a thriving community garden! In just 6 months, we now have 20 raised beds, a composting station, and regular workshops. The best part? Fresh vegetables for everyone and a stronger sense of community.', author: 'UrbanGardener', likes: 67, comments: 24, createdAt: '2024-01-13' }
  ],
  
  events: [
    { id: '1', title: 'Beach Cleanup Day', date: '2024-02-15', location: 'Santa Monica Beach', participants: 150, image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400' },
    { id: '2', title: 'Tree Planting Marathon', date: '2024-02-20', location: 'Central Park', participants: 200, image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400' },
    { id: '3', title: 'Wildlife Photography Workshop', date: '2024-03-01', location: 'Yellowstone', participants: 50, image: 'https://images.unsplash.com/photo-1504173010664-32509aeebb62?w=400' }
  ],

  // Renewable Energy Data
  energySources: [
    { id: '1', name: 'Solar Power', icon: 'sun', description: 'Harness the power of the sun', capacity: '500 MW', growth: '+15%' },
    { id: '2', name: 'Wind Energy', icon: 'wind', description: 'Clean energy from wind turbines', capacity: '350 MW', growth: '+22%' },
    { id: '3', name: 'Hydroelectric', icon: 'droplets', description: 'Power from flowing water', capacity: '800 MW', growth: '+8%' },
    { id: '4', name: 'Geothermal', icon: 'flame', description: 'Earth\'s natural heat', capacity: '150 MW', growth: '+12%' }
  ],
  
  energyProjects: [
    { id: '1', name: 'Desert Sun Solar Farm', type: 'solar', location: 'Nevada, USA', capacity: '250 MW', status: 'operational', completionDate: '2023-06-15' },
    { id: '2', name: 'Coastal Wind Project', type: 'wind', location: 'Denmark', capacity: '180 MW', status: 'construction', completionDate: '2024-08-01' },
    { id: '3', name: 'Mountain Hydro Station', type: 'hydro', location: 'Norway', capacity: '400 MW', status: 'operational', completionDate: '2022-03-20' },
    { id: '4', name: 'Urban Solar Initiative', type: 'solar', location: 'Tokyo, Japan', capacity: '75 MW', status: 'planning', completionDate: '2025-01-15' }
  ],

  energyStats: {
    totalCapacity: '1,800 MW',
    co2Saved: '2.5M tons',
    homesSupplied: '450,000',
    projectsActive: 24
  },

  // Transport Data
  routes: [
    { id: '1', name: 'Downtown Express', type: 'bus', from: 'Central Station', to: 'Business District', duration: '25 min', co2Saved: '2.5 kg', frequency: 'Every 10 min' },
    { id: '2', name: 'Green Line Metro', type: 'metro', from: 'Airport', to: 'City Center', duration: '35 min', co2Saved: '4.2 kg', frequency: 'Every 5 min' },
    { id: '3', name: 'Bike Share Route', type: 'bike', from: 'University', to: 'Tech Park', duration: '20 min', co2Saved: '3.0 kg', frequency: 'On-demand' },
    { id: '4', name: 'Electric Shuttle', type: 'shuttle', from: 'Mall', to: 'Residential Area', duration: '15 min', co2Saved: '1.8 kg', frequency: 'Every 15 min' }
  ],
  
  vehicles: [
    { id: '1', type: 'Electric Bus', count: 150, co2Reduction: '85%', image: 'bus' },
    { id: '2', type: 'E-Bikes', count: 500, co2Reduction: '100%', image: 'bike' },
    { id: '3', type: 'Electric Cars', count: 200, co2Reduction: '90%', image: 'car' },
    { id: '4', type: 'Metro Trains', count: 50, co2Reduction: '95%', image: 'train' }
  ],

  transportStats: {
    totalRides: '1.2M',
    co2Saved: '850 tons',
    activeUsers: '45,000',
    routesCovered: 120
  },

  // Waste Exchange Data
  wasteListings: [
    { id: '1', title: 'Recyclable Cardboard Boxes', category: 'paper', quantity: '50 kg', location: 'Brooklyn, NY', seller: 'PackageCo', price: 'Free', image: 'package', status: 'available' },
    { id: '2', title: 'Scrap Metal - Aluminum', category: 'metal', quantity: '100 kg', location: 'Newark, NJ', seller: 'MetalWorks', price: '$150', image: 'wrench', status: 'available' },
    { id: '3', title: 'Organic Compost Material', category: 'organic', quantity: '200 kg', location: 'Queens, NY', seller: 'GreenFarm', price: '$50', image: 'sprout', status: 'available' },
    { id: '4', title: 'Electronic Waste - Computers', category: 'e-waste', quantity: '25 units', location: 'Manhattan, NY', seller: 'TechRecycle', price: 'Free pickup', image: 'laptop', status: 'available' },
    { id: '5', title: 'Glass Bottles - Clear', category: 'glass', quantity: '80 kg', location: 'Hoboken, NJ', seller: 'BottleCo', price: '$30', image: 'wine', status: 'available' },
    { id: '6', title: 'Plastic Containers', category: 'plastic', quantity: '60 kg', location: 'Bronx, NY', seller: 'CleanPlastic', price: 'Free', image: 'cup-soda', status: 'pending' }
  ],

  wasteCategories: [
    { id: '1', name: 'Paper & Cardboard', icon: 'file-text', count: 156 },
    { id: '2', name: 'Metals', icon: 'wrench', count: 89 },
    { id: '3', name: 'Plastics', icon: 'recycle', count: 234 },
    { id: '4', name: 'Electronics', icon: 'smartphone', count: 67 },
    { id: '5', name: 'Organic', icon: 'leaf', count: 178 },
    { id: '6', name: 'Glass', icon: 'flask-conical', count: 92 }
  ],

  wasteStats: {
    totalListings: 816,
    wasteExchanged: '12,500 tons',
    co2Prevented: '8,200 tons',
    activeSellers: 342
  }
};

// ==================== FIREBASE AUTH MIDDLEWARE ====================
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  try {
    // Try to verify as Firebase token first
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
      firebaseUid: decodedToken.uid,
    };
    next();
  } catch (firebaseError) {
    // Fall back to JWT verification for backward compatibility
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
  }
};

// Legacy JWT-only middleware (for backward compatibility)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Apply strict rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
app.use('/api/auth/forgot-password', passwordResetLimiter);

// Sync Firebase user with backend database
app.post('/api/auth/sync', verifyFirebaseToken, async (req, res) => {
  try {
    const { id, name, email, avatar } = req.body;
    
    // Check if user already exists
    let user = db.users.find(u => u.firebaseUid === id || u.email === email);
    
    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.firebaseUid = id;
    } else {
      // Create new user
      user = {
        id: uuidv4(),
        firebaseUid: id,
        name: name || email.split('@')[0],
        email,
        avatar,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    }
    
    res.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } 
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ success: false, message: 'Failed to sync user' });
  }
});

// Legacy registration (for non-Firebase users)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashedPassword, role: 'user', firebaseUid: null };
    db.users.push(user);
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Legacy login (for non-Firebase users)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = db.users.find(u => u.email === email);
    
    if (!user) {
      // For demo purposes, auto-create user on login
      user = { id: uuidv4(), name: email.split('@')[0], email, password: '', role: 'user', firebaseUid: null };
      db.users.push(user);
    }
    
    // For demo, accept any password for existing users
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Verify token endpoint (supports both Firebase and JWT)
app.get('/api/auth/verify', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    // Try Firebase token verification first
    const decodedToken = await admin.auth().verifyIdToken(token);
    res.json({ 
      success: true, 
      user: { 
        id: decodedToken.uid, 
        email: decodedToken.email, 
        name: decodedToken.name || decodedToken.email?.split('@')[0] 
      },
      provider: 'firebase'
    });
  } catch (firebaseError) {
    // Fall back to JWT
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ success: true, user: { id: decoded.id, email: decoded.email, name: decoded.name }, provider: 'jwt' });
    } catch (jwtError) {
      res.status(401).json({ success: false, message: 'Invalid token' });
    }
  }
});

// Get current user profile
app.get('/api/auth/me', verifyFirebaseToken, (req, res) => {
  const user = db.users.find(u => u.firebaseUid === req.user.firebaseUid || u.email === req.user.email);
  if (user) {
    res.json({ 
      success: true, 
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar } 
    });
  } else {
    res.json({ 
      success: true, 
      user: { id: req.user.id, name: req.user.name, email: req.user.email } 
    });
  }
});
=======
// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Static data has been moved to database - see database/seed_data.sql
>>>>>>> auth

// ==================== CONSERVATION ROUTES ====================
app.get('/api/conservation/campaigns', async (req, res) => {
  try {
    const campaigns = await db.query(`
  SELECT 
    id,
    title,
    description,
    category,
    image_url AS image,
    goal_amount,
    raised_amount,
    status
  FROM campaigns
  WHERE status IN ('active', 'approved')
  ORDER BY created_at DESC
`);

    const formattedCampaigns = campaigns.map(c => ({
      ...c,
      goal: Number(c.goal_amount) || 0,
      raised: Number(c.raised_amount) || 0
    }));

    res.json(formattedCampaigns);

  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.json([]); // Return empty array instead of error
  }
});

app.get('/api/conservation/campaigns/:id', async (req, res) => {
  try {
    const [campaigns] = await db.query(`
      SELECT 
        id,
        title,
        description,
        category,
        image_url as image,
        goal_amount as goal,
        raised_amount as raised,
        status
      FROM campaigns 
      WHERE id = ?
    `, [req.params.id]);
    if (campaigns.length === 0) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    res.json(campaigns[0]);
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
});

app.get('/api/conservation/forum', async (req, res) => {
  try {
    const [posts] = await db.query(`
      SELECT 
        fp.id,
        fp.title,
        fp.content as message,
        u.name as author,
        fp.likes_count as likes,
        fp.comments_count as comments,
        DATE(fp.created_at) as createdAt
      FROM forum_posts fp
      LEFT JOIN users u ON fp.author_id = u.id
      WHERE fp.status = 'approved' 
      ORDER BY fp.created_at DESC
    `);
    res.json(Array.isArray(posts) ? posts : []);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.json([]); // Return empty array instead of error
  }
});

app.get('/api/conservation/events', async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT 
        id,
        title,
        description,
        event_type,
        image_url as image,
        DATE(event_date) as date,
        location,
        current_participants as participants
      FROM events 
      WHERE status IN ('upcoming', 'approved', 'ongoing')
      ORDER BY event_date ASC
    `);
    res.json(Array.isArray(events) ? events : []);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.json([]); // Return empty array instead of error
  }
});

app.get('/api/conservation/stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM campaigns WHERE status IN ('active', 'approved')) as totalCampaigns,
        (SELECT COALESCE(SUM(raised_amount), 0) FROM campaigns) as totalRaised,
        (SELECT COUNT(*) FROM events WHERE status IN ('upcoming', 'approved', 'ongoing')) as activeEvents,
        (SELECT COUNT(*) FROM forum_posts WHERE status = 'approved') as forumPosts
    `);
    const stats = rows && rows.length > 0 ? rows[0] : {};
    res.json(stats);
  } catch (error) {
    console.error('Error fetching conservation stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== RENEWABLE ENERGY ROUTES ====================
app.get('/api/energy/sources', async (req, res) => {
  try {
    const sources = await db.query(`
      SELECT 
        id,
        name,
        icon,
        description,
        capacity,
        growth,
        image_url
      FROM energy_sources 
      ORDER BY display_order ASC
    `);
    res.json(Array.isArray(sources) ? sources : []);
  } catch (error) {
    // Return fallback data if table doesn't exist (expected during initial setup)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      res.json([
        { id: '1', name: 'Solar Power', icon: '☀️', description: 'Harness the power of the sun', capacity: '500 MW', growth: '+15%' },
        { id: '2', name: 'Wind Energy', icon: '💨', description: 'Clean energy from wind turbines', capacity: '350 MW', growth: '+22%' },
        { id: '3', name: 'Hydroelectric', icon: '💧', description: 'Power from flowing water', capacity: '800 MW', growth: '+8%' },
        { id: '4', name: 'Geothermal', icon: '🌋', description: 'Earth\'s natural heat', capacity: '150 MW', growth: '+12%' }
      ]);
    } else {
      console.error('Error fetching energy sources:', error);
      res.json([]); // Return empty array instead of error
    }
  }
});

app.get('/api/energy/projects', async (req, res) => {
  try {
    const [projects] = await db.query(`
      SELECT 
        id,
        name,
        type,
        location,
        capacity,
        status,
        completion_date as completionDate,
        image_url
      FROM energy_projects 
      ORDER BY display_order ASC
    `);
    res.json(projects);
  } catch (error) {
    // Return fallback data if table doesn't exist (expected during initial setup)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      res.json([
        { id: '1', name: 'Desert Sun Solar Farm', type: 'solar', location: 'Nevada, USA', capacity: '250 MW', status: 'operational', completionDate: '2023-06-15' },
        { id: '2', name: 'Coastal Wind Project', type: 'wind', location: 'Denmark', capacity: '180 MW', status: 'construction', completionDate: '2024-08-01' },
        { id: '3', name: 'Mountain Hydro Station', type: 'hydro', location: 'Norway', capacity: '400 MW', status: 'operational', completionDate: '2022-03-20' },
        { id: '4', name: 'Urban Solar Initiative', type: 'solar', location: 'Tokyo, Japan', capacity: '75 MW', status: 'planning', completionDate: '2025-01-15' }
      ]);
    } else {
      res.status(500).json({ error: 'Failed to fetch energy projects' });
    }
  }
});

app.get('/api/energy/stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM energy_projects WHERE status = 'operational') as projectsActive,
        (SELECT COUNT(*) FROM energy_sources) as totalSources
    `);
    const stats = rows && rows.length > 0 ? rows[0] : {};
    
    // Calculate aggregated stats - handle case where table doesn't exist
    let totalCapacity = 0;
    try {
      const [sources] = await db.query('SELECT capacity FROM energy_sources');
      if (Array.isArray(sources)) {
        totalCapacity = sources.reduce((sum, s) => {
          const num = parseFloat(s.capacity) || 0;
          return sum + num;
        }, 0);
      }
    } catch (sourceError) {
      // If energy_sources table doesn't exist, use default calculation
      totalCapacity = 1800; // Default total from fallback data
    }
    
    res.json({
      totalCapacity: `${totalCapacity.toLocaleString()} MW`,
      co2Saved: '2.5M tons',
      homesSupplied: '450,000',
      projectsActive: stats.projectsActive || 0
    });
  } catch (error) {
    console.error('Error fetching energy stats:', error);
    // Return default stats instead of error
    res.json({
      totalCapacity: '1,800 MW',
      co2Saved: '2.5M tons',
      homesSupplied: '450,000',
      projectsActive: 0
    });
  }
});

app.get('/api/energy/companies/:sourceName', async (req, res) => {
  try {
    const companies = await db.query(`
      SELECT 
        id,
        energy_source_name,
        company_name as name,
        description,
        address,
        phone,
        email,
        website,
        founded,
        employees,
        image_url as image
      FROM energy_companies 
      WHERE energy_source_name = ?
    `, [req.params.sourceName]);
    console.log("Companies: " + companies);
    
    if (companies.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(companies[0]);
  } catch (error) {
    // Return fallback data if table doesn't exist (expected during initial setup)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      const fallbackCompanies = {
        'Solar Power': {
          name: 'SunBright Energy Solutions',
          description: 'Leading provider of residential and commercial solar panel installations.',
          address: '123 Solar Avenue, Bangalore, Karnataka 560001',
          phone: '+91 80 4567 8901',
          email: 'contact@sunbright.energy',
          website: 'www.sunbright.energy',
          founded: '2015',
          employees: '500+',
          image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80'
        },
        'Wind Energy': {
          name: 'WindForce Renewables',
          description: 'Pioneering wind energy solutions across India.',
          address: '456 Wind Mill Road, Chennai, Tamil Nadu 600001',
          phone: '+91 44 5678 9012',
          email: 'info@windforce.in',
          website: 'www.windforce.in',
          founded: '2012',
          employees: '750+',
          image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80'
        },
        'Hydroelectric': {
          name: 'HydroPower India Ltd.',
          description: 'Harnessing the power of water to generate sustainable electricity.',
          address: '789 Dam View Road, Dehradun, Uttarakhand 248001',
          phone: '+91 135 234 5678',
          email: 'contact@hydropowerindia.com',
          website: 'www.hydropowerindia.com',
          founded: '2008',
          employees: '1200+',
          image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80'
        },
        'Geothermal': {
          name: 'GeoTherm Energy Systems',
          description: 'Tapping into Earth\'s natural heat for sustainable power generation.',
          address: '321 Thermal Springs Lane, Pune, Maharashtra 411001',
          phone: '+91 20 6789 0123',
          email: 'hello@geotherm.energy',
          website: 'www.geotherm.energy',
          founded: '2018',
          employees: '300+',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'
        }
      };
      
      const company = fallbackCompanies[req.params.sourceName];
      if (company) {
        res.json(company);
      } else {
        res.status(404).json({ error: 'Company not found' });
      }
    } else {
      res.status(500).json({ error: 'Failed to fetch energy company' });
    }
  }
});

app.get('/api/energy/providers', async (req, res) => {
  try {
    const [providers] = await db.query(`
      SELECT * FROM energy_providers 
      WHERE status = 'active'
    `);
    res.json(providers);
  } catch (error) {
    console.error('Error fetching energy providers:', error);
    res.json([]);
  }
});

// ==================== TRANSPORT ROUTES ====================
app.get('/api/transport/routes', async (req, res) => {
  try {
    const [routes] = await db.query(`
      SELECT 
        id,
        name,
        type,
        from_location as from,
        to_location as to,
        duration,
        co2_saved as co2Saved,
        frequency
      FROM transport_routes 
      ORDER BY display_order ASC
    `);
    res.json(routes);
  } catch (error) {
    // Return fallback data if table doesn't exist (expected during initial setup)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      res.json([
        { id: '1', name: 'Downtown Express', type: 'bus', from: 'Central Station', to: 'Business District', duration: '25 min', co2Saved: '2.5 kg', frequency: 'Every 10 min' },
        { id: '2', name: 'Green Line Metro', type: 'metro', from: 'Airport', to: 'City Center', duration: '35 min', co2Saved: '4.2 kg', frequency: 'Every 5 min' },
        { id: '3', name: 'Bike Share Route', type: 'bike', from: 'University', to: 'Tech Park', duration: '20 min', co2Saved: '3.0 kg', frequency: 'On-demand' },
        { id: '4', name: 'Electric Shuttle', type: 'shuttle', from: 'Mall', to: 'Residential Area', duration: '15 min', co2Saved: '1.8 kg', frequency: 'Every 15 min' }
      ]);
    } else {
      res.status(500).json({ error: 'Failed to fetch transport routes' });
    }
  }
});

app.get('/api/transport/vehicles', async (req, res) => {
  try {
    const [vehicles] = await db.query(`
      SELECT 
        id,
        vehicle_type as type,
        make,
        model,
        capacity as count,
        base_price,
        price_per_km,
        co2_reduction_percent as co2Reduction,
        images
      FROM vehicles 
      WHERE status = 'active' AND available = TRUE
    `);
    
    // Transform to match expected format
    if (vehicles && Array.isArray(vehicles)) {
      const formattedVehicles = vehicles.map(v => {
        let imageUrl = '🚗';
        if (v.images) {
          try {
            const parsed = typeof v.images === 'string' ? JSON.parse(v.images) : v.images;
            imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
          } catch (e) {
            // If parsing fails, use default
          }
        }
        
        return {
          id: v.id,
          type: v.type,
          count: v.count || 1,
          co2Reduction: v.co2Reduction ? `${v.co2Reduction}%` : '0%',
          image: imageUrl
        };
      });
      
      res.json(formattedVehicles);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

app.get('/api/transport/stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM ride_bookings WHERE status = 'completed') as totalRides,
        (SELECT COALESCE(SUM(co2_saved), 0) FROM ride_bookings WHERE status = 'completed') as co2Saved,
        (SELECT COUNT(DISTINCT rider_id) FROM ride_bookings) as activeUsers,
        (SELECT COUNT(DISTINCT location) FROM vehicles WHERE status = 'active') as routesCovered
    `);
    
    const stats = rows && rows.length > 0 ? rows[0] : {};
    
    res.json({
      totalRides: stats.totalRides ? `${(stats.totalRides / 1000).toFixed(1)}M` : '1.2M',
      co2Saved: stats.co2Saved ? `${(stats.co2Saved / 1000).toFixed(0)} tons` : '850 tons',
      activeUsers: stats.activeUsers ? stats.activeUsers.toLocaleString() : '45,000',
      routesCovered: stats.routesCovered || 120
    });
  } catch (error) {
    console.error('Error fetching transport stats:', error);
    res.json({
      totalRides: '1.2M',
      co2Saved: '850 tons',
      activeUsers: '45,000',
      routesCovered: 120
    });
  }
});

// ==================== WASTE EXCHANGE ROUTES ====================
app.get('/api/waste/listings', async (req, res) => {
  try {
    const listings = await db.query(`
      SELECT 
        wl.id,
        wl.title,
        wl.category,
        CONCAT(wl.quantity, ' ', wl.unit) as quantity,
        wl.location,
        COALESCE(u.name, 'Anonymous') as seller,
        COALESCE(u.email, '') as sellerEmail,
        COALESCE(u.phone, '') as sellerPhone,
        CONCAT('₹', wl.price_per_unit, '/', wl.unit) as price,
        wl.description,
        wl.status
      FROM waste_listings wl
      LEFT JOIN users u ON wl.seller_id = u.id
      WHERE wl.status = 'active' 
      ORDER BY wl.created_at DESC
    `);
    res.json(Array.isArray(listings) ? listings : []);
  } catch (error) {
    console.error('Error fetching waste listings:', error);
    res.json([]); // Return empty array instead of error
  }
});

app.get('/api/waste/categories', async (req, res) => {
  try {
    const [categories] = await db.query(`
      SELECT 
        wc.id,
        wc.name,
        wc.icon,
        COALESCE(COUNT(wl.id), 0) as count
      FROM waste_categories wc
      LEFT JOIN waste_listings wl ON wc.name LIKE CONCAT('%', wl.category, '%') AND wl.status = 'active'
      GROUP BY wc.id, wc.name, wc.icon
      ORDER BY wc.display_order ASC
    `);
    res.json(Array.isArray(categories) ? categories : []);
  } catch (error) {
    // Return fallback data if table doesn't exist (expected during initial setup)
    if (error.code === 'ER_NO_SUCH_TABLE') {
      res.json([
        { id: '1', name: 'Paper & Cardboard', icon: '📄', count: 0 },
        { id: '2', name: 'Metals', icon: '🔧', count: 0 },
        { id: '3', name: 'Plastics', icon: '♻️', count: 0 },
        { id: '4', name: 'Electronics', icon: '📱', count: 0 },
        { id: '5', name: 'Organic', icon: '🌿', count: 0 },
        { id: '6', name: 'Glass', icon: '🫙', count: 0 }
      ]);
    } else {
      console.error('Error fetching waste categories:', error);
      res.json([]); // Return empty array instead of error
    }
  }
});

app.get('/api/waste/stats', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM waste_listings WHERE status = 'active') as totalListings,
        (SELECT COUNT(DISTINCT seller_id) FROM waste_listings WHERE status = 'active') as activeSellers,
        (SELECT COALESCE(SUM(quantity), 0) FROM waste_listings WHERE status = 'active') as totalWaste
    `);
    const stats = rows && rows.length > 0 ? rows[0] : {};
    
    res.json({
      totalListings: stats.totalListings || 0,
      wasteExchanged: stats.totalWaste ? `${(stats.totalWaste / 1000).toFixed(1)} tons` : '12,500 tons',
      co2Prevented: '8,200 tons',
      activeSellers: stats.activeSellers || 0
    });
  } catch (error) {
    console.error('Error fetching waste stats:', error);
    res.json({
      totalListings: 0,
      wasteExchanged: '12,500 tons',
      co2Prevented: '8,200 tons',
      activeSellers: 0
    });
  }
});

app.post('/api/waste/listings', async (req, res) => {
  try {
    const { title, category, quantity, location, price, description, seller_id } = req.body;
    const listingId = uuidv4();
    
    // Parse quantity and price
    const quantityMatch = quantity.match(/(\d+\.?\d*)\s*(\w+)/);
    const qty = quantityMatch ? parseFloat(quantityMatch[1]) : 0;
    const unit = quantityMatch ? quantityMatch[2] : 'kg';
    
    const priceMatch = price.match(/₹?(\d+\.?\d*)/);
    const pricePerUnit = priceMatch ? parseFloat(priceMatch[1]) : 0;
    
    await db.query(
      `INSERT INTO waste_listings 
       (id, seller_id, title, category, quantity, unit, price_per_unit, location, description, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [listingId, seller_id || 'admin-001', title, category, qty, unit, pricePerUnit, location, description]
    );
    
    res.status(201).json({ 
      id: listingId, 
      ...req.body, 
      status: 'active' 
    });
  } catch (error) {
    console.error('Error creating waste listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// ==================== SOLAR CALCULATOR (AI Mock) ====================
app.post('/api/energy/solar-calculate', (req, res) => {
  const { rooftopArea, monthlyBill, roofType, sunlightExposure, location } = req.body;
  
  // Solar calculation constants
  const COST_PER_WATT = 45;
  const PANEL_WATTAGE = 400;
  const PANEL_SIZE_SQFT = 18;
  const ELECTRICITY_RATE = 8;
  const SYSTEM_EFFICIENCY = 0.85;
  const SUBSIDY_PERCENT = 0.40;
  const CO2_OFFSET_PER_KWH = 0.82;
  
  const roofEfficiency = { flat: 0.90, sloped: 1.0, metal: 0.95, tile: 0.85, complex: 0.75 };
  const sunHours = { excellent: 6.5, good: 5.5, moderate: 4.5, limited: 3.5 };
  
  const efficiency = roofEfficiency[roofType] || 0.9;
  const hours = sunHours[sunlightExposure] || 5.5;
  
  // Calculate system requirements
  const monthlyConsumption = monthlyBill / ELECTRICITY_RATE;
  const dailyConsumption = monthlyConsumption / 30;
  const effectiveSunHours = hours * efficiency * SYSTEM_EFFICIENCY;
  const requiredKw = dailyConsumption / effectiveSunHours;
  
  const panelsNeeded = Math.ceil((requiredKw * 1000) / PANEL_WATTAGE);
  const maxPanels = Math.floor(rooftopArea / PANEL_SIZE_SQFT);
  const finalPanels = Math.min(panelsNeeded, maxPanels);
  const systemKw = (finalPanels * PANEL_WATTAGE) / 1000;
  
  // Costs
  const equipmentCost = systemKw * 1000 * COST_PER_WATT;
  const installationCost = equipmentCost * 0.15;
  const totalCost = equipmentCost + installationCost;
  const subsidyAmount = totalCost * SUBSIDY_PERCENT;
  const netCost = totalCost - subsidyAmount;
  
  // Savings
  const dailyGeneration = systemKw * effectiveSunHours;
  const monthlyGeneration = dailyGeneration * 30;
  const monthlySavings = Math.min(monthlyGeneration, monthlyConsumption) * ELECTRICITY_RATE;
  const annualSavings = monthlySavings * 12 - 5000;
  const paybackYears = netCost / annualSavings;
  
  // Environmental
  const annualCo2Offset = monthlyGeneration * 12 * CO2_OFFSET_PER_KWH;
  
  res.json({
    success: true,
    aiModel: 'ecohub-solar-advisor-v1',
    result: {
      recommendedPanels: finalPanels,
      systemSizeKw: Math.round(systemKw * 100) / 100,
      totalCost: Math.round(totalCost),
      subsidyAmount: Math.round(subsidyAmount),
      netCost: Math.round(netCost),
      monthlyGeneration: Math.round(monthlyGeneration),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      paybackPeriodYears: Math.round(paybackYears * 10) / 10,
      annualCo2Offset: Math.round(annualCo2Offset),
      suitabilityScore: Math.min(100, 70 + (efficiency * 20) + (hours > 5 ? 10 : 0))
    }
  });
});

// ==================== RECAPTCHA VERIFICATION ====================
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || '6LcZ-UcsAAAAAE0VL_FdG31ExAq2n0IT2wfk-L9l';

app.post('/api/security/verify-recaptcha', async (req, res) => {
  const { token, action } = req.body;
  
  if (!token) {
    return res.status(400).json({ success: false, message: 'reCAPTCHA token required' });
  }
  
  try {
    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
      { method: 'POST' }
    );
    
    const data = await response.json();
    
    if (data.success) {
      // Score 0.0 (bot) to 1.0 (human) - we consider >= 0.5 as valid
      const isValid = data.score >= 0.5;
      console.log(`[reCAPTCHA] Action: ${action || 'unknown'}, Score: ${data.score}, Valid: ${isValid}`);
      
      res.json({
        success: isValid,
        score: data.score,
        action: data.action,
        timestamp: data.challenge_ts,
      });
    } else {
      console.log('[reCAPTCHA] Verification failed:', data['error-codes']);
      res.json({
        success: false,
        message: 'reCAPTCHA verification failed',
        errors: data['error-codes'],
      });
    }
  } catch (error) {
    console.error('[reCAPTCHA] Error:', error.message);
    res.status(500).json({ success: false, message: 'reCAPTCHA verification error' });
  }
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await db.query('SELECT 1');
    dbStatus = 'connected';
  } catch (error) {
    dbStatus = 'error';
  }
  
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    services: {
      conservation: 'active',
      energy: 'active',
      transport: 'active',
      waste: 'active',
<<<<<<< HEAD
      solarCalculator: 'active',
      firebaseAuth: 'active',
      reCaptcha: 'active',
      rateLimiting: 'active'
=======
      auth: 'active',
      admin: 'active'
>>>>>>> auth
    }
  });
});

// ==================== DASHBOARD STATS ====================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [userRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as totalUsers,
        (SELECT COUNT(*) FROM users WHERE role = 'business') as totalBusinesses,
        (SELECT COUNT(*) FROM users WHERE role = 'community') as totalCommunities
    `);
    const userStats = userRows && userRows.length > 0 ? userRows[0] : {};
    
    const [conservationRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM campaigns WHERE status IN ('active', 'approved')) as campaigns,
        (SELECT COALESCE(SUM(raised_amount), 0) FROM campaigns) as raised,
        (SELECT COUNT(*) FROM events WHERE status IN ('upcoming', 'approved', 'ongoing')) as events
    `);
    const conservationStats = conservationRows && conservationRows.length > 0 ? conservationRows[0] : {};
    
    const [energyRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM energy_projects WHERE status = 'operational') as projectsActive
    `);
    const energyStats = energyRows && energyRows.length > 0 ? energyRows[0] : {};
    
    const [transportRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM ride_bookings WHERE status = 'completed') as totalRides,
        (SELECT COALESCE(SUM(co2_saved), 0) FROM ride_bookings) as co2Saved
    `);
    const transportStats = transportRows && transportRows.length > 0 ? transportRows[0] : {};
    
    const [wasteRows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM waste_listings WHERE status = 'active') as totalListings,
        (SELECT COUNT(DISTINCT seller_id) FROM waste_listings WHERE status = 'active') as activeSellers
    `);
    const wasteStats = wasteRows && wasteRows.length > 0 ? wasteRows[0] : {};
    
    res.json({
      users: userStats,
      conservation: {
        campaigns: conservationStats.campaigns || 0,
        raised: conservationStats.raised || 0,
        events: conservationStats.events || 0
      },
      energy: {
        totalCapacity: '1,800 MW',
        co2Saved: '2.5M tons',
        homesSupplied: '450,000',
        projectsActive: energyStats.projectsActive || 0
      },
      transport: {
        totalRides: transportStats.totalRides ? `${(transportStats.totalRides / 1000).toFixed(1)}M` : '1.2M',
        co2Saved: transportStats.co2Saved ? `${(transportStats.co2Saved / 1000).toFixed(0)} tons` : '850 tons',
        activeUsers: '45,000',
        routesCovered: 120
      },
      waste: {
        totalListings: wasteStats.totalListings || 0,
        wasteExchanged: '12,500 tons',
        co2Prevented: '8,200 tons',
        activeSellers: wasteStats.activeSellers || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ==================== ERROR HANDLING ====================
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

<<<<<<< HEAD
// ==================== SPA CATCH-ALL ROUTE ====================
// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}
=======
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});
>>>>>>> auth

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   EcoHub Unified Platform - Backend Server');
  console.log('═══════════════════════════════════════════════════════════════');
<<<<<<< HEAD
  console.log(`   Server running on: http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('   All microservices integrated:');
  console.log('      - Conservation API');
  console.log('      - Renewable Energy API');
  console.log('      - Sustainable Transport API');
  console.log('      - Waste Exchange API');
  console.log('      - Firebase Authentication ✓');
  console.log('   Security features:');
  console.log('      - reCAPTCHA v3 ✓');
  console.log('      - Rate Limiting ✓');
=======
  console.log(`   🚀 Server running on: http://localhost:${PORT}`);
  console.log(`   📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('   ✅ All microservices integrated:');
  console.log('      • Authentication API (JWT + Roles)');
  console.log('      • Admin Management API');
  console.log('      • Conservation API');
  console.log('      • Renewable Energy API');
  console.log('      • Sustainable Transport API');
  console.log('      • Waste Exchange API');
  console.log('   📦 Database: MySQL (with fallback to static data)');
>>>>>>> auth
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
});
