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
exports.MonthlyStatistics = exports.DailyStatistics = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dailyStatisticsSchema = new mongoose_1.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    orders: {
        total: {
            type: Number,
            default: 0
        },
        pending: {
            type: Number,
            default: 0
        },
        completed: {
            type: Number,
            default: 0
        },
        canceled: {
            type: Number,
            default: 0
        }
    },
    users: {
        total: {
            type: Number,
            default: 0
        },
        elderly: {
            type: Number,
            default: 0
        },
        family: {
            type: Number,
            default: 0
        },
        nurse: {
            type: Number,
            default: 0
        },
        new: {
            type: Number,
            default: 0
        }
    },
    revenue: {
        total: {
            type: Number,
            default: 0
        },
        platformFee: {
            type: Number,
            default: 0
        }
    },
    services: {
        type: Map,
        of: Number,
        default: {}
    },
    emergencies: {
        type: Number,
        default: 0
    },
    complaints: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'daily_statistics'
});
// 索引
dailyStatisticsSchema.index({ date: 1 }, { unique: true });
exports.DailyStatistics = mongoose_1.default.model('DailyStatistics', dailyStatisticsSchema);
const monthlyStatisticsSchema = new mongoose_1.Schema({
    year: {
        type: Number,
        required: true
    },
    month: {
        type: Number,
        required: true
    },
    orders: {
        total: {
            type: Number,
            default: 0
        },
        completed: {
            type: Number,
            default: 0
        },
        canceled: {
            type: Number,
            default: 0
        }
    },
    users: {
        total: {
            type: Number,
            default: 0
        },
        elderly: {
            type: Number,
            default: 0
        },
        family: {
            type: Number,
            default: 0
        },
        nurse: {
            type: Number,
            default: 0
        },
        new: {
            type: Number,
            default: 0
        }
    },
    revenue: {
        total: {
            type: Number,
            default: 0
        },
        platformFee: {
            type: Number,
            default: 0
        }
    },
    services: {
        type: Map,
        of: Number,
        default: {}
    },
    emergencies: {
        type: Number,
        default: 0
    },
    complaints: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'monthly_statistics'
});
// 索引
monthlyStatisticsSchema.index({ year: 1, month: 1 }, { unique: true });
exports.MonthlyStatistics = mongoose_1.default.model('MonthlyStatistics', monthlyStatisticsSchema);
