import { Request, Response } from 'express';
import { Complaint, ComplaintStatus } from '../models/complaint.model';
import mongoose from 'mongoose';

// Get all complaints with filtering and pagination
export const getAllComplaints = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.type) {
      filter.type = req.query.type;
    }
    
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('complainantId', 'name avatar')
      .populate('targetId', 'name avatar')
      .populate('handledBy', 'name avatar')
      .populate('orderId')
      .populate('reviewId');
      
    const total = await Complaint.countDocuments(filter);
    
    return res.success({
      complaints,
      total,
      page,
      pages: Math.ceil(total / limit)
    }, '获取投诉列表成功');
  } catch (error: any) {
    console.error('Error fetching complaints:', error);
    return res.error('获取投诉列表失败', error);
  }
};

// Get complaint by ID
export const getComplaintById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.fail(400, '无效的投诉ID');
    }
    
    const complaint = await Complaint.findById(id)
      .populate('complainantId', 'name avatar')
      .populate('targetId', 'name avatar')
      .populate('handledBy', 'name avatar')
      .populate('orderId')
      .populate('reviewId');
      
    if (!complaint) {
      return res.fail(404, '投诉不存在');
    }
    
    return res.success(complaint, '获取投诉详情成功');
  } catch (error: any) {
    console.error('Error fetching complaint:', error);
    return res.error('获取投诉详情失败', error);
  }
};

// Create a new complaint
export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { 
      orderId, 
      targetId, 
      reviewId, 
      type, 
      title, 
      description 
    } = req.body;
    
    if (!type || !title || !description) {
      return res.fail(400, '类型、标题和描述不能为空');
    }
    
    if (!req.user || !req.user.id) {
      return res.fail(401, '需要登录认证');
    }
    
    const complaint = new Complaint({
      complainantId: req.user.id,
      type,
      title,
      description,
      status: ComplaintStatus.PENDING,
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
  } catch (error: any) {
    console.error('Error creating complaint:', error);
    return res.error('投诉创建失败', error);
  }
};

// Update complaint status (admin only)
export const updateComplaintStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, response } = req.body;
    
    if (!req.user || !req.user.id) {
      return res.fail(401, '需要登录认证');
    }
    
    if (!status) {
      return res.fail(400, '状态不能为空');
    }
    
    if (!Object.values(ComplaintStatus).includes(status)) {
      return res.fail(400, '无效的状态值');
    }
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.fail(400, '无效的投诉ID');
    }
    
    const complaint = await Complaint.findById(id);
    
    if (!complaint) {
      return res.fail(404, '投诉不存在');
    }
    
    // Update status
    complaint.status = status;
    complaint.handledBy = new mongoose.Types.ObjectId(req.user.id);
    complaint.updatedAt = new Date();
    
    // Add response notes
    if (response) {
      complaint.resolutionNotes = response;
    }
    
    await complaint.save();
    
    return res.success(complaint, '投诉状态更新成功');
  } catch (error: any) {
    console.error('Error updating complaint status:', error);
    return res.error('投诉状态更新失败', error);
  }
}; 