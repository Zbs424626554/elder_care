import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'complaint' | 'inquiry' | 'emergency' | 'appeal' | 'other';
  orderId?: mongoose.Types.ObjectId;
  content: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: mongoose.Types.ObjectId;
  responses?: {
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    isAdmin: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  attachments?: string[];
}

const supportTicketSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['complaint', 'inquiry', 'emergency', 'appeal', 'other'],
    required: true
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed', 'escalated'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  responses: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  }],
  attachments: [{
    type: String
  }],
  resolvedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'support_tickets'
});

supportTicketSchema.index({ userId: 1 });
supportTicketSchema.index({ type: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ orderId: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ createdAt: -1 });

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', supportTicketSchema); 