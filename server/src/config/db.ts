import mongoose from 'mongoose';

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI 未配置');
  }
  try {
    await mongoose.connect(uri);
    const dbName = mongoose.connection?.db?.databaseName;
    // 尽量隐藏凭证，仅显示数据库名
    console.log(`MongoDB 连接成功 -> 当前数据库: ${dbName || '未知'}`);
  } catch (error) {
    console.error('MongoDB 连接失败:', error);
    process.exit(1);
  }
};
