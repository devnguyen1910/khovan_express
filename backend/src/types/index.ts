export enum ShipmentStatus {
  PENDING = 'Chờ xử lý',
  IN_TRANSIT = 'Đang vận chuyển',
  DELIVERED = 'Đã giao hàng',
  CANCELLED = 'Đã huỷ',
  DELAYED = 'Bị trì hoãn',
}

export interface IInventoryItem {
  name: string;
  sku: string;
  quantity: number;
  location: string;
  imageUrl: string;
  supplier: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShipment {
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedDelivery: Date;
  weight: number; // in kg
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISupplier {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  rating: number; // from 1 to 5
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDashboardStats {
  totalInventory: number;
  inventoryValue: number;
  shipmentsInProgress: number;
  issues: number;
}

export interface ISupplierSuggestion {
  name: string;
  specialty: string;
  reason: string;
}

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}