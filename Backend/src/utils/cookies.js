import { env } from '../config/env.js';
import { toMs } from './duration.js';

const base = {
  httpOnly: true, // JavaScript can't read it (blocks XSS token theft)
  secure: env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // not sent on cross-site POSTs (CSRF defence)
};

export const accessCookieOptions = {
  ...base,
  path: '/',
  maxAge: toMs(env.ACCESS_TOKEN_EXPIRY),
};

// Scoped path: the browser sends this cookie ONLY to the refresh endpoint,
// so it isn't exposed on every API call.
export const refreshCookieOptions = {
  ...base,
  path: '/api/v1/users/refresh-token',
  maxAge: toMs(env.REFRESH_TOKEN_EXPIRY),
};
