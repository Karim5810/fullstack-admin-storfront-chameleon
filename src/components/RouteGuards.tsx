import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { User } from '../types';

// ─── Shared loading spinner ───────────────────────────────────────────────────

const AuthLoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="container py-20 text-center text-(--muted2)">{message}</div>
);

// ─── Core guard primitive ─────────────────────────────────────────────────────

interface GuardProps {
  children: React.ReactElement;
  /** Return a redirect path if access should be denied, or null to allow. */
  authorize: (user: User | null) => string | null;
  loadingMessage: string;
}

const AuthGuard: React.FC<GuardProps> = ({ children, authorize, loadingMessage }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // If we already have a user cached, run the authorization check immediately
  // without waiting for a background refresh — avoids an unnecessary loading flash.
  const redirectTo = authorize(user);

  if (redirectTo !== null) {
    // We know the answer without needing to wait.
    if (!isLoading) {
      return (
        <Navigate
          to={redirectTo}
          replace
          state={redirectTo === '/login' ? { from: location.pathname + location.search } : undefined}
        />
      );
    }

    // We don't have a user yet and are still loading — show the spinner.
    return <AuthLoadingScreen message={loadingMessage} />;
  }

  return children;
};

// ─── Public guards ────────────────────────────────────────────────────────────

export const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <AuthGuard
    loadingMessage="جاري التحقق من الجلسة..."
    authorize={(user) => (user ? null : '/login')}
  >
    {children}
  </AuthGuard>
);

export const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => (
  <AuthGuard
    loadingMessage="جاري التحقق من الصلاحيات..."
    authorize={(user) => {
      if (!user) return '/login';
      if (user.role !== 'admin') return '/account';
      return null;
    }}
  >
    {children}
  </AuthGuard>
);