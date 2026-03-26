export const API_BASE_URL = '/api';

export const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  },

  async post(endpoint: string, body?: any) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    return response.json();
  }
};

export const playback = {
  play: () => api.post('/playback/play'),
  pause: () => api.post('/playback/pause'),
  next: () => api.post('/playback/next'),
  prev: () => api.post('/playback/prev'),
  shuffle: () => api.post('/playback/shuffle'),
  getStatus: () => api.get('/playback/status'),
  setVolume: (vol: number) => api.post('/playback/volume', { level: vol }),
};

export const vibe = {
  getCurrent: () => api.get('/vibe/current'),
  getJournal: () => api.get('/vibe/journal'),
};

export const cameras = {
  list: () => api.get('/cameras'),
  updateSettings: (id: number, settings: any) => api.post(`/cameras/${id}/settings`, settings),
  feedUrl: (id: number) => `/api/cameras/feed/${id}`,
};

export const faces = {
  getStats: () => api.get('/faces/stats'),
  getSummary: () => api.get('/faces/summary'),
  getDriveStatus: () => api.get('/faces/drive/status'),
  sync: () => api.post('/faces/sync'),
};
