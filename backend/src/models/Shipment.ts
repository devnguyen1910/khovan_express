import { Schema, Document, model } from 'mongoose';
import { IShipment, ShipmentStatus } from '../types';

export interface IShipmentDocument extends IShipment, Document {}

const shipmentSchema = new Schema<IShipmentDocument>({
  trackingNumber: {
    type: String,
    required: [true, 'Mã vận đơn là bắt buộc'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [/^SPE[0-9]{10}[A-Z]$/, 'Mã vận đơn không đúng định dạng (SPE1234567890A)']
  },
  origin: {
    type: String,
    required: [true, 'Điểm đi là bắt buộc'],
    trim: true,
    maxlength: [100, 'Điểm đi không được vượt quá 100 ký tự']
  },
  destination: {
    type: String,
    required: [true, 'Điểm đến là bắt buộc'],
    trim: true,
    maxlength: [100, 'Điểm đến không được vượt quá 100 ký tự']
  },
  status: {
    type: String,
    required: [true, 'Trạng thái là bắt buộc'],
    enum: {
      values: Object.values(ShipmentStatus),
      message: 'Trạng thái không hợp lệ'
    },
    default: ShipmentStatus.PENDING
  },
  estimatedDelivery: {
    type: Date,
    required: [true, 'Ngày giao hàng dự kiến là bắt buộc']
  },
  weight: {
    type: Number,
    required: [true, 'Cân nặng là bắt buộc'],
    min: [0.1, 'Cân nặng phải lớn hơn 0.1 kg'],
    max: [1000, 'Cân nặng không được vượt quá 1000 kg']
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
shipmentSchema.index({ trackingNumber: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ origin: 1, destination: 1 });
shipmentSchema.index({ estimatedDelivery: 1 });

export default model<IShipmentDocument>('Shipment', shipmentSchema);