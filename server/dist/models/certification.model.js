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
exports.Certification = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const certificationSchema = new mongoose_1.Schema({
    nurseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certType: {
        type: String,
        enum: ['nursing', 'health', 'other'],
        required: true
    },
    certNumber: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verifiedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedAt: {
        type: Date
    }
}, {
    timestamps: true,
    collection: 'certifications'
});
// 创建索引
certificationSchema.index({ nurseId: 1 });
certificationSchema.index({ certType: 1 });
certificationSchema.index({ verified: 1 });
certificationSchema.index({ certNumber: 1 });
exports.Certification = mongoose_1.default.model('Certification', certificationSchema);
