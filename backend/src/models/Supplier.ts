import { Schema, Document, model } from 'mongoose';
import { ISupplier } from '../types';

export interface ISupplierDocument extends ISupplier, Document {}

const supplierSchema = new Schema<ISupplierDocument>({
  name: {
    type: String,
    required: [true, 'Tên nhà cung cấp là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên nhà cung cấp không được vượt quá 100 ký tự'],
    unique: true
  },
  contactPerson: {
    type: String,
    required: [true, 'Người liên hệ là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên người liên hệ không được vượt quá 100 ký tự']
  },
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email không hợp lệ'
    }
  },
  phone: {
    type: String,
    required: [true, 'Số điện thoại là bắt buộc'],
    trim: true,
    validate: {
      validator: function(v: string) {
        return /^[0-9]{10,11}$/.test(v);
      },
      message: 'Số điện thoại phải có 10-11 chữ số'
    }
  },
  address: {
    type: String,
    required: [true, 'Địa chỉ là bắt buộc'],
    trim: true,
    maxlength: [200, 'Địa chỉ không được vượt quá 200 ký tự']
  },
  productsSupplied: {
    type: Number,
    default: 0,
    min: [0, 'Số sản phẩm cung cấp không được âm'],
    validate: {
      validator: Number.isInteger,
      message: 'Số sản phẩm cung cấp phải là số nguyên'
    }
  },
  rating: {
    type: Number,
    required: [true, 'Đánh giá là bắt buộc'],
    min: [1, 'Đánh giá thấp nhất là 1 sao'],
    max: [5, 'Đánh giá cao nhất là 5 sao'],
    validate: {
      validator: (v: number) => v % 0.5 === 0,
      message: 'Đánh giá phải là bội số của 0.5'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
supplierSchema.index({ name: 'text', contactPerson: 'text' });
supplierSchema.index({ rating: -1 }); // Sort by rating descending
supplierSchema.index({ email: 1 });

export default model<ISupplierDocument>('Supplier', supplierSchema);