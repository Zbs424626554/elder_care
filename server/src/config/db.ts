import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI 未配置");
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB 连接成功");
  } catch (error) {
    console.error("MongoDB 连接失败:", error);
    process.exit(1);
  }
};
