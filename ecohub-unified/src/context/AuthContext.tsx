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

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

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
        login,
        loginWithGoogle,
        register,
        logout,
        updateUser,
        forgotPassword,
        getToken,
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
