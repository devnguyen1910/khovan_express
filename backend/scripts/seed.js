#!/usr/bin/env node

/**
 * MongoDB Database Seeding Script for Kho Vận Express
 * Run this script to populate the database with sample Vietnamese data
 */

import mongoose from 'mongoose';
import { config } from '../src/config/index.js';
import { Inventory } from '../src/models/Inventory.js';
import { Shipment } from '../src/models/Shipment.js';
import { Supplier } from '../src/models/Supplier.js';

// Sample data with Vietnamese content
const inventoryData = [
  {
    name: 'Máy tính xách tay Dell Latitude 5520',
    description: 'Máy tính xách tay dành cho doanh nghiệp với chip Intel Core i7, RAM 16GB, SSD 512GB',
    sku: 'DELL-LAT-5520-001',
    category: 'Điện tử',
    quantity: 25,
    unit: 'Chiếc',
    unitPrice: 15000000,
    location: 'Kho A-01-005',
    supplier: 'Dell Technologies Vietnam',
    status: 'Có sẵn',
    minStockLevel: 5,
    maxStockLevel: 50
  },
  {
    name: 'Bàn văn phòng gỗ công nghiệp chữ L',
    description: 'Bàn làm việc chữ L với 3 ngăn kéo, kích thước 140x120x75cm',
    sku: 'DESK-WD-L140-001',
    category: 'Nội thất',
    quantity: 50,
    unit: 'Chiếc',
    unitPrice: 2500000,
    location: 'Kho B-12-020',
    supplier: 'Nội Thất Hòa Phát',
    status: 'Có sẵn',
    minStockLevel: 10,
    maxStockLevel: 100
  },
  {
    name: 'Điện thoại Samsung Galaxy S24 Ultra',
    description: 'Smartphone cao cấp với camera AI 200MP, màn hình Dynamic AMOLED 6.8 inch',
    sku: 'SAMSUNG-S24U-512GB',
    category: 'Điện tử',
    quantity: 5,
    unit: 'Chiếc',
    unitPrice: 30000000,
    location: 'Kho A-05-003',
    supplier: 'Samsung Electronics Vietnam',
    status: 'Sắp hết',
    minStockLevel: 3,
    maxStockLevel: 20
  },
  {
    name: 'Ghế văn phòng ergonomic',
    description: 'Ghế xoay có tựa lưng, tay vịn điều chỉnh, chân nhôm 5 cánh',
    sku: 'CHAIR-ERGO-BK001',
    category: 'Nội thất',
    quantity: 75,
    unit: 'Chiếc',
    unitPrice: 1200000,
    location: 'Kho B-08-015',
    supplier: 'Nội Thất Hòa Phát',
    status: 'Có sẵn',
    minStockLevel: 15,
    maxStockLevel: 100
  },
  {
    name: 'Máy in laser HP LaserJet Pro',
    description: 'Máy in laser đen trắng tốc độ cao 28 trang/phút',
    sku: 'HP-LJ-PRO-M404N',
    category: 'Điện tử',
    quantity: 0,
    unit: 'Chiếc',
    unitPrice: 4500000,
    location: 'Kho A-03-007',
    supplier: 'HP Vietnam',
    status: 'Hết hàng',
    minStockLevel: 2,
    maxStockLevel: 15
  }
];

const suppliersData = [
  {
    name: 'Dell Technologies Vietnam',
    contactPerson: 'Nguyễn Thành Long',
    email: 'long.nguyen@dell.com.vn',
    phone: '024 3943 1234',
    address: 'Tầng 15, Keangnam Landmark 72, Phạm Hùng, Nam Từ Liêm, Hà Nội',
    category: 'Điện tử',
    status: 'Hoạt động',
    paymentTerms: '30 ngày',
    deliveryTime: '7-14 ngày',
    rating: 4.8,
    totalOrders: 125,
    totalValue: 1875000000
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
    totalValue: 445000000
  },
  {
    name: 'Samsung Electronics Vietnam',
    contactPerson: 'Park Min Soo',
    email: 'minsoo.park@samsung.vn',
    phone: '028 3821 9876',
    address: 'Tầng 8, Bitexco Financial Tower, 2 Hải Triều, Quận 1, TP.HCM',
    category: 'Điện tử',
    status: 'Hoạt động',
    paymentTerms: '45 ngày',
    deliveryTime: '5-10 ngày',
    rating: 4.9,
    totalOrders: 76,
    totalValue: 1672000000
  },
  {
    name: 'HP Vietnam',
    contactPerson: 'Lê Thị Minh Châu',
    email: 'chau.le@hp.com',
    phone: '028 3827 4567',
    address: 'Tầng 10, Tòa nhà Vietcombank, 5 Công Trường Mê Linh, Quận 1, TP.HCM',
    category: 'Điện tử',
    status: 'Hoạt động',
    paymentTerms: '30 ngày',
    deliveryTime: '10-15 ngày',
    rating: 4.3,
    totalOrders: 45,
    totalValue: 202500000
  }
];

