import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'ecohub-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// ==================== IN-MEMORY DATABASE ====================
const db = {
  users: [
    { id: '1', name: 'Demo User', email: 'demo@ecohub.com', password: '$2a$10$XQxBtN8xN8xN8xN8xN8xNeXQxBtN8xN8xN8xN8xN8xN8xN8xN8xN8', role: 'user' }
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
    { id: '1', name: 'Solar Power', icon: '☀️', description: 'Harness the power of the sun', capacity: '500 MW', growth: '+15%' },
    { id: '2', name: 'Wind Energy', icon: '💨', description: 'Clean energy from wind turbines', capacity: '350 MW', growth: '+22%' },
    { id: '3', name: 'Hydroelectric', icon: '💧', description: 'Power from flowing water', capacity: '800 MW', growth: '+8%' },
    { id: '4', name: 'Geothermal', icon: '🌋', description: 'Earth\'s natural heat', capacity: '150 MW', growth: '+12%' }
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
    { id: '1', type: 'Electric Bus', count: 150, co2Reduction: '85%', image: '🚌' },
    { id: '2', type: 'E-Bikes', count: 500, co2Reduction: '100%', image: '🚲' },
    { id: '3', type: 'Electric Cars', count: 200, co2Reduction: '90%', image: '🚗' },
    { id: '4', type: 'Metro Trains', count: 50, co2Reduction: '95%', image: '🚇' }
  ],

  transportStats: {
    totalRides: '1.2M',
    co2Saved: '850 tons',
    activeUsers: '45,000',
    routesCovered: 120
  },

  // Waste Exchange Data
  wasteListings: [
    { id: '1', title: 'Recyclable Cardboard Boxes', category: 'paper', quantity: '50 kg', location: 'Brooklyn, NY', seller: 'PackageCo', price: 'Free', image: '📦', status: 'available' },
    { id: '2', title: 'Scrap Metal - Aluminum', category: 'metal', quantity: '100 kg', location: 'Newark, NJ', seller: 'MetalWorks', price: '$150', image: '🔩', status: 'available' },
    { id: '3', title: 'Organic Compost Material', category: 'organic', quantity: '200 kg', location: 'Queens, NY', seller: 'GreenFarm', price: '$50', image: '🌱', status: 'available' },
    { id: '4', title: 'Electronic Waste - Computers', category: 'e-waste', quantity: '25 units', location: 'Manhattan, NY', seller: 'TechRecycle', price: 'Free pickup', image: '💻', status: 'available' },
    { id: '5', title: 'Glass Bottles - Clear', category: 'glass', quantity: '80 kg', location: 'Hoboken, NJ', seller: 'BottleCo', price: '$30', image: '🍾', status: 'available' },
    { id: '6', title: 'Plastic Containers', category: 'plastic', quantity: '60 kg', location: 'Bronx, NY', seller: 'CleanPlastic', price: 'Free', image: '🥤', status: 'pending' }
  ],

  wasteCategories: [
    { id: '1', name: 'Paper & Cardboard', icon: '📄', count: 156 },
    { id: '2', name: 'Metals', icon: '🔧', count: 89 },
    { id: '3', name: 'Plastics', icon: '♻️', count: 234 },
    { id: '4', name: 'Electronics', icon: '📱', count: 67 },
    { id: '5', name: 'Organic', icon: '🌿', count: 178 },
    { id: '6', name: 'Glass', icon: '🫙', count: 92 }
  ],

  wasteStats: {
    totalListings: 816,
    wasteExchanged: '12,500 tons',
    co2Prevented: '8,200 tons',
    activeSellers: 342
  }
};

// ==================== AUTH MIDDLEWARE ====================
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
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), name, email, password: hashedPassword, role: 'user' };
    db.users.push(user);
    
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = db.users.find(u => u.email === email);
    
    if (!user) {
      // For demo purposes, auto-create user on login
      user = { id: uuidv4(), name: email.split('@')[0], email, password: '', role: 'user' };
      db.users.push(user);
    }
    
    // For demo, accept any password for existing users
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, user: { id: decoded.id, email: decoded.email, name: decoded.name } });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ==================== CONSERVATION ROUTES ====================
app.get('/api/conservation/campaigns', (req, res) => {
  res.json(db.campaigns);
});

app.get('/api/conservation/campaigns/:id', (req, res) => {
  const campaign = db.campaigns.find(c => c.id === req.params.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
  res.json(campaign);
});

app.get('/api/conservation/forum', (req, res) => {
  res.json(db.forumPosts);
});

app.get('/api/conservation/events', (req, res) => {
  res.json(db.events);
});

app.get('/api/conservation/stats', (req, res) => {
  res.json({
    totalCampaigns: db.campaigns.length,
    totalRaised: db.campaigns.reduce((sum, c) => sum + c.raised, 0),
    activeEvents: db.events.length,
    forumPosts: db.forumPosts.length
  });
});

// ==================== RENEWABLE ENERGY ROUTES ====================
app.get('/api/energy/sources', (req, res) => {
  res.json(db.energySources);
});

app.get('/api/energy/projects', (req, res) => {
  res.json(db.energyProjects);
});

app.get('/api/energy/stats', (req, res) => {
  res.json(db.energyStats);
});

// ==================== TRANSPORT ROUTES ====================
app.get('/api/transport/routes', (req, res) => {
  res.json(db.routes);
});

app.get('/api/transport/vehicles', (req, res) => {
  res.json(db.vehicles);
});

app.get('/api/transport/stats', (req, res) => {
  res.json(db.transportStats);
});

// ==================== WASTE EXCHANGE ROUTES ====================
app.get('/api/waste/listings', (req, res) => {
  res.json(db.wasteListings);
});

app.get('/api/waste/categories', (req, res) => {
  res.json(db.wasteCategories);
});

app.get('/api/waste/stats', (req, res) => {
  res.json(db.wasteStats);
});

app.post('/api/waste/listings', (req, res) => {
  const listing = { id: uuidv4(), ...req.body, status: 'available' };
  db.wasteListings.push(listing);
  res.status(201).json(listing);
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    services: {
      conservation: 'active',
      energy: 'active',
      transport: 'active',
      waste: 'active'
    }
  });
});

// ==================== DASHBOARD STATS ====================
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    conservation: {
      campaigns: db.campaigns.length,
      raised: db.campaigns.reduce((sum, c) => sum + c.raised, 0),
      events: db.events.length
    },
    energy: db.energyStats,
    transport: db.transportStats,
    waste: db.wasteStats
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🌿 ═══════════════════════════════════════════════════════════');
  console.log('   EcoHub Unified Platform - Backend Server');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   🚀 Server running on: http://localhost:${PORT}`);
  console.log(`   📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('   ✅ All microservices integrated:');
  console.log('      • Conservation API');
  console.log('      • Renewable Energy API');
  console.log('      • Sustainable Transport API');
  console.log('      • Waste Exchange API');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
});
