import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '../services/firebase/config';
import {
  fetchUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword as sendResetEmail,
  subscribeToAuthState,
  type AuthProfile,
} from '../services/firebase/auth';

export type AuthState = 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface AuthContextType {
  user: User | null;
  profile: AuthProfile | null;
  authState: AuthState;
  loading: boolean;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [authState, setAuthState] = useState<AuthState>(
    isFirebaseConfigured ? 'AUTH_LOADING' : 'UNAUTHENTICATED'
  );

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    try {
      const userProfile = await fetchUserProfile(user);
      setProfile(userProfile);
    } catch (err) {
      console.error('[CivicLens Auth] Failed to refresh profile:', err);
    }
  }, [user]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setProfile(null);
      setAuthState('UNAUTHENTICATED');
      return;
    }

    const unsubscribe = subscribeToAuthState(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await fetchUserProfile(currentUser);
          setProfile(userProfile);
          setAuthState('AUTHENTICATED');
        } catch (error) {
          console.error('[CivicLens Auth] Error fetching user profile:', error);
          // Fallback profile if Firestore read fails
          setProfile({
            uid: currentUser.uid,
            name: currentUser.displayName ?? 'CivicLens User',
            email: currentUser.email ?? '',
            role: 'citizen',
            isActive: true,
          });
          setAuthState('AUTHENTICATED');
        }
      } else {
        setProfile(null);
        setAuthState('UNAUTHENTICATED');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = useCallback(async (email: string, password: string): Promise<User> => {
    const loggedInUser = await loginUser(email, password);
    setUser(loggedInUser);
    const userProfile = await fetchUserProfile(loggedInUser);
    setProfile(userProfile);
    setAuthState('AUTHENTICATED');
    return loggedInUser;
  }, []);

  const handleRegister = useCallback(
    async (name: string, email: string, password: string): Promise<User> => {
      const newUser = await registerUser(name, email, password);
      setUser(newUser);
      const userProfile = await fetchUserProfile(newUser);
      setProfile(userProfile);
      setAuthState('AUTHENTICATED');
      return newUser;
    },
    []
  );

  const handleLogout = useCallback(async (): Promise<void> => {
    await logoutUser();
    setUser(null);
    setProfile(null);
    setAuthState('UNAUTHENTICATED');
  }, []);

  const handleResetPassword = useCallback(async (email: string): Promise<void> => {
    await sendResetEmail(email);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      authState,
      loading: authState === 'AUTH_LOADING',
      isConfigured: isFirebaseConfigured,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      resetPassword: handleResetPassword,
      refreshProfile,
    }),
    [user, profile, authState, handleLogin, handleRegister, handleLogout, handleResetPassword, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