const shipmentsData = [
  {
    trackingNumber: 'KVE240001',
    origin: {
      name: 'Kho Vận Express - Hà Nội',
      address: '123 Đường Láng, Đống Đa, Hà Nội',
      phone: '024 3851 2345'
    },
    destination: {
      name: 'Công ty TNHH ABC Tech',
      address: '456 Nguyễn Trãi, Thanh Xuân, Hà Nội',
      phone: '024 3564 7890'
    },
    items: [
      {
        name: 'Máy tính xách tay Dell Latitude 5520',
        quantity: 2,
        weight: 5.6,
        value: 30000000
      }
    ],
    status: 'Đang vận chuyển',
    priority: 'Cao',
    estimatedDelivery: new Date('2024-12-25'),
    totalWeight: 5.6,
    totalValue: 30000000,
    shippingCost: 250000,
    notes: 'Giao hàng trong giờ hành chính'
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
        name: 'Bàn văn phòng gỗ công nghiệp chữ L',
        quantity: 1,
        weight: 25.0,
        value: 2500000
      }
    ],
    status: 'Đã giao',
    priority: 'Trung bình',
    estimatedDelivery: new Date('2024-12-22'),
    actualDelivery: new Date('2024-12-21'),
    totalWeight: 25.0,
    totalValue: 2500000,
    shippingCost: 350000,
    notes: 'Đã giao thành công, khách hàng hài lòng'
  },
  {
    trackingNumber: 'KVE240003',
    origin: {
      name: 'Kho Vận Express - Đà Nẵng',
      address: '99 Trần Phú, Hải Châu, Đà Nẵng',
      phone: '0236 3123 456'
    },
    destination: {
      name: 'Trường Đại học Bách Khoa Đà Nẵng',
      address: '54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng',
      phone: '0236 3842 308'
    },
    items: [
      {
        name: 'Ghế văn phòng ergonomic',
        quantity: 20,
        weight: 240.0,
        value: 24000000
      }
    ],
    status: 'Chờ xử lý',
    priority: 'Thấp',
    estimatedDelivery: new Date('2024-12-28'),
    totalWeight: 240.0,
    totalValue: 24000000,
    shippingCost: 800000,
    notes: 'Giao hàng theo lịch hẹn với trường'
  }
];

async function seedDatabase() {
  try {
    console.log('🌾 Bắt đầu seeding database...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('✅ Đã kết nối MongoDB');

    // Clear existing data
    console.log('🗑️  Xóa dữ liệu cũ...');
    await Promise.all([
      Inventory.deleteMany({}),
      Supplier.deleteMany({}),
      Shipment.deleteMany({})
    ]);

    // Insert suppliers first (referenced by inventory)
    console.log('📦 Thêm dữ liệu nhà cung cấp...');
    const suppliers = await Supplier.insertMany(suppliersData);
    console.log(`✅ Đã thêm ${suppliers.length} nhà cung cấp`);

    // Insert inventory
    console.log('📦 Thêm dữ liệu kho hàng...');
    const inventory = await Inventory.insertMany(inventoryData);
    console.log(`✅ Đã thêm ${inventory.length} sản phẩm vào kho`);

    // Insert shipments
    console.log('🚚 Thêm dữ liệu vận chuyển...');
    const shipments = await Shipment.insertMany(shipmentsData);
    console.log(`✅ Đã thêm ${shipments.length} đơn vận chuyển`);

    // Create indexes
    console.log('🔍 Tạo indexes...');
    await Promise.all([
      Inventory.collection.createIndex({ sku: 1 }, { unique: true }),
      Inventory.collection.createIndex({ category: 1 }),
      Inventory.collection.createIndex({ status: 1 }),
      Inventory.collection.createIndex({ name: 'text', description: 'text' }),
      
      Supplier.collection.createIndex({ name: 1 }, { unique: true }),
      Supplier.collection.createIndex({ email: 1 }, { unique: true }),
      Supplier.collection.createIndex({ category: 1 }),
      
      Shipment.collection.createIndex({ trackingNumber: 1 }, { unique: true }),
      Shipment.collection.createIndex({ status: 1 }),
      Shipment.collection.createIndex({ priority: 1 }),
      Shipment.collection.createIndex({ createdAt: -1 })
    ]);
    console.log('✅ Đã tạo indexes');

    console.log('\n🎉 Database seeding hoàn thành!');
    console.log(`📊 Tổng kết:`);
    console.log(`   - ${suppliers.length} nhà cung cấp`);
    console.log(`   - ${inventory.length} sản phẩm kho`);
    console.log(`   - ${shipments.length} đơn vận chuyển`);
    
  } catch (error) {
    console.error('❌ Lỗi khi seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Đã đóng kết nối database');
    process.exit(0);
  }
}

// Run seeding
seedDatabase();