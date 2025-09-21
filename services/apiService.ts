/**
 * API Service for Kho Vận Express
 * Connects frontend to the Node.js/Express backend API
 */

import { InventoryItem, Shipment, Supplier, ShipmentStatus } from '../types';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data;
}

// Transform backend data to frontend format
function transformInventoryItem(item: any): InventoryItem {
  return {
    id: item._id,
    name: item.name,
    sku: item.sku,
    quantity: item.quantity,
    location: item.location,
    supplier: item.supplier,
    imageUrl: `https://picsum.photos/seed/${item.sku}/200/200`, // Generate random image based on SKU
    description: item.description,
    category: item.category,
    unit: item.unit,
    unitPrice: item.unitPrice,
    status: item.status,
    minStockLevel: item.minStockLevel,
    maxStockLevel: item.maxStockLevel,
    lastUpdated: item.updatedAt
  };
}

function transformShipment(shipment: any): Shipment {
  return {
    id: shipment._id,
    trackingNumber: shipment.trackingNumber,
    origin: `${shipment.origin.name}, ${shipment.origin.address}`,
    destination: `${shipment.destination.name}, ${shipment.destination.address}`,
    status: mapShipmentStatus(shipment.status),
    estimatedDelivery: new Date(shipment.estimatedDelivery).toISOString().split('T')[0],
    actualDelivery: shipment.actualDelivery ? new Date(shipment.actualDelivery).toISOString().split('T')[0] : undefined,
    weight: shipment.totalWeight,
    totalValue: shipment.totalValue,
    shippingCost: shipment.shippingCost,
    priority: shipment.priority,
    items: shipment.items,
    notes: shipment.notes
  };
}

function transformSupplier(supplier: any): Supplier {
  return {
    id: supplier._id,
    name: supplier.name,
    contactPerson: supplier.contactPerson,
    email: supplier.email,
    phone: supplier.phone,
    address: supplier.address,
    category: supplier.category,
    status: supplier.status,
    paymentTerms: supplier.paymentTerms,
    deliveryTime: supplier.deliveryTime,
    rating: supplier.rating,
    totalOrders: supplier.totalOrders,
    totalValue: supplier.totalValue,
    productsSupplied: 0, // Will be calculated separately
    lastContact: supplier.lastContact
  };
}

// Map Vietnamese shipment status to enum
function mapShipmentStatus(status: string): ShipmentStatus {
  const statusMap: Record<string, ShipmentStatus> = {
    'Chờ xử lý': ShipmentStatus.Pending,
    'Đang vận chuyển': ShipmentStatus.InTransit,
    'Đã giao': ShipmentStatus.Delivered,
    'Đã hủy': ShipmentStatus.Cancelled,
    'Trì hoãn': ShipmentStatus.Delayed
  };
  return statusMap[status] || ShipmentStatus.Pending;
}

// API Functions

export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const items = await apiCall<any[]>('/inventory');
    return items.map(transformInventoryItem);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    // Fallback to empty array or throw error based on requirements
    throw new Error('Không thể tải dữ liệu kho hàng. Vui lòng kiểm tra kết nối backend.');
  }
};

export const getShipments = async (): Promise<Shipment[]> => {
  try {
    const shipments = await apiCall<any[]>('/shipments');
    return shipments.map(transformShipment);
  } catch (error) {
    console.error('Error fetching shipments:', error);
    throw new Error('Không thể tải dữ liệu vận chuyển. Vui lòng kiểm tra kết nối backend.');
  }
};

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    const suppliers = await apiCall<any[]>('/suppliers');
    const transformedSuppliers = suppliers.map(transformSupplier);
    
    // Get inventory to calculate products supplied count
    try {
      const inventory = await getInventoryItems();
      return transformedSuppliers.map(supplier => {
        const count = inventory.filter(item => item.supplier === supplier.name).length;
        return { ...supplier, productsSupplied: count };
      });
    } catch {
      // If inventory fails, return suppliers without product count
      return transformedSuppliers;
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw new Error('Không thể tải dữ liệu nhà cung cấp. Vui lòng kiểm tra kết nối backend.');
  }
};

export const getDashboardStats = async () => {
  try {
    const stats = await apiCall<any>('/dashboard/stats');
    return {
      totalInventory: stats.totalInventoryCount,
      inventoryValue: stats.totalInventoryValue,
      shipmentsInProgress: stats.shipmentsInProgress,
      issues: stats.delayedShipments + stats.cancelledShipments,
      recentShipments: stats.recentShipments || 0,
      lowStockItems: stats.lowStockItems || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default stats instead of throwing error for dashboard
    return {
      totalInventory: 0,
      inventoryValue: 0,
      shipmentsInProgress: 0,
      issues: 0,
      recentShipments: 0,
      lowStockItems: 0
    };
  }
};

// Additional API functions for CRUD operations

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  const response = await apiCall<any>('/inventory', {
    method: 'POST',
    body: JSON.stringify({
      name: item.name,
      description: item.description,
      sku: item.sku,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      location: item.location,
      supplier: item.supplier,
      status: item.status,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel
    })
  });
  return transformInventoryItem(response);
};

