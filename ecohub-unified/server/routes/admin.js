import express from 'express';
import db from '../config/database.js';
import User from '../models/User.js';
import BusinessProfile from '../models/BusinessProfile.js';
import CommunityProfile from '../models/CommunityProfile.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);



// =============================================
// DASHBOARD STATS
// =============================================
router.get('/dashboard', async (req, res) => {
  try {
    // User stats
    const userStats = await User.getStats();

    // Pending approvals count
    const pendingCounts = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM business_profiles WHERE verification_status = 'pending') as pending_businesses,
        (SELECT COUNT(*) FROM community_profiles WHERE verification_status = 'pending') as pending_communities,
        (SELECT COUNT(*) FROM campaigns WHERE status = 'pending_approval') as pending_campaigns,
        (SELECT COUNT(*) FROM events WHERE status = 'pending_approval') as pending_events,
        (SELECT COUNT(*) FROM waste_listings WHERE status = 'pending') as pending_listings,
        (SELECT COUNT(*) FROM energy_providers WHERE status = 'pending') as pending_energy,
        (SELECT COUNT(*) FROM vehicles WHERE status = 'pending') as pending_vehicles,
        (SELECT COUNT(*) FROM forum_posts WHERE status = 'pending') as pending_posts
    `);

    // Revenue stats (donations)
    const revenueStats = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN amount ELSE 0 END), 0) as total_donations,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) as today_donations,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN amount ELSE 0 END), 0) as week_donations,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) as month_donations,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as total_transactions
      FROM donations
    `);

    // Impact stats
    const impactStats = await db.query(`
      SELECT 
        COALESCE(SUM(total_co2_saved), 0) as total_co2_saved,
        COALESCE(SUM(total_trees_planted), 0) as total_trees_planted,
        COALESCE(SUM(total_waste_exchanged), 0) as total_waste_exchanged,
        COALESCE(SUM(total_rides_taken), 0) as total_rides_taken,
        COALESCE(SUM(total_events_attended), 0) as total_events_attended,
        COALESCE(SUM(total_volunteer_hours), 0) as total_volunteer_hours
      FROM user_impact
    `);

    // Recent activity
    const recentActivity = await db.query(`
      SELECT al.*, u.name as user_name, u.email as user_email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 20
    `);

    // Daily signups for last 30 days
    const dailySignups = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    res.json({
      users: userStats,
      pending: pendingCounts[0],
      revenue: revenueStats[0],
      impact: impactStats[0],
      recentActivity,
      dailySignups
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// =============================================
// USER MANAGEMENT
// =============================================

// Get all users with pagination and filters
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    const result = await User.getAll({ 
      page: parseInt(page), 
      limit: parseInt(limit), 
      role, 
      status, 
      search 
    });
    res.json(result);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get single user with profile
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.getWithProfile(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, phone, role, status } = req.body;
    
    // Prevent admin from demoting themselves
    if (req.params.id === req.user.id && role && role !== 'admin') {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    const user = await User.update(req.params.id, { name, phone, role, status });
    res.json({ message: 'User updated', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Suspend user
router.post('/users/:id/suspend', async (req, res) => {
  try {
    const { reason } = req.body;
    
    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot suspend yourself' });
    }

    await User.suspend(req.params.id, reason, req.user.id);
    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    console.error('Suspend user error:', error);
    res.status(500).json({ message: 'Failed to suspend user' });
  }
});

// Activate user
router.post('/users/:id/activate', async (req, res) => {
  try {
    await User.activate(req.params.id, req.user.id);
    res.json({ message: 'User activated successfully' });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ message: 'Failed to activate user' });
  }
});

// Change user role
router.post('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['individual', 'business', 'community', 'admin'];
    
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (req.params.id === req.user.id) {
      return res.status(400).json({ message: 'Cannot change your own role' });
    }

    await User.changeRole(req.params.id, role, req.user.id);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ message: 'Failed to change user role' });
  }
});

// =============================================
// CONTENT MODERATION - PENDING APPROVALS
// =============================================

// Get all pending items
router.get('/pending', async (req, res) => {
  try {
    const [businesses, communities, campaigns, events, listings, posts] = await Promise.all([
      BusinessProfile.getPending(1, 10),
      CommunityProfile.getPending(1, 10),
      db.query(`
        SELECT c.*, u.name as organizer_name 
        FROM campaigns c 
        JOIN users u ON c.organizer_id = u.id 
        WHERE c.status = 'pending_approval' 
        ORDER BY c.created_at ASC LIMIT 10
      `),
      db.query(`
        SELECT e.*, u.name as organizer_name 
        FROM events e 
        JOIN users u ON e.organizer_id = u.id 
        WHERE e.status = 'pending_approval' 
        ORDER BY e.created_at ASC LIMIT 10
      `),
      db.query(`
        SELECT wl.*, u.name as seller_name 
        FROM waste_listings wl 
        JOIN users u ON wl.seller_id = u.id 
        WHERE wl.status = 'pending' 
        ORDER BY wl.created_at ASC LIMIT 10
      `),
      db.query(`
        SELECT fp.*, u.name as author_name 
        FROM forum_posts fp 
        JOIN users u ON fp.author_id = u.id 
        WHERE fp.status = 'pending' 
        ORDER BY fp.created_at ASC LIMIT 10
      `)
    ]);

    res.json({
      businesses: businesses.profiles,
      communities: communities.profiles,
      campaigns,
      events,
      listings,
      posts
    });
  } catch (error) {
    console.error('Get pending error:', error);
    res.status(500).json({ message: 'Failed to fetch pending items' });
  }
});

