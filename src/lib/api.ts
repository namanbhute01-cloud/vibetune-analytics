const BASE = '/api'

export const api = {
  getCameras:          () => fetch(`${BASE}/cameras`).then(r => r.json()),
  getVibeState:        () => fetch(`${BASE}/vibe/current`).then(r => r.json()),
  getVibeJournal:      () => fetch(`${BASE}/vibe/journal`).then(r => r.json()),
  getFaces:            () => fetch(`${BASE}/faces`).then(r => r.json()),
  getDriveStatus:      () => fetch(`${BASE}/drive/status`).then(r => r.json()),
  getPlayback:         () => fetch(`${BASE}/playback/status`).then(r => r.json()),
  playbackAction: (action: string, body?: object) =>
    fetch(`${BASE}/playback/${action}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: body ? JSON.stringify(body) : undefined,
    }).then(r => r.json()),
  setCameraSettings: (cam_id: number, settings: object) =>
    fetch(`${BASE}/cameras/${cam_id}/settings`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(settings),
    }).then(r => r.json()),
  feedUrl: (cam_id: number) => `/feed/${cam_id}`,
}
