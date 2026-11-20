const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export const getProviders = (params, signal) => {
  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null));
  return request(`/providers?${qs}`, { signal });
};
export const createSubscription = (body) => request('/subscriptions', { method: 'POST', body: JSON.stringify(body) });
export const joinWaitlist = (body) => request('/waitlist', { method: 'POST', body: JSON.stringify(body) });
export const listMess = (body) => request('/providers', { method: 'POST', body: JSON.stringify(body) });
