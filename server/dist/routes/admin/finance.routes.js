"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const finance_controller_1 = __importDefault(require("../../controllers/admin/finance.controller"));
const router = express_1.default.Router();
// Controllers → Routes: 财务相关接口路由映射
router.get('/payments', finance_controller_1.default.payments);
router.get('/withdrawals', finance_controller_1.default.withdrawals);
exports.default = router;
