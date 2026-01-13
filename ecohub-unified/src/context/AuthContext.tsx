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

  // Verify token on mount - works with cookies (httpOnly) or localStorage (fallback)
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('ecohub_token');
      
      try {
        // Try to verify using cookies (preferred) or Authorization header (fallback)
        const headers: HeadersInit = {};
        if (storedToken) {
          headers['Authorization'] = `Bearer ${storedToken}`;
        }
        
        const response = await fetch(`${API_URL}/verify`, {
          credentials: 'include', // Important: Send cookies with request
          headers,
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            // Keep token in state if we have it, but cookies are primary
            if (storedToken) {
              setToken(storedToken);
            }
          } else {
            // Token invalid, clear everything
            localStorage.removeItem('ecohub_token');
            setToken(null);
            setUser(null);
          }
        } else {
          // Not authenticated, clear everything
          localStorage.removeItem('ecohub_token');
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('ecohub_token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, []);

  // Refresh user data from server
  const refreshUser = async (): Promise<void> => {
    try {
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/verify`, {
        credentials: 'include', // Send cookies
        headers,
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        credentials: 'include', // Important: Send and receive cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        // Token is now stored in httpOnly cookie, but keep in localStorage for backward compatibility
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('ecohub_token', data.token);
        }
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
        credentials: 'include', // Important: Send and receive cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        // Token is now stored in httpOnly cookie, but keep in localStorage for backward compatibility
        if (result.token) {
          setToken(result.token);
          localStorage.setItem('ecohub_token', result.token);
        }
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout to clear httpOnly cookie
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include', // Send cookies
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear frontend state regardless of backend response
      setUser(null);
      setToken(null);
      localStorage.removeItem('ecohub_token');
    }
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
