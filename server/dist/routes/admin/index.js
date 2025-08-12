"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const role_middleware_1 = require("../../middleware/role.middleware");
const statistics_controller_1 = __importDefault(require("../../controllers/admin/statistics.controller"));
const order_routes_1 = __importDefault(require("./order.routes"));
const service_routes_1 = __importDefault(require("./service.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const finance_routes_1 = __importDefault(require("./finance.routes"));
const router = express.Router();
// 统一管理员接口，采用 Controllers → Routes → Index 的风格
// 在此统一挂载鉴权中间件，子路由只负责声明绑定
router.use(auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin);
// 系统统计
router.get('/statistics', statistics_controller_1.default.getStatistics);
// 用户管理（子路由）
router.use('/user', user_routes_1.default);
// 订单、服务模块子路由（保持清晰的资源划分）
router.use('/orders', order_routes_1.default);
router.use('/services', service_routes_1.default);
// 财务相关（子路由）
router.use('/finance', finance_routes_1.default);
exports.default = router;
