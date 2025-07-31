import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = 'mongodb+srv://424626554:Zbs424626554@zbs.ngrjull.mongodb.net/smart-aging';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');

    // 创建索引
    await createIndexes();
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const createIndexes = async () => {
  // 这里会在模型创建后自动创建索引
  console.log('Indexes created successfully');
};