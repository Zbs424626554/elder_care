import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  roleId: string;
  roleName: string;
  permissions: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new Schema({
  roleId: { 
    type: String, 
    required: true,
    unique: true
  },
  roleName: {
    type: String,
    required: true
  },
  permissions: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    default: ''
  }
}, { 
  timestamps: true,
  collection: 'permissions'
});

roleSchema.index({ roleId: 1 });

export const Role = mongoose.model<IRole>('Role', roleSchema); 