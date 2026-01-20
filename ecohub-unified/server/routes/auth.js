import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import BusinessProfile from '../models/BusinessProfile.js';
import CommunityProfile from '../models/CommunityProfile.js';
import { authenticateToken, authLimiter } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role = 'individual',
      phone,
      // Business fields
      businessProfile,
      // Community fields
      communityProfile
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Validate role
    const validRoles = ['individual', 'business', 'community'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      status: 'active'
    });

    // Create profile based on role
    if (role === 'business' && businessProfile) {
      if (!businessProfile.business_name || !businessProfile.business_type) {
        return res.status(400).json({ 
          message: 'Business name and type are required for business accounts' 
        });
      }
      await BusinessProfile.create(user.id, businessProfile);
    }

    if (role === 'community' && communityProfile) {
      if (!communityProfile.organization_name || !communityProfile.organization_type) {
        return res.status(400).json({ 
          message: 'Organization name and type are required for community accounts' 
        });
      }
      await CommunityProfile.create(user.id, communityProfile);
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'ecohub-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user with profile
    const fullUser = await User.getWithProfile(user.id);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        avatar: fullUser.avatar,
        businessProfile: fullUser.businessProfile,
        communityProfile: fullUser.communityProfile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if suspended
    if (user.status === 'suspended') {
      return res.status(403).json({ 
        message: 'Your account has been suspended. Please contact support.' 
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'ecohub-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Get user with profile
    const fullUser = await User.getWithProfile(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        avatar: fullUser.avatar,
        businessProfile: fullUser.businessProfile,
        communityProfile: fullUser.communityProfile,
        impact: fullUser.impact
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// Verify token / Get current user
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const fullUser = await User.getWithProfile(req.user.id);
    
    res.json({
      user: {
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        avatar: fullUser.avatar,
        phone: fullUser.phone,
        status: fullUser.status,
        businessProfile: fullUser.businessProfile,
        communityProfile: fullUser.communityProfile,
        impact: fullUser.impact
      }
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ message: 'Failed to verify token' });
  }
});

// Update profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, avatar, businessProfile, communityProfile } = req.body;

    // Update user
    await User.update(req.user.id, { name, phone, avatar });

    // Update business profile if applicable
    if (req.user.role === 'business' && businessProfile) {
      const existingProfile = await BusinessProfile.findByUserId(req.user.id);
      if (existingProfile) {
        await BusinessProfile.update(existingProfile.id, businessProfile);
      }
    }

    // Update community profile if applicable
    if (req.user.role === 'community' && communityProfile) {
      const existingProfile = await CommunityProfile.findByUserId(req.user.id);
      if (existingProfile) {
        await CommunityProfile.update(existingProfile.id, communityProfile);
      }
    }

    const fullUser = await User.getWithProfile(req.user.id);

    res.json({
      message: 'Profile updated successfully',
      user: fullUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Change password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get full user with password
    const user = await User.findByEmail(req.user.email);
    
    // Verify current password
    const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await User.changePassword(req.user.id, newPassword);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// Logout (client-side, just for logging)
router.post('/logout', authenticateToken, (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // This endpoint can be used for logging/analytics
  res.json({ message: 'Logged out successfully' });
});

export default router;
