import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceType extends Document {
  name: string;
  basePrice: number;
  description: string;
  timeUnit: 'hour' | 'visit';
  category: 'daily' | 'medical' | 'emergency';
  status: 'active' | 'disabled';
  imageUrl?: string;
  requirements?: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const serviceTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  basePrice: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeUnit: {
    type: String,
    enum: ['hour', 'visit'],
    required: true
  },
  category: {
    type: String,
    enum: ['daily', 'medical', 'emergency'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  imageUrl: {
    type: String
  },
  requirements: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'service_types'
});

// name 字段已在定义中设置了 unique: true，无需重复定义索引
serviceTypeSchema.index({ category: 1 });
serviceTypeSchema.index({ status: 1 });

export const ServiceType = mongoose.model<IServiceType>('ServiceType', serviceTypeSchema); 