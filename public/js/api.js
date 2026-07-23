/**
 * SriKrishna Real Estate — shared frontend API helper.
 * Talks to the Express backend. Since the backend serves these
 * static files itself, relative URLs ("/api/...") just work whether
 * you open the site at http://localhost:3000 or a different port.
 */
const API_BASE = '/api';

function getAdminToken() {
  return localStorage.getItem('sk_admin_token');
}

function setAdminToken(token) {
  localStorage.setItem('sk_admin_token', token);
}

function clearAdminToken() {
  localStorage.removeItem('sk_admin_token');
}

/**
 * Generic JSON fetch wrapper.
 * @param {string} path - path relative to API_BASE, e.g. '/properties'
 * @param {object} options - fetch options
 * @param {boolean} auth - attach the admin JWT if present
 */
async function apiFetch(path, options = {}, auth = false) {
  const headers = Object.assign(
    { 'Content-Type': 'application/json' },
    options.headers || {}
  );

  if (auth) {
    const token = getAdminToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    // no JSON body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
