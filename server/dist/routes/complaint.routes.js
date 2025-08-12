"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const complaint_controller_1 = require("../controllers/complaint.controller");
const router = express_1.default.Router();
// Get all complaints (admin only)
router.get('/', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, complaint_controller_1.getAllComplaints);
// Get complaint by ID
router.get('/:id', auth_middleware_1.authenticateJWT, complaint_controller_1.getComplaintById);
// Create a new complaint
router.post('/', auth_middleware_1.authenticateJWT, complaint_controller_1.createComplaint);
// Update complaint status (admin only)
router.put('/:id/status', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, complaint_controller_1.updateComplaintStatus);
exports.default = router;
