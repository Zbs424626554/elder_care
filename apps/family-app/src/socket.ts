import { io } from 'socket.io-client';

export const socket = io('http://localhost:3001', { withCredentials: true });

export function registerUser(userId: string) {
  socket.emit('register', { userId });
}

