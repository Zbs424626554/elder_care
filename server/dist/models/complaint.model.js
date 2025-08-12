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
exports.Complaint = exports.ComplaintType = exports.ComplaintStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ComplaintStatus;
(function (ComplaintStatus) {
    ComplaintStatus["PENDING"] = "pending";
    ComplaintStatus["IN_PROGRESS"] = "in_progress";
    ComplaintStatus["RESOLVED"] = "resolved";
    ComplaintStatus["REJECTED"] = "rejected";
})(ComplaintStatus || (exports.ComplaintStatus = ComplaintStatus = {}));
var ComplaintType;
(function (ComplaintType) {
    ComplaintType["SERVICE"] = "service";
    ComplaintType["CAREGIVER"] = "caregiver";
    ComplaintType["BILLING"] = "billing";
    ComplaintType["APP"] = "app";
    ComplaintType["OTHER"] = "other";
})(ComplaintType || (exports.ComplaintType = ComplaintType = {}));
const complaintSchema = new mongoose_1.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Order'
    },
    complainantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Complaint = mongoose_1.default.model('Complaint', complaintSchema);
