import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  orderId: mongoose.Types.ObjectId;
  reviewerId: mongoose.Types.ObjectId;
  revieweeId: mongoose.Types.ObjectId;
  rating: number;
  content: string;
  hasAppeal: boolean;
  appealContent?: string;
  appealStatus?: AppealStatus;
  appealResolution?: string;
  createdAt: Date;
}

export enum AppealStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

const reviewSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  reviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  revieweeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true
  },
  hasAppeal: {
    type: Boolean,
    default: false
  },
  appealContent: {
    type: String
  },
  appealStatus: {
    type: String,
    enum: Object.values(AppealStatus)
  },
  appealResolution: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'reviews'
});

reviewSchema.index({ orderId: 1 });
reviewSchema.index({ reviewerId: 1 });
reviewSchema.index({ revieweeId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ hasAppeal: 1 });
reviewSchema.index({ appealStatus: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema); 