"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateComplaintStatus = exports.createComplaint = exports.getComplaintById = exports.getAllComplaints = void 0;
const complaint_model_1 = require("../models/complaint.model");
const mongoose_1 = __importDefault(require("mongoose"));
// Get all complaints with filtering and pagination
const getAllComplaints = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }
        const complaints = await complaint_model_1.Complaint.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('complainantId', 'name avatar')
            .populate('targetId', 'name avatar')
            .populate('handledBy', 'name avatar')
            .populate('orderId')
            .populate('reviewId');
        const total = await complaint_model_1.Complaint.countDocuments(filter);
        return res.success({
            complaints,
            total,
            page,
            pages: Math.ceil(total / limit)
        }, '获取投诉列表成功');
    }
    catch (error) {
        console.error('Error fetching complaints:', error);
        return res.error('获取投诉列表失败', error);
    }
};
exports.getAllComplaints = getAllComplaints;
// Get complaint by ID
const getComplaintById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.fail(400, '无效的投诉ID');
        }
        const complaint = await complaint_model_1.Complaint.findById(id)
            .populate('complainantId', 'name avatar')
            .populate('targetId', 'name avatar')
            .populate('handledBy', 'name avatar')
            .populate('orderId')
            .populate('reviewId');
        if (!complaint) {
            return res.fail(404, '投诉不存在');
        }
        return res.success(complaint, '获取投诉详情成功');
    }
    catch (error) {
        console.error('Error fetching complaint:', error);
        return res.error('获取投诉详情失败', error);
    }
};
exports.getComplaintById = getComplaintById;
// Create a new complaint
const createComplaint = async (req, res) => {
    try {
        const { orderId, targetId, reviewId, type, title, description } = req.body;
        if (!type || !title || !description) {
            return res.fail(400, '类型、标题和描述不能为空');
        }
        if (!req.user || !req.user.id) {
            return res.fail(401, '需要登录认证');
        }
        const complaint = new complaint_model_1.Complaint({
            complainantId: req.user.id,
            type,
            title,
            description,
            status: complaint_model_1.ComplaintStatus.PENDING,
            createdAt: new Date()
        });
        if (orderId) {
            complaint.orderId = orderId;
        }
        if (targetId) {
            complaint.targetId = targetId;
        }
        if (reviewId) {
            complaint.reviewId = reviewId;
        }
        await complaint.save();
        return res.success(complaint, '投诉创建成功');
    }
    catch (error) {
        console.error('Error creating complaint:', error);
        return res.error('投诉创建失败', error);
    }
};
exports.createComplaint = createComplaint;
// Update complaint status (admin only)
const updateComplaintStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;
        if (!req.user || !req.user.id) {
            return res.fail(401, '需要登录认证');
        }
        if (!status) {
            return res.fail(400, '状态不能为空');
        }
        if (!Object.values(complaint_model_1.ComplaintStatus).includes(status)) {
            return res.fail(400, '无效的状态值');
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.fail(400, '无效的投诉ID');
        }
        const complaint = await complaint_model_1.Complaint.findById(id);
        if (!complaint) {
            return res.fail(404, '投诉不存在');
        }
        // Update status
        complaint.status = status;
        complaint.handledBy = new mongoose_1.default.Types.ObjectId(req.user.id);
        complaint.updatedAt = new Date();
        // Add response notes
        if (response) {
            complaint.resolutionNotes = response;
        }
        await complaint.save();
        return res.success(complaint, '投诉状态更新成功');
    }
    catch (error) {
        console.error('Error updating complaint status:', error);
        return res.error('投诉状态更新失败', error);
    }
};
exports.updateComplaintStatus = updateComplaintStatus;
