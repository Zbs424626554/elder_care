// server/src/index.ts
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/auth.routes';
import emergencyRoutes from './routes/emergency.routes';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { initSocket } from './config/socket';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initSocket(server);

app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes(io));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});