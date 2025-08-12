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
exports.HealthWarning = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const healthWarningSchema = new mongoose_1.Schema({
    elderlyId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserAdmin',
        required: true
    },
    metric: {
        type: String,
        enum: ['bloodPressure', 'bloodSugar'],
        required: true
    },
    currentValue: {
        type: String,
        required: true
    },
    trend: {
        type: String,
        enum: ['rising', 'falling', 'abnormal'],
        required: true
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    suggestedActions: {
        type: [String]
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: 'health_warnings'
});
healthWarningSchema.index({ elderlyId: 1 });
healthWarningSchema.index({ metric: 1 });
healthWarningSchema.index({ severity: 1 });
healthWarningSchema.index({ sentAt: -1 });
exports.HealthWarning = mongoose_1.default.model('HealthWarning', healthWarningSchema);
