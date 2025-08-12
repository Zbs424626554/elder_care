"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = __importDefault(require("../../controllers/admin/order.controller"));
const router = express_1.default.Router();
// Controllers → Routes: 仅声明路由与控制器的绑定，鉴权在上层 index 统一处理
router.get('/list', order_controller_1.default.list);
exports.default = router;
