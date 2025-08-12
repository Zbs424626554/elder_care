"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdrawal = exports.PaymentTransaction = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const paymentTransactionSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.PaymentTransaction = mongoose_1.default.model('PaymentTransaction', paymentTransactionSchema);
const withdrawalSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Withdrawal = mongoose_1.default.model('Withdrawal', withdrawalSchema);
