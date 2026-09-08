/**
 * JWT Utility Helper for Skill Path AI Platform
 * Creates, decodes, and validates JWT authentication tokens with expiration claims
 */

const STORAGE_KEY = 'skillpath_jwt_token';
const USER_STORAGE_KEY = 'skillpath_user_profile';

// Helper to base64 encode string (browser compatible)
const base64UrlEncode = (str) => {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

// Helper to base64 decode string
const base64UrlDecode = (str) => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
};

/**
 * Creates a signed JWT token simulation for an official user
 * Token valid for 24 hours (86400 seconds)
 */
export function createMockJwtToken(userObj) {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userObj.id,
    name: userObj.name,
    cadre: userObj.cadre,
    division: userObj.division,
    iat: nowInSeconds,
    exp: nowInSeconds + 86400 // 24 Hour Expiration
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const mockSignature = base64UrlEncode(`mospi_secret_sig_${userObj.id}_${nowInSeconds}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}

/**
 * Decodes JWT token payload without throwing
 */
export function decodeJwtToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payloadJson = base64UrlDecode(parts[1]);
    return JSON.parse(payloadJson);
  } catch (err) {
    console.error("JWT Decode Error:", err);
    return null;
  }
}

/**
 * Checks if JWT token is valid, well-formed, and NOT expired
 */
export function isTokenValid(token) {
  if (!token) return false;
  const payload = decodeJwtToken(token);
  if (!payload || !payload.exp) return false;

  const currentUnixTime = Math.floor(Date.now() / 1000);
  // Check if current time is past expiration timestamp
  if (currentUnixTime >= payload.exp) {
    console.warn("JWT Token Expired:", payload.exp, "Current:", currentUnixTime);
    return false;
  }

  return true;
}

/**
 * LocalStorage Helpers
 */
export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEY);
}

export function saveStoredToken(token, userObj) {
  localStorage.setItem(STORAGE_KEY, token);
  if (userObj) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userObj));
  }
}

export function clearStoredToken() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function getStoredUserProfile() {
  const data = localStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
