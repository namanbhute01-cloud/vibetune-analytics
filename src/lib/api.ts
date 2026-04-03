const BASE = '/api'

/**
 * Fetch with automatic retry (up to 2 retries with exponential backoff).
 * Prevents transient network errors from breaking the UI.
 */
async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 2
): Promise<Response> {
  try {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(5000),  // 5s timeout
    })
    return response
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 500))  // Wait 500ms
      return fetchWithRetry(url, options, retries - 1)
    }
    throw err
  }
}

async function jsonFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithRetry(url, options)
  return res.json()
}

export const api = {
  // Cameras
  getCameras:          () => jsonFetch(`${BASE}/cameras`),
  getCameraConfig:     () => jsonFetch(`${BASE}/cameras/config`),
  saveCameraConfig:   (sources: string[]) =>
    jsonFetch(`${BASE}/cameras/config`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ sources }),
    }),
  setCameraSettings: (cam_id: number, settings: object) =>
    jsonFetch(`${BASE}/cameras/${cam_id}/settings`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(settings),
    }),

  // Settings / Config
  getSettings:         () => jsonFetch(`${BASE}/settings`),
  saveSettings:        (settings: Record<string, boolean | string | number>) =>
    jsonFetch(`${BASE}/settings`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ settings }),
    }),

  // Environment Variables
  getEnvVars:          () => jsonFetch(`${BASE}/settings/env-vars`),
  updateEnvVar:        (key: string, value: string) =>
    jsonFetch(`${BASE}/settings/env-vars`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ key, value }),
    }),
  updateSetting:       (key: string, value: boolean | string | number) =>
    jsonFetch(`${BASE}/settings/${key}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ value }),
    }),

  // Playback
  getPlayback:         () => jsonFetch(`${BASE}/playback/status`),
  getLibrary:          () => jsonFetch(`${BASE}/playback/library`),
  addSong:             (file: File, group: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('group', group)
    return fetch(`${BASE}/playback/add-song`, {
      method: 'POST',
      body: formData,
      signal: AbortSignal.timeout(30000),  // 30s for file uploads
    }).then(r => r.json())
  },
  playbackAction: (action: string, body?: object) =>
    jsonFetch(`${BASE}/playback/${action}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : undefined,
    }),

  // Vibe
  getVibeState:        () => jsonFetch(`${BASE}/vibe/current`),
  getVibeJournal:      () => jsonFetch(`${BASE}/vibe/journal`),

  // Faces
  getFaces:            () => jsonFetch(`${BASE}/faces`),

  // Drive
  getDriveStatus:      () => jsonFetch(`${BASE}/faces/drive/status`),

  // URLs
  feedUrl: (cam_id: number) => `/feed/${cam_id}`,
  wsUrl: () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}/ws`
  },
}
