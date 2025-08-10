import request from '../utils/request';

export async function initiate(): Promise<{ alertId: string }> {
  const res = await request.post<{ alertId: string }>('/emergency/initiate', {});
  return res.data;
}

export async function cancel(id: string): Promise<void> {
  await request.post(`/emergency/${id}/cancel`, {});
}

export async function uploadAudioBase64(id: string, base64: string): Promise<void> {
  await request.post(`/emergency/${id}/upload-audio-base64`, { base64 });
}

export async function commit(id: string, body: { location?: { type: 'Point'; coordinates: [number, number] } }) {
  const res = await request.post(`/emergency/${id}/commit`, body);
  return res.data;
}