// =============================================
// BUSINESS VERIFICATION
// =============================================

router.get('/businesses/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await BusinessProfile.getPending(parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Get pending businesses error:', error);
    res.status(500).json({ message: 'Failed to fetch pending businesses' });
  }
});

router.post('/businesses/:id/verify', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be verified or rejected' });
    }

    const profile = await BusinessProfile.verify(req.params.id, req.user.id, status, notes);
    
    // Log admin action
    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, status === 'verified' ? 'verify' : 'reject', 'business', req.params.id, notes]);

    res.json({ message: `Business ${status}`, profile });
  } catch (error) {
    console.error('Verify business error:', error);
    res.status(500).json({ message: 'Failed to verify business' });
  }
});

// =============================================
// COMMUNITY VERIFICATION
// =============================================

router.get('/communities/pending', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await CommunityProfile.getPending(parseInt(page), parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Get pending communities error:', error);
    res.status(500).json({ message: 'Failed to fetch pending communities' });
  }
});

router.post('/communities/:id/verify', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be verified or rejected' });
    }

    const profile = await CommunityProfile.verify(req.params.id, req.user.id, status, notes);
    
    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, status === 'verified' ? 'verify' : 'reject', 'community', req.params.id, notes]);

    res.json({ message: `Community ${status}`, profile });
  } catch (error) {
    console.error('Verify community error:', error);
    res.status(500).json({ message: 'Failed to verify community' });
  }
});

// =============================================
// CAMPAIGN APPROVAL
// =============================================

router.get('/campaigns/pending', async (req, res) => {
  try {
    const campaigns = await db.query(`
      SELECT c.*, u.name as organizer_name, u.email as organizer_email
      FROM campaigns c
      JOIN users u ON c.organizer_id = u.id
      WHERE c.status = 'pending_approval'
      ORDER BY c.created_at ASC
    `);
    res.json({ campaigns });
  } catch (error) {
    console.error('Get pending campaigns error:', error);
    res.status(500).json({ message: 'Failed to fetch pending campaigns' });
  }
});

router.post('/campaigns/:id/approve', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE campaigns 
      SET status = 'active', approved_by = ?, approved_at = NOW(), approval_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, 'approve', 'campaign', req.params.id, notes]);

    res.json({ message: 'Campaign approved' });
  } catch (error) {
    console.error('Approve campaign error:', error);
    res.status(500).json({ message: 'Failed to approve campaign' });
  }
});

router.post('/campaigns/:id/reject', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE campaigns 
      SET status = 'rejected', approved_by = ?, approved_at = NOW(), approval_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, 'reject', 'campaign', req.params.id, notes]);

    res.json({ message: 'Campaign rejected' });
  } catch (error) {
    console.error('Reject campaign error:', error);
    res.status(500).json({ message: 'Failed to reject campaign' });
  }
});

// =============================================
// EVENT APPROVAL
// =============================================

router.get('/events/pending', async (req, res) => {
  try {
    const events = await db.query(`
      SELECT e.*, u.name as organizer_name, u.email as organizer_email
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE e.status = 'pending_approval'
      ORDER BY e.created_at ASC
    `);
    res.json({ events });
  } catch (error) {
    console.error('Get pending events error:', error);
    res.status(500).json({ message: 'Failed to fetch pending events' });
  }
});

router.post('/events/:id/approve', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE events 
      SET status = 'upcoming', approved_by = ?, approved_at = NOW(), approval_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, 'approve', 'event', req.params.id, notes]);

    res.json({ message: 'Event approved' });
  } catch (error) {
    console.error('Approve event error:', error);
    res.status(500).json({ message: 'Failed to approve event' });
  }
});

