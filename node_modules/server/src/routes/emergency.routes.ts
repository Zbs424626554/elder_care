import { Router } from 'express';
import type { Server as IOServer } from 'socket.io';
import { authenticateToken } from '../middleware/auth.middleware';
import { initiateEmergency, cancelEmergency, uploadAudioBase64, commitEmergency } from '../controllers/emergency.controller';

export default function emergencyRoutes(io: IOServer) {
  const router = Router();
  router.post('/initiate', authenticateToken, initiateEmergency(io));
  router.post('/:id/cancel', authenticateToken, cancelEmergency(io));
  router.post('/:id/upload-audio-base64', authenticateToken, uploadAudioBase64(io));
  router.post('/:id/commit', authenticateToken, commitEmergency(io));
  return router;
}

