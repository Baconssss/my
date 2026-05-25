const API = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('jwt') || '';
}

async function fetcher(url: string, opts?: RequestInit) {
  const res = await fetch(`${API}${url}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(opts?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  auth: (initData: string) => fetcher('/auth/verify', { method: 'POST', body: JSON.stringify({ initData }) }),
  categories: () => fetcher('/categories'),
  services: (params?: { lat?: number; lon?: number; categoryId?: number; radius?: number }) => {
    const qs = new URLSearchParams();
    if (params?.lat) qs.set('lat', String(params.lat));
    if (params?.lon) qs.set('lon', String(params.lon));
    if (params?.categoryId) qs.set('categoryId', String(params.categoryId));
    if (params?.radius) qs.set('radius', String(params.radius));
    return fetcher(`/services?${qs}`);
  },
  bookings: (body: { serviceId: number; datetime: string }) =>
    fetcher('/bookings', { method: 'POST', body: JSON.stringify(body) }),
  myBookings: () => fetcher('/bookings/my'),
  workerMe: () => fetcher('/worker/me'),
  createService: (body: object) => fetcher('/worker/services', { method: 'POST', body: JSON.stringify(body) }),
};