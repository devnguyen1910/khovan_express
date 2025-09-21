// MongoDB initialization script for Kho Vận Express
// This script will create the database and initial collections with sample data

// Switch to khovan_express database
db = db.getSiblingDB('khovan_express');

// Create user for the application
db.createUser({
  user: 'khovan_user',
  pwd: 'khovan_password',
  roles: [
    {
      role: 'readWrite',
      db: 'khovan_express'
    }
  ]
});

// Create collections and insert sample data
print('Creating Inventory collection...');
db.inventory.insertMany([
  {
    name: 'Máy tính xách tay Dell Latitude',
    description: 'Máy tính xách tay dành cho doanh nghiệp',
    sku: 'DELL-LAT-001',
    category: 'Điện tử',
    quantity: 25,
    unit: 'Chiếc',
    unitPrice: 15000000,
    location: 'Kho A-01',
    supplier: 'Dell Technologies Vietnam',
    status: 'Có sẵn',
    lastUpdated: new Date(),
    createdAt: new Date()
  },
  {
    name: 'Bàn văn phòng gỗ công nghiệp',
    description: 'Bàn làm việc chữ L với ngăn kéo',
    sku: 'DESK-WD-001',
    category: 'Nội thất',
    quantity: 50,
    unit: 'Chiếc',
    unitPrice: 2500000,
    location: 'Kho B-12',
    supplier: 'Nội Thất Hòa Phát',
    status: 'Có sẵn',
    lastUpdated: new Date(),
    createdAt: new Date()
  },
  {
    name: 'Điện thoại Samsung Galaxy S24',
    description: 'Smartphone cao cấp với camera AI',
    sku: 'SAMSUNG-S24-001',
    category: 'Điện tử',
    quantity: 5,
    unit: 'Chiếc',
    unitPrice: 22000000,
    location: 'Kho A-05',
    supplier: 'Samsung Electronics Vietnam',
    status: 'Sắp hết',
    lastUpdated: new Date(),
    createdAt: new Date()
  }
]);

print('Creating Shipments collection...');
db.shipments.insertMany([
  {
    trackingNumber: 'KVE240001',
    origin: {
      name: 'Kho Vận Express - Hà Nội',
      address: '123 Đường Láng, Đống Đa, Hà Nội',
      phone: '024 3851 2345'
    },
    destination: {
      name: 'Công ty TNHH ABC',
      address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      phone: '024 3564 7890'
    },
    items: [
      {
        name: 'Máy tính xách tay Dell Latitude',
        quantity: 2,
        weight: 5.6
      }
    ],
    status: 'Đang vận chuyển',
    priority: 'Cao',
    estimatedDelivery: new Date('2024-12-25'),
    actualDelivery: null,
    totalWeight: 5.6,
    totalValue: 30000000,
    shippingCost: 250000,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date()
  },
  {
    trackingNumber: 'KVE240002',
    origin: {
      name: 'Kho Vận Express - TP.HCM',
      address: '789 Nguyễn Văn Cừ, Quận 5, TP.HCM',
      phone: '028 3835 1234'
    },
    destination: {
      name: 'Khách hàng Nguyễn Văn A',
      address: '321 Lê Văn Sỹ, Quận 3, TP.HCM',
      phone: '0901 234 567'
    },
    items: [
      {
        name: 'Bàn văn phòng gỗ công nghiệp',
        quantity: 1,
        weight: 25.0
      }
    ],
    status: 'Đã giao',
    priority: 'Trung bình',
    estimatedDelivery: new Date('2024-12-22'),
    actualDelivery: new Date('2024-12-21'),
    totalWeight: 25.0,
    totalValue: 2500000,
    shippingCost: 350000,
    createdAt: new Date('2024-12-18'),
    updatedAt: new Date('2024-12-21')
  }
]);

print('Creating Suppliers collection...');
db.suppliers.insertMany([
  {
    name: 'Dell Technologies Vietnam',
    contactPerson: 'Nguyễn Thành Long',
    email: 'long.nguyen@dell.com',
    phone: '024 3943 1234',
    address: 'Tầng 15, Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
    category: 'Điện tử',
    status: 'Hoạt động',
    paymentTerms: '30 ngày',
    deliveryTime: '7-14 ngày',
    rating: 4.8,
    totalOrders: 125,
    totalValue: 1875000000,
    createdAt: new Date('2024-01-15'),
    lastContact: new Date('2024-12-15')
  },
  {
    name: 'Nội Thất Hòa Phát',
    contactPerson: 'Trần Minh Hải',
    email: 'hai.tran@hoaphat.com.vn',
    phone: '024 3876 5432',
    address: '66 Nguyễn Du, Hai Bà Trưng, Hà Nội',
    category: 'Nội thất',
    status: 'Hoạt động',
    paymentTerms: '15 ngày',
    deliveryTime: '3-7 ngày',
    rating: 4.5,
    totalOrders: 89,
    totalValue: 445000000,
    createdAt: new Date('2024-02-01'),
    lastContact: new Date('2024-12-10')
  },
  {
    name: 'Samsung Electronics Vietnam',
    contactPerson: 'Park Min Soo',
    email: 'minsoo.park@samsung.com',
    phone: '028 3821 9876',
    address: 'Tầng 8, Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP.HCM',
    category: 'Điện tử',
    status: 'Hoạt động',
    paymentTerms: '45 ngày',
    deliveryTime: '5-10 ngày',
    rating: 4.9,
    totalOrders: 76,
    totalValue: 1672000000,
    createdAt: new Date('2024-03-10'),
    lastContact: new Date('2024-12-18')
  }
]);

// Create indexes for better performance
print('Creating indexes...');

// Inventory indexes
db.inventory.createIndex({ "sku": 1 }, { unique: true });
db.inventory.createIndex({ "category": 1 });
db.inventory.createIndex({ "status": 1 });
db.inventory.createIndex({ "name": "text", "description": "text" });

// Shipments indexes
db.shipments.createIndex({ "trackingNumber": 1 }, { unique: true });
db.shipments.createIndex({ "status": 1 });
db.shipments.createIndex({ "priority": 1 });
db.shipments.createIndex({ "createdAt": -1 });

// Suppliers indexes
db.suppliers.createIndex({ "name": 1 }, { unique: true });
db.suppliers.createIndex({ "category": 1 });
db.suppliers.createIndex({ "status": 1 });
db.suppliers.createIndex({ "email": 1 }, { unique: true });

print('Database initialization completed successfully!');
print('Collections created: inventory, shipments, suppliers');
print('Sample data inserted and indexes created.');