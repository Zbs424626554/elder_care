import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentTransaction extends Document {
  orderId: mongoose.Types.ObjectId;
  amount: number;
  payerId: mongoose.Types.ObjectId;
  receiverId?: mongoose.Types.ObjectId;
  payMethod: 'alipay' | 'wechat' | 'bank' | 'balance';
  transactionId: string;
  status: 'pending' | 'success' | 'failed' | 'refunded' | 'disputed';
  platformFee?: number;
  refundAmount?: number;
  refundReason?: string;
  disputeReason?: string;
  adminNotes?: string;
  processedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  payerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  payMethod: {
    type: String,
    enum: ['alipay', 'wechat', 'bank', 'balance'],
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  platformFee: {
    type: Number
  },
  refundAmount: {
    type: Number
  },
  refundReason: {
    type: String
  },
  disputeReason: {
    type: String
  },
  adminNotes: {
    type: String
  },
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'payment_transactions'
});

paymentTransactionSchema.index({ orderId: 1 });
paymentTransactionSchema.index({ payerId: 1 });
paymentTransactionSchema.index({ receiverId: 1 });
paymentTransactionSchema.index({ status: 1 });
paymentTransactionSchema.index({ transactionId: 1 });
paymentTransactionSchema.index({ createdAt: -1 });
paymentTransactionSchema.index({ processedBy: 1 });

export const PaymentTransaction = mongoose.model<IPaymentTransaction>('PaymentTransaction', paymentTransactionSchema);

// 提现记录
export interface IWithdrawal extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  bankAccount: {
    name: string;
    accountNumber: string;
    bankName: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminNotes?: string;
  processedBy?: mongoose.Types.ObjectId;
  requestedAt: Date;
  processedAt?: Date;
}

const withdrawalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bankAccount: {
    name: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  processedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'withdrawals'
});

withdrawalSchema.index({ userId: 1 });
withdrawalSchema.index({ status: 1 });
withdrawalSchema.index({ requestedAt: -1 });
withdrawalSchema.index({ processedBy: 1 });

export const Withdrawal = mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema); 