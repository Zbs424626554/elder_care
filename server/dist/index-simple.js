"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index-simple.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176'
    ],
    credentials: true
}));
app.use(express_1.default.json());
// 连接数据库
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elder_care';
        await mongoose_1.default.connect(mongoURI);
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};
connectDB();
// 简单的测试路由
app.get('/api/test', (req, res) => {
    res.json({ message: '服务器运行正常' });
});
// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '服务器健康状态良好' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});
