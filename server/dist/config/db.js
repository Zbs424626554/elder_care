"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elder_care';
        console.log('尝试连接数据库:', mongoURI);
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB 数据库连接成功');
        // 如需调试数据库集合信息，设置环境变量 LOG_DB_COLLECTIONS=true
        const shouldLogCollections = process.env.LOG_DB_COLLECTIONS === 'true';
        if (shouldLogCollections && mongoose_1.default.connection.db) {
            const collections = await mongoose_1.default.connection.db.collections();
            console.log('数据库集合列表:');
            for (const collection of collections) {
                const count = await mongoose_1.default.connection.db
                    .collection(collection.collectionName)
                    .countDocuments();
                console.log(`- ${collection.collectionName}: ${count}条记录`);
            }
        }
    }
    catch (err) {
        console.error('MongoDB 连接失败:', err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// 监听连接事件
mongoose_1.default.connection.on('connected', () => {
    if (process.env.LOG_DB !== 'false') {
        console.log('Mongoose connected to MongoDB');
    }
});
mongoose_1.default.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});
mongoose_1.default.connection.on('disconnected', () => {
    if (process.env.LOG_DB !== 'false') {
        console.log('Mongoose disconnected from MongoDB');
    }
});
// 优雅关闭连接
process.on('SIGINT', async () => {
    await mongoose_1.default.connection.close();
    if (process.env.LOG_DB !== 'false') {
        console.log('MongoDB connection closed through app termination');
    }
    process.exit(0);
});
