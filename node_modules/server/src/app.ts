import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { responseHandler } from './middleware/response.middleware';
import { errorHandler } from './middleware/errorHandler.middleware';

const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responseHandler);

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 路由
import { apiRoutes } from './routes';
app.use('/api', apiRoutes);

// 错误处理
app.use(errorHandler);

export default app; 