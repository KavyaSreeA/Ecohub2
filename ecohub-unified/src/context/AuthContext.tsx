import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// User roles supported in the system
export type UserRole = 'individual' | 'business' | 'community' | 'admin';

// Business profile for business users
interface BusinessProfile {
  id: string;
  businessName: string;
  businessType: string;
  gstNumber?: string;
  msmeRegistration?: string;
  industry?: string;
  employeeCount?: number;
  isVerified: boolean;
}

// Community profile for NGO/organization users
interface CommunityProfile {
  id: string;
  organizationName: string;
  organizationType: 'ngo' | 'community_group' | 'educational' | 'government' | 'other';
  registrationNumber?: string;
  focusAreas: string[];
  volunteerCount?: number;
  isVerified: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status: 'active' | 'suspended' | 'pending';
  businessProfile?: BusinessProfile;
  communityProfile?: CommunityProfile;
  impactScore?: number;
  carbonSaved?: number;
  createdAt?: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  // Business fields
  businessName?: string;
  businessType?: string;
  gstNumber?: string;
  msmeRegistration?: string;
  industry?: string;
  // Community fields
  organizationName?: string;
  organizationType?: string;
  registrationNumber?: string;
  focusAreas?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
  isCommunity: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = '/api/auth';

// Permission mappings for each role
const rolePermissions: Record<UserRole, string[]> = {
  individual: [
    'view:dashboard',
    'book:rides',
    'donate:campaigns',
    'join:events',
    'post:forum',
    'view:waste',
    'view:energy',
  ],
  business: [
    'view:dashboard',
    'book:rides',
    'donate:campaigns',
    'join:events',
    'post:forum',
    'view:waste',
    'view:energy',
    'list:waste',
    'offer:energy',
    'manage:fleet',
    'b2b:matching',
  ],
  community: [
    'view:dashboard',
    'book:rides',
    'donate:campaigns',
    'join:events',
    'post:forum',
    'view:waste',
    'view:energy',
    'create:campaigns',
    'organize:events',
    'manage:volunteers',
    'bulk:bookings',
  ],
  admin: [
    'view:dashboard',
    'admin:dashboard',
    'manage:users',
    'manage:content',
    'view:analytics',
    'approve:content',
    'moderate:forum',
    'system:settings',
  ],
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('ecohub_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Derived state for role checks
  const isAdmin = user?.role === 'admin';
  const isBusiness = user?.role === 'business';
  const isCommunity = user?.role === 'community';

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('ecohub_token');
      if (storedToken) {
        try {
          const response = await fetch(`${API_URL}/verify`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.user);
            setToken(storedToken);
          } else {
            localStorage.removeItem('ecohub_token');
            setToken(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('ecohub_token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, []);

  // Refresh user data from server
  const refreshUser = async (): Promise<void> => {
    if (!token) return;
    
    try {
      const response = await fetch(`${API_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('ecohub_token', data.token);
        return { success: true, message: 'Login successful!' };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        setToken(result.token);
        localStorage.setItem('ecohub_token', result.token);
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecohub_token');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        isBusiness,
        isCommunity,
        login,
        register,
        logout,
        updateUser,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
