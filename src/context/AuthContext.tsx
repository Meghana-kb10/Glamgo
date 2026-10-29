import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { glamgoApi, getAuthToken, setAuthToken } from '../services/apiClient';
import { authService } from '../services/authService';

export type UserRole = 'CUSTOMER' | 'PROFESSIONAL' | 'VENDOR' | 'ADMIN';

export interface AuthUser {
  id: string;
  email: string | null;
  fullName: string;
  roles: UserRole[];
  avatarUrl?: string | null;
  phone?: string | null;
  preferredGender?: 'female' | 'male' | 'none';
  city?: string;
  pincode?: string;
  isNewUser?: boolean;
}

interface SignupData {
  fullName: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  loginWithAuthUser: (authUser: AuthUser, token: string) => void;
  updateUser: (data: Partial<AuthUser>) => void;
  logout: () => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeRole, setActiveRole] = useState<UserRole>('CUSTOMER');

  // Rehydrate session from stored JWT on initial mount
  useEffect(() => {
    let isMounted = true;

    async function rehydrateSession() {
      const storedToken = getAuthToken();
      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await glamgoApi.auth.getMe();
        if (isMounted && response.data?.user) {
          const u = response.data.user;
          const authUser: AuthUser = {
            id: u.id,
            email: u.email,
            fullName: u.fullName || u.full_name,
            roles: u.roles || ['CUSTOMER'],
            avatarUrl: u.avatarUrl || u.avatar_url,
            phone: u.phone,
          };
          setUser(authUser);
          setToken(storedToken);
          if (authUser.roles?.length) {
            setActiveRole(authUser.roles[0]);
          }
        }
      } catch {
        // If stored token is invalid or expired, clear it
        if (isMounted) {
          setAuthToken(null);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    rehydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await glamgoApi.auth.login({ email, password });
      const rawUser = response.data?.user;
      const receivedToken = response.data?.token;

      if (rawUser && receivedToken) {
        const authUser: AuthUser = {
          id: rawUser.id,
          email: rawUser.email,
          fullName: rawUser.fullName || rawUser.full_name,
          roles: rawUser.roles || ['CUSTOMER'],
          avatarUrl: rawUser.avatarUrl || rawUser.avatar_url,
          phone: rawUser.phone,
        };
        setUser(authUser);
        setToken(receivedToken);
        setAuthToken(receivedToken);
        if (authUser.roles?.length) {
          setActiveRole(authUser.roles[0]);
        }
        return { success: true };
      }
      return { success: false, error: 'Authentication failed. Please verify credentials.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to sign in.' };
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const response = await glamgoApi.auth.signup(data);
      const rawUser = response.data?.user;
      const receivedToken = response.data?.token;

      if (rawUser && receivedToken) {
        const authUser: AuthUser = {
          id: rawUser.id,
          email: rawUser.email,
          fullName: rawUser.fullName || rawUser.full_name,
          roles: rawUser.roles || [data.role || 'CUSTOMER'],
          avatarUrl: rawUser.avatarUrl || rawUser.avatar_url,
          phone: rawUser.phone,
        };
        setUser(authUser);
        setToken(receivedToken);
        setAuthToken(receivedToken);
        if (authUser.roles?.length) {
          setActiveRole(authUser.roles[0]);
        }
        return { success: true };
      }
      return { success: false, error: 'Account creation failed.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to create account.' };
    }
  }, []);

  const loginWithAuthUser = useCallback((authUser: AuthUser, receivedToken: string) => {
    setUser(authUser);
    setToken(receivedToken);
    setAuthToken(receivedToken);
    if (authUser.roles?.length) {
      setActiveRole(authUser.roles[0]);
    }
  }, []);

  const updateUser = useCallback((updated: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  }, []);

  const logout = useCallback(() => {
    glamgoApi.auth.logout();
    authService.logout();
    try {
      localStorage.removeItem('glamgo_booking_draft');
      localStorage.removeItem('glamgo_saved_addresses');
      localStorage.removeItem('glamgo_cart_service');
      localStorage.removeItem('glamgo_cart_products');
      localStorage.removeItem('glamgo_auth_token');
      localStorage.removeItem('glamgo_auth_user');
    } catch {
      // Ignored
    }
    setToken(null);
    setUser(null);
    setActiveRole('CUSTOMER');
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        signup,
        loginWithAuthUser,
        updateUser,
        logout,
        activeRole,
        setActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
