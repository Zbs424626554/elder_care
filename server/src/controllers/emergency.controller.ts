import { Request, Response } from 'express';
import type { Server as IOServer } from 'socket.io';
import { EmergencyAlert } from '../models/emergency.model';

export const initiateEmergency = (io: IOServer) => async (req: Request, res: Response) => {
  const userId = (req as any).userId || req.body.userId;
  if (!userId) return res.json({ code: 401, message: '未登录', data: null });
  const doc = await EmergencyAlert.create({ userId, status: 'pending' });
  io.emit('emergency:updated', { alertId: String(doc._id), elderlyId: String(userId), status: 'pending' });
  res.json({ code: 200, message: 'ok', data: { alertId: String(doc._id) } });
};

export const cancelEmergency = (io: IOServer) => async (req: Request, res: Response) => {
  const { id } = req.params;
  await EmergencyAlert.findByIdAndUpdate(id, { status: 'falseAlarm' });
  io.emit('emergency:updated', { alertId: id, status: 'falseAlarm' });
  res.json({ code: 200, message: 'ok', data: { ok: true } });
};

// 采用 base64 文本上传音频，不依赖 multer
export const uploadAudioBase64 = (io: IOServer) => async (req: Request, res: Response) => {
  const { id } = req.params;
  const { base64 } = req.body as { base64?: string };
  if (!base64) return res.json({ code: 400, message: '缺少音频内容', data: null });
  // 临时将 base64 保存在文档字段中（真实项目可落地到对象存储后给出URL）
  await EmergencyAlert.findByIdAndUpdate(id, { audioClip: base64 });
  io.emit('emergency:updated', { alertId: id, status: 'pending', audioClip: 'inline-base64' });
  res.json({ code: 200, message: 'ok', data: { stored: true } });
};

export const commitEmergency = (io: IOServer) => async (req: Request, res: Response) => {
  const { id } = req.params;
  const { location } = req.body as { location?: { type: 'Point'; coordinates: [number, number] } };
  await EmergencyAlert.findByIdAndUpdate(id, { location });
  // 占位的“分析结果”
  const aiAnalysis = JSON.stringify({ riskLevel: 'medium', summary: '占位分析', detectedKeywords: [], environment: [], recommendations: [] });
  await EmergencyAlert.findByIdAndUpdate(id, { aiAnalysis });
  io.emit('emergency:updated', { alertId: id, status: 'pending', aiAnalysis });
  res.json({ code: 200, message: 'ok', data: { aiAnalysis } });
};

