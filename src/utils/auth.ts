import type { UserRole } from '../types';

const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email?: string | null) =>
  Boolean(email && adminEmails.includes(email.trim().toLowerCase()));

export const resolveUserRole = (email?: string | null, role?: string | null): UserRole => {
  if (role === 'admin' || isAdminEmail(email)) {
    return 'admin';
  }

  return 'customer';
};
