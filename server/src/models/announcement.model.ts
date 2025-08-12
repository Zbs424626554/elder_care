import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
  title: string;
  content: string;
  type: 'notice' | 'promotion' | 'update' | 'emergency';
  targetRoles: ('elderly' | 'family' | 'nurse' | 'admin')[];
  status: 'draft' | 'published' | 'archived';
  startTime?: Date;
  endTime?: Date;
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const announcementSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['notice', 'promotion', 'update', 'emergency'],
    default: 'notice'
  },
  targetRoles: [{
    type: String,
    enum: ['elderly', 'family', 'nurse', 'admin']
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  imageUrl: {
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
  collection: 'announcements'
});

// 索引
announcementSchema.index({ status: 1 });
announcementSchema.index({ type: 1 });
announcementSchema.index({ targetRoles: 1 });
announcementSchema.index({ startTime: 1, endTime: 1 });

export const Announcement = mongoose.model<IAnnouncement>('Announcement', announcementSchema); 