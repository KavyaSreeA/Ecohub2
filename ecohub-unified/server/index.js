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

// Static data has been moved to database - see database/seed_data.sql

// ==================== CONSERVATION ROUTES ====================
app.get('/api/conservation/campaigns', async (req, res) => {
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
      WHERE status IN ('active', 'approved') 
      ORDER BY created_at DESC
    `);
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
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
    res.json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
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
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/conservation/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM campaigns WHERE status IN ('active', 'approved')) as totalCampaigns,
        (SELECT COALESCE(SUM(raised_amount), 0) FROM campaigns) as totalRaised,
        (SELECT COUNT(*) FROM events WHERE status IN ('upcoming', 'approved', 'ongoing')) as activeEvents,
        (SELECT COUNT(*) FROM forum_posts WHERE status = 'approved') as forumPosts
    `);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching conservation stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ==================== RENEWABLE ENERGY ROUTES ====================
app.get('/api/energy/sources', async (req, res) => {
  try {
    const [sources] = await db.query(`
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
    res.json(sources);
  } catch (error) {
    console.error('Error fetching energy sources:', error);
    res.status(500).json({ error: 'Failed to fetch energy sources' });
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
    console.error('Error fetching energy projects:', error);
    res.status(500).json({ error: 'Failed to fetch energy projects' });
  }
});

app.get('/api/energy/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM energy_projects WHERE status = 'operational') as projectsActive,
        (SELECT COUNT(*) FROM energy_sources) as totalSources
    `);
    
    // Calculate aggregated stats
    const [sources] = await db.query('SELECT capacity FROM energy_sources');
    const totalCapacity = sources.reduce((sum, s) => {
      const num = parseFloat(s.capacity) || 0;
      return sum + num;
    }, 0);
    
    res.json({
      totalCapacity: `${totalCapacity.toLocaleString()} MW`,
      co2Saved: '2.5M tons',
      homesSupplied: '450,000',
      projectsActive: stats.projectsActive || 0
    });
  } catch (error) {
    console.error('Error fetching energy stats:', error);
    res.status(500).json({ error: 'Failed to fetch energy stats' });
  }
});

app.get('/api/energy/companies/:sourceName', async (req, res) => {
  try {
    const [companies] = await db.query(`
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
    
    if (companies.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.json(companies[0]);
  } catch (error) {
    console.error('Error fetching energy company:', error);
    res.status(500).json({ error: 'Failed to fetch energy company' });
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
    console.error('Error fetching transport routes:', error);
    res.status(500).json({ error: 'Failed to fetch transport routes' });
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
        co2_reduction_percent as co2Reduction,
        images
      FROM vehicles 
      WHERE status = 'active' AND available = TRUE
    `);
    
    // Transform to match expected format
    const formattedVehicles = vehicles.map(v => ({
      id: v.id,
      type: v.type,
      count: v.count || 1,
      co2Reduction: v.co2Reduction ? `${v.co2Reduction}%` : '0%',
      image: v.images ? (Array.isArray(v.images) ? v.images[0] : JSON.parse(v.images)[0]) : '🚗'
    }));
    
    res.json(formattedVehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

app.get('/api/transport/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM ride_bookings WHERE status = 'completed') as totalRides,
        (SELECT COALESCE(SUM(co2_saved), 0) FROM ride_bookings WHERE status = 'completed') as co2Saved,
        (SELECT COUNT(DISTINCT rider_id) FROM ride_bookings) as activeUsers,
        (SELECT COUNT(DISTINCT city) FROM vehicles WHERE status = 'active') as routesCovered
    `);
    
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
    const [listings] = await db.query(`
      SELECT 
        wl.id,
        wl.title,
        wl.category,
        CONCAT(wl.quantity, ' ', wl.unit) as quantity,
        wl.location,
        u.name as seller,
        u.email as sellerEmail,
        u.phone as sellerPhone,
        CONCAT('₹', wl.price_per_unit, '/', wl.unit) as price,
        wl.description,
        wl.status
      FROM waste_listings wl
      LEFT JOIN users u ON wl.seller_id = u.id
      WHERE wl.status = 'active' 
      ORDER BY wl.created_at DESC
    `);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching waste listings:', error);
    res.status(500).json({ error: 'Failed to fetch waste listings' });
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
    res.json(categories);
  } catch (error) {
    console.error('Error fetching waste categories:', error);
    res.status(500).json({ error: 'Failed to fetch waste categories' });
  }
});

app.get('/api/waste/stats', async (req, res) => {
  try {
    const [[stats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM waste_listings WHERE status = 'active') as totalListings,
        (SELECT COUNT(DISTINCT seller_id) FROM waste_listings WHERE status = 'active') as activeSellers,
        (SELECT COALESCE(SUM(quantity), 0) FROM waste_listings WHERE status = 'active') as totalWaste
    `);
    
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
    
    const [[conservationStats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM campaigns WHERE status IN ('active', 'approved')) as campaigns,
        (SELECT COALESCE(SUM(raised_amount), 0) FROM campaigns) as raised,
        (SELECT COUNT(*) FROM events WHERE status IN ('upcoming', 'approved', 'ongoing')) as events
    `);
    
    const [[energyStats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM energy_projects WHERE status = 'operational') as projectsActive
    `);
    
    const [[transportStats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM ride_bookings WHERE status = 'completed') as totalRides,
        (SELECT COALESCE(SUM(co2_saved), 0) FROM ride_bookings) as co2Saved
    `);
    
    const [[wasteStats]] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM waste_listings WHERE status = 'active') as totalListings,
        (SELECT COUNT(DISTINCT seller_id) FROM waste_listings WHERE status = 'active') as activeSellers
    `);
    
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

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
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
  console.log('      • Authentication API (JWT + Roles)');
  console.log('      • Admin Management API');
  console.log('      • Conservation API');
  console.log('      • Renewable Energy API');
  console.log('      • Sustainable Transport API');
  console.log('      • Waste Exchange API');
  console.log('   📦 Database: MySQL (with fallback to static data)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
});
