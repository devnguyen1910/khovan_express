export enum ShipmentStatus {
  Pending = 'Chờ xử lý',
  InTransit = 'Đang vận chuyển',
  Delivered = 'Đã giao hàng',
  Cancelled = 'Đã huỷ',
  Delayed = 'Bị trì hoãn',
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  weight: number; // in kg
  actualDelivery?: string;
  totalValue?: number;
  shippingCost?: number;
  priority?: string;
  items?: any[];
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  location: string;
  imageUrl: string;
  supplier: string;
  description?: string;
  category?: string;
  unit?: string;
  unitPrice?: number;
  status?: string;
  minStockLevel?: number;
  maxStockLevel?: number;
  lastUpdated?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  productsSupplied: number;
  rating: number; // from 1 to 5
  category?: string;
  status?: string;
  paymentTerms?: string;
  deliveryTime?: string;
  totalOrders?: number;
  totalValue?: number;
  lastContact?: string;
}

export interface SupplierSuggestion {
  name: string;
  specialty: string;
  reason: string;
}
