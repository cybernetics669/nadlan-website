/**
 * Auth placeholder for future NextAuth integration.
 * MVP: admin access is gated by env ADMIN_PASSWORD (cookie/session in middleware).
 * Future: replace with NextAuth session; support roles: admin, subscriber-seller, viewer.
 */

export const AUTH_CONFIG = {
  adminPasswordEnv: 'ADMIN_PASSWORD',
  adminSessionCookie: 'nadlan_admin',
  // Future: hardcoded admin emails when NextAuth is enabled
  // adminEmails: ['admin@example.com'],
} as const;

export type FutureRole = 'admin' | 'subscriber-seller' | 'viewer';
