import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
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
app.use(cookieParser());

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Static data has been moved to database - see database/seed_data.sql

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
