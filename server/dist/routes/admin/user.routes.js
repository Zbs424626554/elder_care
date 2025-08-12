"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../../controllers/admin/user.controller"));
const router = express_1.default.Router();
// Controllers → Routes: 仅做路由映射，鉴权在上层 admin/index 统一处理
router.get('/list', user_controller_1.default.list);
router.post('/add', user_controller_1.default.add);
router.post('/audit', user_controller_1.default.audit);
router.post('/status', user_controller_1.default.updateStatus);
router.post('/role', user_controller_1.default.assignRole);
router.post('/delete', user_controller_1.default.batchDelete);
exports.default = router;
