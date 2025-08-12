import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elder_care';
  const serverSelectionTimeoutMS = Number(process.env.DB_CONNECT_TIMEOUT_MS || 8000);

  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS });
    console.log('MongoDB 数据库连接成功');
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};

// 监听连接事件
mongoose.connection.on('connected', () => {
  // 连接成功事件已在上面的 connectDB 中处理
});

mongoose.connection.on('error', (err) => {
  // 静默处理连接错误事件
});

mongoose.connection.on('disconnected', () => {
  // 静默处理断开连接事件
});

// 优雅关闭连接
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  process.exit(0);
});