router.post('/events/:id/reject', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE events 
      SET status = 'rejected', approved_by = ?, approved_at = NOW(), approval_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    await db.query(`
      INSERT INTO admin_actions (id, admin_id, action_type, target_type, target_id, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [uuidv4(), req.user.id, 'reject', 'event', req.params.id, notes]);

    res.json({ message: 'Event rejected' });
  } catch (error) {
    console.error('Reject event error:', error);
    res.status(500).json({ message: 'Failed to reject event' });
  }
});

// =============================================
// WASTE LISTING MODERATION
// =============================================

router.get('/listings/pending', async (req, res) => {
  try {
    const listings = await db.query(`
      SELECT wl.*, u.name as seller_name, u.email as seller_email
      FROM waste_listings wl
      JOIN users u ON wl.seller_id = u.id
      WHERE wl.status = 'pending'
      ORDER BY wl.created_at ASC
    `);
    res.json({ listings });
  } catch (error) {
    console.error('Get pending listings error:', error);
    res.status(500).json({ message: 'Failed to fetch pending listings' });
  }
});

router.post('/listings/:id/approve', async (req, res) => {
  try {
    await db.query(`
      UPDATE waste_listings 
      SET status = 'active', moderated_by = ?, moderated_at = NOW()
      WHERE id = ?
    `, [req.user.id, req.params.id]);

    res.json({ message: 'Listing approved' });
  } catch (error) {
    console.error('Approve listing error:', error);
    res.status(500).json({ message: 'Failed to approve listing' });
  }
});

router.post('/listings/:id/reject', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE waste_listings 
      SET status = 'rejected', moderated_by = ?, moderated_at = NOW(), moderation_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    res.json({ message: 'Listing rejected' });
  } catch (error) {
    console.error('Reject listing error:', error);
    res.status(500).json({ message: 'Failed to reject listing' });
  }
});

// =============================================
// FORUM MODERATION
// =============================================

router.get('/posts/pending', async (req, res) => {
  try {
    const posts = await db.query(`
      SELECT fp.*, u.name as author_name, u.email as author_email
      FROM forum_posts fp
      JOIN users u ON fp.author_id = u.id
      WHERE fp.status = 'pending'
      ORDER BY fp.created_at ASC
    `);
    res.json({ posts });
  } catch (error) {
    console.error('Get pending posts error:', error);
    res.status(500).json({ message: 'Failed to fetch pending posts' });
  }
});

router.post('/posts/:id/approve', async (req, res) => {
  try {
    await db.query(`
      UPDATE forum_posts 
      SET status = 'approved', moderated_by = ?, moderated_at = NOW()
      WHERE id = ?
    `, [req.user.id, req.params.id]);

    res.json({ message: 'Post approved' });
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({ message: 'Failed to approve post' });
  }
});

router.post('/posts/:id/reject', async (req, res) => {
  try {
    const { notes } = req.body;
    
    await db.query(`
      UPDATE forum_posts 
      SET status = 'rejected', moderated_by = ?, moderated_at = NOW(), moderation_notes = ?
      WHERE id = ?
    `, [req.user.id, notes, req.params.id]);

    res.json({ message: 'Post rejected' });
  } catch (error) {
    console.error('Reject post error:', error);
    res.status(500).json({ message: 'Failed to reject post' });
  }
});

// =============================================
// ANALYTICS
// =============================================

router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);

    // User growth
    const userGrowth = await db.query(`
      SELECT DATE(created_at) as date, 
             COUNT(*) as total,
             SUM(CASE WHEN role = 'individual' THEN 1 ELSE 0 END) as individuals,
             SUM(CASE WHEN role = 'business' THEN 1 ELSE 0 END) as businesses,
             SUM(CASE WHEN role = 'community' THEN 1 ELSE 0 END) as communities
      FROM users
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);

    // Donation trends
    const donationTrends = await db.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as count,
             SUM(amount) as total_amount
      FROM donations
      WHERE payment_status = 'completed' 
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);

    // Ride stats
    const rideStats = await db.query(`
      SELECT DATE(booked_at) as date,
             COUNT(*) as total_rides,
             SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
             COALESCE(SUM(co2_saved), 0) as co2_saved
      FROM ride_bookings
      WHERE booked_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(booked_at)
      ORDER BY date ASC
    `, [days]);

    // Waste exchange stats
    const wasteStats = await db.query(`
      SELECT DATE(created_at) as date,
             COUNT(*) as new_listings,
             SUM(CASE WHEN status = 'sold' THEN quantity ELSE 0 END) as quantity_exchanged
      FROM waste_listings
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [days]);

    // Top campaigns
    const topCampaigns = await db.query(`
      SELECT c.id, c.title, c.category, c.goal_amount, c.raised_amount,
             ROUND((c.raised_amount / c.goal_amount) * 100, 2) as progress_percent,
             COUNT(d.id) as donor_count
      FROM campaigns c
      LEFT JOIN donations d ON c.id = d.campaign_id AND d.payment_status = 'completed'
      WHERE c.status = 'active'
      GROUP BY c.id
      ORDER BY c.raised_amount DESC
      LIMIT 10
    `);

    res.json({
      userGrowth,
      donationTrends,
      rideStats,
      wasteStats,
      topCampaigns
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// =============================================
// ADMIN ACTION LOGS
// =============================================

router.get('/logs', async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const logs = await db.query(`
      SELECT aa.*, u.name as admin_name, u.email as admin_email
      FROM admin_actions aa
      JOIN users u ON aa.admin_id = u.id
      ORDER BY aa.created_at DESC
      LIMIT ? OFFSET ?
    `, [parseInt(limit), offset]);

    const countResult = await db.query('SELECT COUNT(*) as total FROM admin_actions');

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ message: 'Failed to fetch admin logs' });
  }
});

export default router;
