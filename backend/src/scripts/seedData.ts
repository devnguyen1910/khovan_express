import { connectDB, disconnectDB } from '../config/database';
import { Inventory, Shipment, Supplier } from '../models';
import { ShipmentStatus } from '../types';
import logger from '../utils/logger';

const inventoryData = [
  { name: 'Laptop Pro 15"', sku: 'LP15-2024', quantity: 150, location: 'Kho A-1', supplier: 'TechCorp', imageUrl: 'https://picsum.photos/seed/laptop/200/200' },
  { name: 'Bàn phím cơ RGB', sku: 'MK-RGB-01', quantity: 300, location: 'Kho B-3', supplier: 'GamerGear', imageUrl: 'https://picsum.photos/seed/keyboard/200/200' },
  { name: 'Chuột không dây Ergonomic', sku: 'EM-W-500', quantity: 450, location: 'Kho A-2', supplier: 'OfficePro', imageUrl: 'https://picsum.photos/seed/mouse/200/200' },
  { name: 'Màn hình UltraWide 34"', sku: 'UW34-QHD', quantity: 8, location: 'Kho C-1', supplier: 'ViewMax', imageUrl: 'https://picsum.photos/seed/monitor/200/200' },
  { name: 'Tai nghe chống ồn', sku: 'NC-HDP-7', quantity: 220, location: 'Kho B-1', supplier: 'SoundWave', imageUrl: 'https://picsum.photos/seed/headphones/200/200' },
  { name: 'Ổ cứng SSD 1TB', sku: 'SSD-1TB-NVME', quantity: 500, location: 'Kho A-3', supplier: 'DataFast', imageUrl: 'https://picsum.photos/seed/ssd/200/200' },
  { name: 'Webcam 4K', sku: 'WC-4K-PRO', quantity: 180, location: 'Kho C-2', supplier: 'StreamPro', imageUrl: 'https://picsum.photos/seed/webcam/200/200' },
  { name: 'Ghế công thái học', sku: 'ERG-CHR-22', quantity: 95, location: 'Kho D-1', supplier: 'ComfortZone', imageUrl: 'https://picsum.photos/seed/chair/200/200' },
  { name: 'Bàn nâng hạ điện', sku: 'SIT-STD-XL', quantity: 120, location: 'Kho D-2', supplier: 'UpDesk', imageUrl: 'https://picsum.photos/seed/desk/200/200' },
  { name: 'Microphone Studio', sku: 'MIC-PRO-XLR', quantity: 5, location: 'Kho B-4', supplier: 'AudioPro', imageUrl: 'https://picsum.photos/seed/mic/200/200' },
];

const shipmentData = [
  { trackingNumber: 'SPE6839284759A', origin: 'Hà Nội', destination: 'TP. Hồ Chí Minh', status: ShipmentStatus.IN_TRANSIT, estimatedDelivery: new Date('2024-08-01'), weight: 5.2 },
  { trackingNumber: 'SPE6839284750B', origin: 'Đà Nẵng', destination: 'Hải Phòng', status: ShipmentStatus.DELIVERED, estimatedDelivery: new Date('2024-07-28'), weight: 1.5 },
  { trackingNumber: 'SPE6839284751C', origin: 'Cần Thơ', destination: 'Hà Nội', status: ShipmentStatus.PENDING, estimatedDelivery: new Date('2024-08-03'), weight: 20.0 },
  { trackingNumber: 'SPE6839284752D', origin: 'TP. Hồ Chí Minh', destination: 'Đà Nẵng', status: ShipmentStatus.CANCELLED, estimatedDelivery: new Date('2024-07-29'), weight: 0.8 },
  { trackingNumber: 'SPE6839284753E', origin: 'Hải Phòng', destination: 'Nha Trang', status: ShipmentStatus.IN_TRANSIT, estimatedDelivery: new Date('2024-08-02'), weight: 3.4 },
  { trackingNumber: 'SPE6839284754F', origin: 'Nha Trang', destination: 'Hà Nội', status: ShipmentStatus.DELIVERED, estimatedDelivery: new Date('2024-07-27'), weight: 12.1 },
  { trackingNumber: 'SPE6839284755G', origin: 'Biên Hòa', destination: 'TP. Hồ Chí Minh', status: ShipmentStatus.DELAYED, estimatedDelivery: new Date('2024-07-30'), weight: 7.6 },
];

const supplierData = [
  { name: 'TechCorp', contactPerson: 'Nguyễn Văn An', email: 'an.nv@techcorp.com', phone: '0901234567', address: 'Khu công nghệ cao Hòa Lạc, Hà Nội', productsSupplied: 1, rating: 5 },
  { name: 'GamerGear', contactPerson: 'Trần Thị Bích', email: 'bich.tt@gamergear.vn', phone: '0912345678', address: 'Quận 1, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
  { name: 'OfficePro', contactPerson: 'Lê Minh Cường', email: 'cuong.lm@officepro.com', phone: '0987654321', address: 'Quận Cầu Giấy, Hà Nội', productsSupplied: 1, rating: 4 },
  { name: 'ViewMax', contactPerson: 'Phạm Hồng Duyên', email: 'duyen.ph@viewmax.com', phone: '0934567890', address: 'Quận 3, TP. Hồ Chí Minh', productsSupplied: 1, rating: 5 },
  { name: 'SoundWave', contactPerson: 'Hoàng Văn Em', email: 'em.hv@soundwave.audio', phone: '0945678901', address: 'KCN Sóng Thần, Bình Dương', productsSupplied: 1, rating: 3 },
  { name: 'DataFast', contactPerson: 'Vũ Thị Lan', email: 'lan.vt@datafast.com', phone: '0967890123', address: 'KCN An Đồn, Đà Nẵng', productsSupplied: 1, rating: 5 },
  { name: 'StreamPro', contactPerson: 'Đặng Quốc Tuấn', email: 'tuan.dq@streampro.io', phone: '0978901234', address: 'Quận 10, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
  { name: 'ComfortZone', contactPerson: 'Bùi Thu Trang', email: 'trang.bt@comfortzone.vn', phone: '0989012345', address: 'Huyện Hoài Đức, Hà Nội', productsSupplied: 1, rating: 5 },
  { name: 'UpDesk', contactPerson: 'Ngô Gia Huy', email: 'huy.ng@updesk.com', phone: '0909123456', address: 'Quận 7, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
  { name: 'AudioPro', contactPerson: 'Dương Mỹ Linh', email: 'linh.dm@audiopro.com', phone: '0918234567', address: 'Quận Ba Đình, Hà Nội', productsSupplied: 1, rating: 5 },
];

const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting database seeding...');
    
    await connectDB();
    
    // Clear existing data
    logger.info('🗑️  Clearing existing data...');
    await Promise.all([
      Inventory.deleteMany({}),
      Shipment.deleteMany({}),
      Supplier.deleteMany({})
    ]);
    
    // Insert seed data
    logger.info('📦 Inserting suppliers...');
    await Supplier.insertMany(supplierData);
    
    logger.info('📦 Inserting inventory items...');
    await Inventory.insertMany(inventoryData);
    
    logger.info('🚚 Inserting shipments...');
    await Shipment.insertMany(shipmentData);
    
    logger.info('✅ Database seeding completed successfully!');
    logger.info(`📊 Inserted: ${supplierData.length} suppliers, ${inventoryData.length} inventory items, ${shipmentData.length} shipments`);
    
  } catch (error) {
    logger.error('❌ Database seeding failed:', error);
    throw error;
  } finally {
    await disconnectDB();
  }
};

// Run seeding if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  seedDatabase()
    .then(() => {
      logger.info('🎉 Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;