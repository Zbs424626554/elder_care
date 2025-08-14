import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176'
      ],
      credentials: true
    }
  });

  io.on('connection', socket => {
    socket.on('register', ({ userId }: { userId: string }) => {
      if (userId) socket.join(`user:${userId}`);
    });
  });

  return io;
};

