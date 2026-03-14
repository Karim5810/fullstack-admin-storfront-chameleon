import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { isSupabaseConfigured, supabase } from '../supabaseClient';
import { api } from '../api';
import { resolveUserRole } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'alrayan-demo-user';

const buildDemoUser = (email: string, name?: string): User => ({
  id: `demo-${email.toLowerCase()}`,
  email,
  name: name?.trim() || email.split('@')[0] || 'مستخدم الريان',
  role: resolveUserRole(email, 'customer'),
  createdAt: new Date().toISOString(),
});

const loadDemoUser = (): User | null => {
  try {
    const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as User) : null;
  } catch {
    return null;
  }
};

const persistDemoUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(user));
    return;
  }

  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    const nextUser = await api.users.getCurrent();
    setUser(nextUser);
    return nextUser;
  };

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(loadDemoUser());
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    let isRefreshing = false;

    const safeRefresh = async () => {
      // Guard against concurrent refresh calls stacking up
      if (isRefreshing || !isMounted) return;
      isRefreshing = true;
      setIsLoading(true);
      try {
        await refreshUser();
      } catch {
        if (isMounted) setUser(null);
      } finally {
        isRefreshing = false;
        if (isMounted) setIsLoading(false);
      }
    };

    void safeRefresh();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // TOKEN_REFRESHED is an internal Supabase housekeeping event —
      // calling refreshUser() here creates a loop:
      //   refreshUser() → session touched → TOKEN_REFRESHED → refreshUser() → …
      // INITIAL_SESSION is already handled by the safeRefresh() call above,
      // so there's no need to react to it a second time.
      if (!isMounted || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        return;
      }

      void safeRefresh();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        const demoUser = buildDemoUser(email);
        persistDemoUser(demoUser);
        setUser(demoUser);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      const nextRole = resolveUserRole(email, 'customer');

      if (!isSupabaseConfigured()) {
        const demoUser = buildDemoUser(email, name);
        persistDemoUser(demoUser);
        setUser(demoUser);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: nextRole,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        await api.profiles.upsert(data.user.id, {
          id: data.user.id,
          email: data.user.email ?? email,
          name,
          role: nextRole,
          createdAt: data.user.created_at ?? new Date().toISOString(),
        });
      }

      await refreshUser();
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        persistDemoUser(null);
        setUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      throw new Error('لا يوجد مستخدم مسجل حاليا.');
    }

    setIsLoading(true);

    try {
      if (!isSupabaseConfigured()) {
        const nextUser = {
          ...user,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        persistDemoUser(nextUser);
        setUser(nextUser);
        return nextUser;
      }

      const nextUser = await api.users.updateProfile(user.id, data);
      setUser(nextUser);
      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};