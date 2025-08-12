import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemConfig extends Document {
  configKey: string;
  configValue: string;
  configType: 'payment' | 'order' | 'review' | 'support' | 'system' | 'other';
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const systemConfigSchema = new Schema({
  configKey: {
    type: String,
    required: true,
    unique: true
  },
  configValue: {
    type: String,
    required: true
  },
  configType: {
    type: String,
    enum: ['payment', 'order', 'review', 'support', 'system', 'other'],
    default: 'other'
  },
  description: {
    type: String
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  collection: 'system_configs'
});

systemConfigSchema.index({ configKey: 1 }, { unique: true });
systemConfigSchema.index({ configType: 1 });

export const SystemConfig = mongoose.model<ISystemConfig>('SystemConfig', systemConfigSchema);


