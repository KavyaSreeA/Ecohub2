import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  auth, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser, 
  signInWithGoogle,
  onAuthChange,
  formatUser,
  getIdToken,
  resetPassword
} from '../services/firebase';
import { config } from '../config/config';

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
<<<<<<< HEAD
  emailVerified?: boolean;
=======
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
>>>>>>> auth
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isBusiness: boolean;
  isCommunity: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
<<<<<<< HEAD
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  getToken: () => Promise<string | null>;
=======
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
>>>>>>> auth
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

<<<<<<< HEAD
=======
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

>>>>>>> auth
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

<<<<<<< HEAD
  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange(async (fbUser) => {
      if (fbUser) {
        // User is signed in
        const formattedUser = formatUser(fbUser);
        setUser(formattedUser);
        setFirebaseUser(fbUser);
        
        // Get and store the ID token
        const idToken = await fbUser.getIdToken();
        setToken(idToken);
        localStorage.setItem('ecohub_token', idToken);
        
        // Sync with backend (optional - creates user in your DB)
        try {
          await syncUserWithBackend(formattedUser, idToken);
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
        }
      } else {
        // User is signed out
        setUser(null);
        setFirebaseUser(null);
        setToken(null);
        localStorage.removeItem('ecohub_token');
      }
      setIsLoading(false);
    });
=======
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
>>>>>>> auth

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

<<<<<<< HEAD
  // Sync user with your backend database
  const syncUserWithBackend = async (user: User, idToken: string) => {
    try {
      await fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        }),
      });
    } catch (error) {
      // Backend sync is optional, don't fail auth if it fails
      console.warn('Backend sync failed:', error);
    }
  };

  // Email/Password Login
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const result = await signInWithEmail(email, password);
    
    if (result.success) {
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: result.error || 'Login failed' };
    }
  };

  // Google Login
  const loginWithGoogle = async (): Promise<{ success: boolean; message: string }> => {
    const result = await signInWithGoogle();
    
    if (result.success) {
      return { success: true, message: 'Login successful!' };
    } else {
      return { success: false, message: result.error || 'Google login failed' };
    }
  };

  // Email/Password Registration
  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const result = await signUpWithEmail(email, password, name);
    
    if (result.success) {
      return { success: true, message: 'Registration successful!' };
    } else {
      return { success: false, message: result.error || 'Registration failed' };
    }
  };

  // Logout
  const logout = async () => {
    await signOutUser();
    setUser(null);
    setFirebaseUser(null);
    setToken(null);
    localStorage.removeItem('ecohub_token');
=======
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
>>>>>>> auth
  };

  // Update local user data
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // Forgot Password
  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const result = await resetPassword(email);
    
    if (result.success) {
      return { success: true, message: 'Password reset email sent!' };
    } else {
      return { success: false, message: result.error || 'Failed to send reset email' };
    }
  };

  // Get fresh token (useful for API calls)
  const getToken = async (): Promise<string | null> => {
    return await getIdToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAdmin,
        isBusiness,
        isCommunity,
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
<<<<<<< HEAD
        forgotPassword,
        getToken,
=======
        hasPermission,
        refreshUser,
>>>>>>> auth
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
