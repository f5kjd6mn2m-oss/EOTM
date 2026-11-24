const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'oxu_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => {
  onUnauthorized = fn;
};

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export async function request(method, path, { body, query } = {}) {
  let url = `${BASE}${path}`;
  if (query) {
    const qs = new URLSearchParams(
      Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (qs) url += `?${qs}`;
  }

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(url, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, "Serverga ulanib bo'lmadi. Internet yoki backend ishlayotganini tekshiring");
  }

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Login sahifasidagi 401 — bu "parol xato", sessiya tugashi emas
    if (res.status === 401 && path !== '/auth/login') onUnauthorized();
    const detail = json.details?.map((d) => d.message).join('. ');
    throw new ApiError(res.status, detail || json.message || 'Xatolik yuz berdi', json.details);
  }
  return json.data !== undefined ? json.data : json;
}
