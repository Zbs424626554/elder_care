"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeDB = exports.connectDB = exports.Notification = exports.Certification = exports.Complaint = exports.Review = exports.Role = exports.Announcement = exports.SystemConfig = exports.Config = exports.MonthlyStatistics = exports.DailyStatistics = exports.SupportTicket = exports.Withdrawal = exports.PaymentTransaction = exports.Order = exports.ServiceType = exports.UserAdmin = void 0;
// 导出所有模型
const usersadmin_model_1 = require("./usersadmin.model");
Object.defineProperty(exports, "UserAdmin", { enumerable: true, get: function () { return usersadmin_model_1.UserAdmin; } });
const service_model_1 = require("./service.model");
Object.defineProperty(exports, "ServiceType", { enumerable: true, get: function () { return service_model_1.ServiceType; } });
const order_model_1 = require("./order.model");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_model_1.Order; } });
const payment_model_1 = require("./payment.model");
Object.defineProperty(exports, "PaymentTransaction", { enumerable: true, get: function () { return payment_model_1.PaymentTransaction; } });
Object.defineProperty(exports, "Withdrawal", { enumerable: true, get: function () { return payment_model_1.Withdrawal; } });
const support_model_1 = require("./support.model");
Object.defineProperty(exports, "SupportTicket", { enumerable: true, get: function () { return support_model_1.SupportTicket; } });
const statistics_model_1 = require("./statistics.model");
Object.defineProperty(exports, "DailyStatistics", { enumerable: true, get: function () { return statistics_model_1.DailyStatistics; } });
Object.defineProperty(exports, "MonthlyStatistics", { enumerable: true, get: function () { return statistics_model_1.MonthlyStatistics; } });
const config_model_1 = require("./config.model");
Object.defineProperty(exports, "Config", { enumerable: true, get: function () { return config_model_1.Config; } });
const systemConfig_model_1 = require("./systemConfig.model");
Object.defineProperty(exports, "SystemConfig", { enumerable: true, get: function () { return systemConfig_model_1.SystemConfig; } });
const announcement_model_1 = require("./announcement.model");
Object.defineProperty(exports, "Announcement", { enumerable: true, get: function () { return announcement_model_1.Announcement; } });
const review_model_1 = require("./review.model");
Object.defineProperty(exports, "Review", { enumerable: true, get: function () { return review_model_1.Review; } });
const complaint_model_1 = require("./complaint.model");
Object.defineProperty(exports, "Complaint", { enumerable: true, get: function () { return complaint_model_1.Complaint; } });
const certification_model_1 = require("./certification.model");
Object.defineProperty(exports, "Certification", { enumerable: true, get: function () { return certification_model_1.Certification; } });
const notification_model_1 = require("./notification.model");
Object.defineProperty(exports, "Notification", { enumerable: true, get: function () { return notification_model_1.Notification; } });
const role_model_1 = require("./role.model");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return role_model_1.Role; } });
// 初始化数据库连接
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (uri) => {
    try {
        await mongoose_1.default.connect(uri);
        console.log('MongoDB连接成功');
    }
    catch (error) {
        console.error('MongoDB连接失败:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
// 关闭数据库连接
const closeDB = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('MongoDB连接已关闭');
    }
    catch (error) {
        console.error('关闭MongoDB连接失败:', error);
    }
};
exports.closeDB = closeDB;
