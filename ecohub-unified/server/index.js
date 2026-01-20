import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';

// Import database
import db from './config/database.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ==================== STATIC DATA (For backward compatibility during migration) ====================
const staticData = {
  // Conservation Data
  campaigns: [
    { id: '1', title: 'Save the Amazon Rainforest', description: 'Protect 1 million acres of rainforest', goal: 100000, raised: 75000, image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400', category: 'forest', status: 'active' },
    { id: '2', title: 'Ocean Cleanup Initiative', description: 'Remove plastic from Pacific Ocean', goal: 50000, raised: 32000, image: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400', category: 'ocean', status: 'active' },
    { id: '3', title: 'Wildlife Corridor Project', description: 'Create safe passages for wildlife migration', goal: 75000, raised: 45000, image: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400', category: 'wildlife', status: 'active' },
    { id: '4', title: 'Coral Reef Restoration', description: 'Restore damaged coral ecosystems', goal: 60000, raised: 28000, image: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=400', category: 'ocean', status: 'active' }
  ],
  
  forumPosts: [
    { id: '1', title: 'Tips for reducing plastic usage', message: 'Here are my top 10 tips for reducing plastic in daily life...', author: 'EcoWarrior', likes: 45, comments: 12, createdAt: '2024-01-15' },
    { id: '2', title: 'Local conservation groups in Seattle', message: 'Looking for volunteers to join our weekend cleanup initiatives!', author: 'GreenSeattle', likes: 23, comments: 8, createdAt: '2024-01-14' },
    { id: '3', title: 'Success story: Community garden', message: 'Our neighborhood transformed an abandoned lot into a thriving community garden!', author: 'UrbanGardener', likes: 67, comments: 24, createdAt: '2024-01-13' }
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

// ==================== CONSERVATION ROUTES ====================
app.get('/api/conservation/campaigns', async (req, res) => {
  try {
    const [campaigns] = await db.query('SELECT * FROM campaigns WHERE status = "approved"');
    if (campaigns.length === 0) {
      res.json(staticData.campaigns);
    } else {
      res.json(campaigns);
    }
  } catch (error) {
    res.json(staticData.campaigns);
  }
});

app.get('/api/conservation/campaigns/:id', async (req, res) => {
  try {
    const [campaigns] = await db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
    if (campaigns.length === 0) {
      const campaign = staticData.campaigns.find(c => c.id === req.params.id);
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
      res.json(campaign);
    } else {
      res.json(campaigns[0]);
    }
  } catch (error) {
    const campaign = staticData.campaigns.find(c => c.id === req.params.id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  }
});

app.get('/api/conservation/forum', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM forum_posts WHERE status = "approved" ORDER BY created_at DESC');
    if (posts.length === 0) {
      res.json(staticData.forumPosts);
    } else {
      res.json(posts);
    }
  } catch (error) {
    res.json(staticData.forumPosts);
  }
});

app.get('/api/conservation/events', async (req, res) => {
  try {
    const [events] = await db.query('SELECT * FROM events WHERE status = "approved" ORDER BY event_date ASC');
    if (events.length === 0) {
      res.json(staticData.events);
    } else {
      res.json(events);
    }
  } catch (error) {
    res.json(staticData.events);
  }
});

app.get('/api/conservation/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM campaigns WHERE status = 'approved') as totalCampaigns,
        (SELECT COALESCE(SUM(current_amount), 0) FROM campaigns) as totalRaised,
        (SELECT COUNT(*) FROM events WHERE status = 'approved') as activeEvents,
        (SELECT COUNT(*) FROM forum_posts WHERE status = 'approved') as forumPosts
    `);
    res.json(stats);
  } catch (error) {
    res.json({
      totalCampaigns: staticData.campaigns.length,
      totalRaised: staticData.campaigns.reduce((sum, c) => sum + c.raised, 0),
      activeEvents: staticData.events.length,
      forumPosts: staticData.forumPosts.length
    });
  }
});

// ==================== RENEWABLE ENERGY ROUTES ====================
app.get('/api/energy/sources', (req, res) => {
  res.json(staticData.energySources);
});

app.get('/api/energy/projects', (req, res) => {
  res.json(staticData.energyProjects);
});

app.get('/api/energy/stats', (req, res) => {
  res.json(staticData.energyStats);
});

app.get('/api/energy/providers', async (req, res) => {
  try {
    const [providers] = await db.query('SELECT * FROM energy_providers WHERE is_active = 1');
    res.json(providers);
  } catch (error) {
    res.json([]);
  }
});

// ==================== TRANSPORT ROUTES ====================
app.get('/api/transport/routes', (req, res) => {
  res.json(staticData.routes);
});

app.get('/api/transport/vehicles', async (req, res) => {
  try {
    const [vehicles] = await db.query('SELECT * FROM vehicles WHERE is_active = 1');
    if (vehicles.length === 0) {
      res.json(staticData.vehicles);
    } else {
      res.json(vehicles);
    }
  } catch (error) {
    res.json(staticData.vehicles);
  }
});

app.get('/api/transport/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM rides) as totalRides,
        (SELECT COALESCE(SUM(carbon_saved), 0) FROM rides) as co2Saved,
        (SELECT COUNT(DISTINCT user_id) FROM rides) as activeUsers
    `);
    res.json({
      ...staticData.transportStats,
      ...stats
    });
  } catch (error) {
    res.json(staticData.transportStats);
  }
});

// ==================== WASTE EXCHANGE ROUTES ====================
app.get('/api/waste/listings', async (req, res) => {
  try {
    const [listings] = await db.query('SELECT * FROM waste_listings WHERE status = "available" ORDER BY created_at DESC');
    if (listings.length === 0) {
      res.json(staticData.wasteListings);
    } else {
      res.json(listings);
    }
  } catch (error) {
    res.json(staticData.wasteListings);
  }
});

app.get('/api/waste/categories', (req, res) => {
  res.json(staticData.wasteCategories);
});

app.get('/api/waste/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM waste_listings) as totalListings,
        (SELECT COUNT(DISTINCT user_id) FROM waste_listings) as activeSellers
    `);
    res.json({
      ...staticData.wasteStats,
      ...stats
    });
  } catch (error) {
    res.json(staticData.wasteStats);
  }
});

app.post('/api/waste/listings', async (req, res) => {
  try {
    const { title, category, quantity, location, price, description } = req.body;
    const [result] = await db.query(
      'INSERT INTO waste_listings (title, category, quantity, unit, location, price, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, category, quantity, 'kg', location, price, description, 'available']
    );
    res.status(201).json({ id: result.insertId, ...req.body, status: 'available' });
  } catch (error) {
    const listing = { id: uuidv4(), ...req.body, status: 'available' };
    staticData.wasteListings.push(listing);
    res.status(201).json(listing);
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
      auth: 'active',
      admin: 'active'
    }
  });
});

// ==================== DASHBOARD STATS ====================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [[userStats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as totalUsers,
        (SELECT COUNT(*) FROM users WHERE role = 'business') as totalBusinesses,
        (SELECT COUNT(*) FROM users WHERE role = 'community') as totalCommunities
    `);
    
    res.json({
      users: userStats,
      conservation: {
        campaigns: staticData.campaigns.length,
        raised: staticData.campaigns.reduce((sum, c) => sum + c.raised, 0),
        events: staticData.events.length
      },
      energy: staticData.energyStats,
      transport: staticData.transportStats,
      waste: staticData.wasteStats
    });
  } catch (error) {
    res.json({
      conservation: {
        campaigns: staticData.campaigns.length,
        raised: staticData.campaigns.reduce((sum, c) => sum + c.raised, 0),
        events: staticData.events.length
      },
      energy: staticData.energyStats,
      transport: staticData.transportStats,
      waste: staticData.wasteStats
    });
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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  // Server started successfully
});
