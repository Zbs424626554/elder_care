"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processAppeal = exports.submitAppeal = exports.getReviewById = exports.getAllReviews = void 0;
const review_model_1 = require("../models/review.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.rating) {
            filter.rating = parseInt(req.query.rating);
        }
        if (req.query.hasAppeal === 'true') {
            filter.hasAppeal = true;
        }
        if (req.query.appealStatus) {
            filter.appealStatus = req.query.appealStatus;
        }
        const reviews = await review_model_1.Review.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('reviewerId', 'name avatar')
            .populate('revieweeId', 'name avatar')
            .populate('orderId');
        const total = await review_model_1.Review.countDocuments(filter);
        return res.success({
            reviews,
            total,
            page,
            pages: Math.ceil(total / limit)
        }, '获取评价列表成功');
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        return res.error('获取评价列表失败', error);
    }
};
exports.getAllReviews = getAllReviews;
// Get review by ID
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.fail(400, '无效的评价ID');
        }
        const review = await review_model_1.Review.findById(id)
            .populate('reviewerId', 'name avatar')
            .populate('revieweeId', 'name avatar')
            .populate('orderId');
        if (!review) {
            return res.fail(404, '评价不存在');
        }
        return res.success(review, '获取评价详情成功');
    }
    catch (error) {
        console.error('Error fetching review:', error);
        return res.error('获取评价详情失败', error);
    }
};
exports.getReviewById = getReviewById;
// Submit appeal for a review
const submitAppeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { appealContent } = req.body;
        if (!req.user || !req.user.id) {
            return res.fail(401, '需要登录认证');
        }
        const userId = req.user.id;
        if (!appealContent) {
            return res.fail(400, '申诉内容不能为空');
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.fail(400, '无效的评价ID');
        }
        // Find the review
        const review = await review_model_1.Review.findById(id);
        if (!review) {
            return res.fail(404, '评价不存在');
        }
        // Check if the user is the reviewee (the person who received the review)
        if (review.revieweeId.toString() !== userId) {
            return res.fail(403, '只有被评价人可以提交申诉');
        }
        // Check if an appeal already exists
        if (review.hasAppeal) {
            return res.fail(400, '该评价已有申诉');
        }
        // Update the review with appeal information
        review.hasAppeal = true;
        review.appealContent = appealContent;
        review.appealStatus = review_model_1.AppealStatus.PENDING;
        await review.save();
        return res.success(null, '申诉提交成功');
    }
    catch (error) {
        console.error('Error submitting appeal:', error);
        return res.error('申诉提交失败', error);
    }
};
exports.submitAppeal = submitAppeal;
// Process appeal (admin only)
const processAppeal = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, reason } = req.body;
        if (!req.user || !req.user.id) {
            return res.fail(401, '需要登录认证');
        }
        if (!action || !reason) {
            return res.fail(400, '处理结果和原因不能为空');
        }
        if (!['approve', 'reject'].includes(action)) {
            return res.fail(400, '处理结果必须是 approve 或 reject');
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.fail(400, '无效的评价ID');
        }
        // Find the review
        const review = await review_model_1.Review.findById(id);
        if (!review) {
            return res.fail(404, '评价不存在');
        }
        // Check if the review has an appeal
        if (!review.hasAppeal) {
            return res.fail(400, '该评价没有申诉');
        }
        // Check if the appeal is already processed
        if (review.appealStatus !== review_model_1.AppealStatus.PENDING) {
            return res.fail(400, '该申诉已处理');
        }
        // Update the appeal status
        review.appealStatus = action === 'approve' ? review_model_1.AppealStatus.APPROVED : review_model_1.AppealStatus.REJECTED;
        review.appealResolution = reason;
        await review.save();
        return res.success(null, '申诉处理成功');
    }
    catch (error) {
        console.error('Error processing appeal:', error);
        return res.error('申诉处理失败', error);
    }
};
exports.processAppeal = processAppeal;