export const updateInventoryItem = async (id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> => {
  const response = await apiCall<any>(`/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return transformInventoryItem(response);
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  await apiCall(`/inventory/${id}`, {
    method: 'DELETE'
  });
};

export const createShipment = async (shipment: Omit<Shipment, 'id'>): Promise<Shipment> => {
  const response = await apiCall<any>('/shipments', {
    method: 'POST',
    body: JSON.stringify({
      trackingNumber: shipment.trackingNumber,
      origin: {
        name: shipment.origin.split(',')[0]?.trim(),
        address: shipment.origin.split(',').slice(1).join(',').trim(),
        phone: ''
      },
      destination: {
        name: shipment.destination.split(',')[0]?.trim(),
        address: shipment.destination.split(',').slice(1).join(',').trim(),
        phone: ''
      },
      items: shipment.items || [],
      status: Object.entries({
        [ShipmentStatus.Pending]: 'Chờ xử lý',
        [ShipmentStatus.InTransit]: 'Đang vận chuyển',
        [ShipmentStatus.Delivered]: 'Đã giao',
        [ShipmentStatus.Cancelled]: 'Đã hủy',
        [ShipmentStatus.Delayed]: 'Trì hoãn'
      }).find(([key]) => key === shipment.status)?.[1] || 'Chờ xử lý',
      priority: shipment.priority,
      estimatedDelivery: shipment.estimatedDelivery,
      totalWeight: shipment.weight,
      totalValue: shipment.totalValue,
      shippingCost: shipment.shippingCost,
      notes: shipment.notes
    })
  });
  return transformShipment(response);
};

export const updateShipment = async (id: string, updates: Partial<Shipment>): Promise<Shipment> => {
  const response = await apiCall<any>(`/shipments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return transformShipment(response);
};

export const deleteShipment = async (id: string): Promise<void> => {
  await apiCall(`/shipments/${id}`, {
    method: 'DELETE'
  });
};

export const createSupplier = async (supplier: Omit<Supplier, 'id' | 'productsSupplied'>): Promise<Supplier> => {
  const response = await apiCall<any>('/suppliers', {
    method: 'POST',
    body: JSON.stringify({
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      category: supplier.category,
      status: supplier.status,
      paymentTerms: supplier.paymentTerms,
      deliveryTime: supplier.deliveryTime,
      rating: supplier.rating
    })
  });
  return transformSupplier(response);
};

export const updateSupplier = async (id: string, updates: Partial<Supplier>): Promise<Supplier> => {
  const response = await apiCall<any>(`/suppliers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
  return transformSupplier(response);
};

export const deleteSupplier = async (id: string): Promise<void> => {
  await apiCall(`/suppliers/${id}`, {
    method: 'DELETE'
  });
};

// Search and filter functions
export const searchInventory = async (query: string): Promise<InventoryItem[]> => {
  const items = await apiCall<any[]>(`/inventory/search?q=${encodeURIComponent(query)}`);
  return items.map(transformInventoryItem);
};

export const searchShipments = async (query: string): Promise<Shipment[]> => {
  const shipments = await apiCall<any[]>(`/shipments/search?q=${encodeURIComponent(query)}`);
  return shipments.map(transformShipment);
};

export const getInventoryByCategory = async (category: string): Promise<InventoryItem[]> => {
  const items = await apiCall<any[]>(`/inventory?category=${encodeURIComponent(category)}`);
  return items.map(transformInventoryItem);
};

export const getShipmentsByStatus = async (status: ShipmentStatus): Promise<Shipment[]> => {
  const vietnameseStatus = Object.entries({
    [ShipmentStatus.Pending]: 'Chờ xử lý',
    [ShipmentStatus.InTransit]: 'Đang vận chuyển',
    [ShipmentStatus.Delivered]: 'Đã giao',
    [ShipmentStatus.Cancelled]: 'Đã hủy',
    [ShipmentStatus.Delayed]: 'Trì hoãn'
  }).find(([key]) => key === status)?.[1];
  
  const shipments = await apiCall<any[]>(`/shipments?status=${encodeURIComponent(vietnameseStatus || '')}`);
  return shipments.map(transformShipment);
};