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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nurseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    serviceType: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ServiceType',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'started', 'completed', 'confirmed', 'canceled'],
        default: 'pending'
    },
    orderTime: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    address: {
        formatted: {
            type: String
        },
        province: {
            type: String
        },
        city: {
            type: String
        },
        district: {
            type: String
        },
        location: {
            type: {
                type: String,
                default: 'Point'
            },
            coordinates: {
                type: [Number]
            }
        }
    },
    remarks: {
        type: String
    },
    healthSnapshot: {
        bloodPressure: {
            type: String
        },
        bloodSugar: {
            type: Number
        }
    }
}, {
    timestamps: true,
    collection: 'orders'
});
orderSchema.index({ userId: 1 });
orderSchema.index({ nurseId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderTime: -1 });
orderSchema.index({ 'address.location': '2dsphere' });
exports.Order = mongoose_1.default.model('Order', orderSchema);
