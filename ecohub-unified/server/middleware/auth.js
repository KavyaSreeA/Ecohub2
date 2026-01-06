import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecohub-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account suspended. Please contact support.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Optional authentication (for public routes that can have enhanced features for logged-in users)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecohub-secret-key');
      const user = await User.findById(decoded.userId);
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    } catch (error) {
      // Token invalid, but that's okay for optional auth
    }
  }
  next();
};

// Check if user has admin role
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

// Check if user has one of the allowed roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }

    next();
  };
};

// Check specific permissions based on role and action
const hasPermission = (action) => {
  const permissions = {
    // Individual permissions
    individual: [
      'book_ride', 'donate', 'join_event', 'use_exchange', 'forum_post',
      'view_dashboard', 'edit_profile'
    ],
    // Business permissions (includes individual)
    business: [
      'book_ride', 'donate', 'join_event', 'use_exchange', 'forum_post',
      'view_dashboard', 'edit_profile',
      'list_waste', 'offer_energy', 'fleet_management', 'b2b_matching',
      'business_analytics'
    ],
    // Community permissions (includes individual)
    community: [
      'book_ride', 'donate', 'join_event', 'use_exchange', 'forum_post',
      'view_dashboard', 'edit_profile',
      'create_campaign', 'organize_event', 'manage_volunteers',
      'community_analytics'
    ],
    // Admin has all permissions
    admin: ['*']
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userPermissions = permissions[req.user.role] || [];
    
    if (userPermissions.includes('*') || userPermissions.includes(action)) {
      next();
    } else {
      return res.status(403).json({ 
        message: `Permission denied: ${action}` 
      });
    }
  };
};

// Simple rate limiting implementation (no external dependency)
const rateLimitStore = new Map();

const createRateLimiter = (windowMs, maxRequests, message) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old entries
    if (!rateLimitStore.has(ip)) {
      rateLimitStore.set(ip, []);
    }
    
    const requests = rateLimitStore.get(ip).filter(time => time > windowStart);
    
    if (requests.length >= maxRequests) {
      return res.status(429).json(message);
    }
    
    requests.push(now);
    rateLimitStore.set(ip, requests);
    next();
  };
};

const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  { message: 'Too many login attempts. Please try again after 15 minutes.' }
);

const apiLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  100, // 100 requests per minute
  { message: 'Too many requests. Please slow down.' }
);

export {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireRole,
  hasPermission,
  authLimiter,
  apiLimiter
};
