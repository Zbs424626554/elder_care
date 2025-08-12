import mongoose, { Schema, Document } from 'mongoose';

export interface IDailyStatistics extends Document {
  date: Date;
  orders: {
    total: number;
    pending: number;
    completed: number;
    canceled: number;
  };
  users: {
    total: number;
    elderly: number;
    family: number;
    nurse: number;
    new: number;
  };
  revenue: {
    total: number;
    platformFee: number;
  };
  services: {
    [key: string]: number;
  };
  emergencies: number;
  complaints: number;
  averageRating: number;
}

const dailyStatisticsSchema = new Schema({
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

export const DailyStatistics = mongoose.model<IDailyStatistics>('DailyStatistics', dailyStatisticsSchema);

// 月度统计
export interface IMonthlyStatistics extends Document {
  year: number;
  month: number;
  orders: {
    total: number;
    completed: number;
    canceled: number;
  };
  users: {
    total: number;
    elderly: number;
    family: number;
    nurse: number;
    new: number;
  };
  revenue: {
    total: number;
    platformFee: number;
  };
  services: {
    [key: string]: number;
  };
  emergencies: number;
  complaints: number;
  averageRating: number;
}

const monthlyStatisticsSchema = new Schema({
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

export const MonthlyStatistics = mongoose.model<IMonthlyStatistics>('MonthlyStatistics', monthlyStatisticsSchema); 