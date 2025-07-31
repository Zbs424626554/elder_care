// server/src/index.ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import userRoutes from './routes/userRoutes';

const app = express();
app.use(cors());
app.use(express.json());

// 连接数据库
connectDB();

// 路由
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});