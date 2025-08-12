import mongoose, { Schema, Document } from 'mongoose';

export enum ComplaintStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  REJECTED = 'rejected'
}

export enum ComplaintType {
  SERVICE = 'service',
  CAREGIVER = 'caregiver',
  BILLING = 'billing',
  APP = 'app',
  OTHER = 'other'
}

export interface IComplaint extends Document {
  orderId?: mongoose.Types.ObjectId;
  complainantId: mongoose.Types.ObjectId;
  targetId?: mongoose.Types.ObjectId;
  reviewId?: mongoose.Types.ObjectId;
  type: ComplaintType;
  title: string;
  description: string;
  status: ComplaintStatus;
  handledBy?: mongoose.Types.ObjectId;
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const complaintSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  complainantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review'
  },
  type: {
    type: String,
    enum: Object.values(ComplaintType),
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(ComplaintStatus),
    default: ComplaintStatus.PENDING
  },
  handledBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  resolutionNotes: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'complaints'
});

complaintSchema.index({ complainantId: 1 });
complaintSchema.index({ targetId: 1 });
complaintSchema.index({ reviewId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ type: 1 });

export const Complaint = mongoose.model<IComplaint>('Complaint', complaintSchema); 