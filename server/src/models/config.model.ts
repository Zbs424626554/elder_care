import mongoose, { Schema, Document } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  value: any;
  category: 'system' | 'payment' | 'notification' | 'service' | 'other';
  description?: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const configSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  category: {
    type: String,
    enum: ['system', 'payment', 'notification', 'service', 'other'],
    default: 'other'
  },
  description: {
    type: String
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'configs'
});

// 索引
configSchema.index({ key: 1 }, { unique: true });
configSchema.index({ category: 1 });

export const Config = mongoose.model<IConfig>('Config', configSchema); 