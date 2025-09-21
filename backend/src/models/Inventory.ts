import { Schema, Document, model } from 'mongoose';
import { IInventoryItem } from '../types';

export interface IInventoryDocument extends IInventoryItem, Document {}

const inventorySchema = new Schema<IInventoryDocument>({
  name: {
    type: String,
    required: [true, 'Tên sản phẩm là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên sản phẩm không được vượt quá 100 ký tự']
  },
  sku: {
    type: String,
    required: [true, 'Mã SKU là bắt buộc'],
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, 'Mã SKU không được vượt quá 20 ký tự']
  },
  quantity: {
    type: Number,
    required: [true, 'Số lượng là bắt buộc'],
    min: [0, 'Số lượng không được âm'],
    validate: {
      validator: Number.isInteger,
      message: 'Số lượng phải là số nguyên'
    }
  },
  location: {
    type: String,
    required: [true, 'Vị trí kho là bắt buộc'],
    trim: true,
    maxlength: [50, 'Vị trí kho không được vượt quá 50 ký tự']
  },
  imageUrl: {
    type: String,
    required: [true, 'URL hình ảnh là bắt buộc'],
    validate: {
      validator: (v: string) => /^https?:\/\/.+/.test(v),
      message: 'URL hình ảnh không hợp lệ'
    }
  },
  supplier: {
    type: String,
    required: [true, 'Nhà cung cấp là bắt buộc'],
    trim: true,
    maxlength: [100, 'Tên nhà cung cấp không được vượt quá 100 ký tự']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Index for better search performance
inventorySchema.index({ name: 'text', sku: 'text', supplier: 'text' });
inventorySchema.index({ quantity: 1 });
inventorySchema.index({ location: 1 });

export default model<IInventoryDocument>('Inventory', inventorySchema);