"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const role_middleware_1 = require("../middleware/role.middleware");
const review_controller_1 = require("../controllers/review.controller");
const router = express_1.default.Router();
// Get all reviews (accessible by admin)
router.get('/', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, review_controller_1.getAllReviews);
// Get review by ID
router.get('/:id', auth_middleware_1.authenticateJWT, review_controller_1.getReviewById);
// Submit appeal for a review
router.post('/:id/appeal', auth_middleware_1.authenticateJWT, review_controller_1.submitAppeal);
// Process appeal (admin only)
router.put('/:id/appeal', auth_middleware_1.authenticateJWT, role_middleware_1.isAdmin, review_controller_1.processAppeal);
exports.default = router;
