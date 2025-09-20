import { InventoryItem, Shipment, ShipmentStatus, Supplier } from '../types';

const inventoryItems: InventoryItem[] = [
  { id: '1', name: 'Laptop Pro 15"', sku: 'LP15-2024', quantity: 150, location: 'Kho A-1', supplier: 'TechCorp', imageUrl: 'https://picsum.photos/seed/laptop/200/200' },
  { id: '2', name: 'Bàn phím cơ RGB', sku: 'MK-RGB-01', quantity: 300, location: 'Kho B-3', supplier: 'GamerGear', imageUrl: 'https://picsum.photos/seed/keyboard/200/200' },
  { id: '3', name: 'Chuột không dây Ergonomic', sku: 'EM-W-500', quantity: 450, location: 'Kho A-2', supplier: 'OfficePro', imageUrl: 'https://picsum.photos/seed/mouse/200/200' },
  { id: '4', name: 'Màn hình UltraWide 34"', sku: 'UW34-QHD', quantity: 8, location: 'Kho C-1', supplier: 'ViewMax', imageUrl: 'https://picsum.photos/seed/monitor/200/200' },
  { id: '5', name: 'Tai nghe chống ồn', sku: 'NC-HDP-7', quantity: 220, location: 'Kho B-1', supplier: 'SoundWave', imageUrl: 'https://picsum.photos/seed/headphones/200/200' },
  { id: '6', name: 'Ổ cứng SSD 1TB', sku: 'SSD-1TB-NVME', quantity: 500, location: 'Kho A-3', supplier: 'DataFast', imageUrl: 'https://picsum.photos/seed/ssd/200/200' },
  { id: '7', name: 'Webcam 4K', sku: 'WC-4K-PRO', quantity: 180, location: 'Kho C-2', supplier: 'StreamPro', imageUrl: 'https://picsum.photos/seed/webcam/200/200' },
  { id: '8', name: 'Ghế công thái học', sku: 'ERG-CHR-22', quantity: 95, location: 'Kho D-1', supplier: 'ComfortZone', imageUrl: 'https://picsum.photos/seed/chair/200/200' },
  { id: '9', name: 'Bàn nâng hạ điện', sku: 'SIT-STD-XL', quantity: 120, location: 'Kho D-2', supplier: 'UpDesk', imageUrl: 'https://picsum.photos/seed/desk/200/200' },
  { id: '10', name: 'Microphone Studio', sku: 'MIC-PRO-XLR', quantity: 5, location: 'Kho B-4', supplier: 'AudioPro', imageUrl: 'https://picsum.photos/seed/mic/200/200' },
];

const shipments: Shipment[] = [
  { id: '1', trackingNumber: 'SPE6839284759A', origin: 'Hà Nội', destination: 'TP. Hồ Chí Minh', status: ShipmentStatus.InTransit, estimatedDelivery: '2024-08-01', weight: 5.2 },
  { id: '2', trackingNumber: 'SPE6839284750B', origin: 'Đà Nẵng', destination: 'Hải Phòng', status: ShipmentStatus.Delivered, estimatedDelivery: '2024-07-28', weight: 1.5 },
  { id: '3', trackingNumber: 'SPE6839284751C', origin: 'Cần Thơ', destination: 'Hà Nội', status: ShipmentStatus.Pending, estimatedDelivery: '2024-08-03', weight: 20.0 },
  { id: '4', trackingNumber: 'SPE6839284752D', origin: 'TP. Hồ Chí Minh', destination: 'Đà Nẵng', status: ShipmentStatus.Cancelled, estimatedDelivery: '2024-07-29', weight: 0.8 },
  { id: '5', trackingNumber: 'SPE6839284753E', origin: 'Hải Phòng', destination: 'Nha Trang', status: ShipmentStatus.InTransit, estimatedDelivery: '2024-08-02', weight: 3.4 },
  { id: '6', trackingNumber: 'SPE6839284754F', origin: 'Nha Trang', destination: 'Hà Nội', status: ShipmentStatus.Delivered, estimatedDelivery: '2024-07-27', weight: 12.1 },
  { id: '7', trackingNumber: 'SPE6839284755G', origin: 'Biên Hòa', destination: 'TP. Hồ Chí Minh', status: ShipmentStatus.Delayed, estimatedDelivery: '2024-07-30', weight: 7.6 },
];

const suppliers: Supplier[] = [
    { id: '1', name: 'TechCorp', contactPerson: 'Nguyễn Văn An', email: 'an.nv@techcorp.com', phone: '0901234567', address: 'Khu công nghệ cao Hòa Lạc, Hà Nội', productsSupplied: 1, rating: 5 },
    { id: '2', name: 'GamerGear', contactPerson: 'Trần Thị Bích', email: 'bich.tt@gamergear.vn', phone: '0912345678', address: 'Quận 1, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
    { id: '3', name: 'OfficePro', contactPerson: 'Lê Minh Cường', email: 'cuong.lm@officepro.com', phone: '0987654321', address: 'Quận Cầu Giấy, Hà Nội', productsSupplied: 1, rating: 4 },
    { id: '4', name: 'ViewMax', contactPerson: 'Phạm Hồng Duyên', email: 'duyen.ph@viewmax.com', phone: '0934567890', address: 'Quận 3, TP. Hồ Chí Minh', productsSupplied: 1, rating: 5 },
    { id: '5', name: 'SoundWave', contactPerson: 'Hoàng Văn Em', email: 'em.hv@soundwave.audio', phone: '0945678901', address: 'KCN Sóng Thần, Bình Dương', productsSupplied: 1, rating: 3 },
    { id: '6', name: 'DataFast', contactPerson: 'Vũ Thị Lan', email: 'lan.vt@datafast.com', phone: '0967890123', address: 'KCN An Đồn, Đà Nẵng', productsSupplied: 1, rating: 5 },
    { id: '7', name: 'StreamPro', contactPerson: 'Đặng Quốc Tuấn', email: 'tuan.dq@streampro.io', phone: '0978901234', address: 'Quận 10, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
    { id: '8', name: 'ComfortZone', contactPerson: 'Bùi Thu Trang', email: 'trang.bt@comfortzone.vn', phone: '0989012345', address: 'Huyện Hoài Đức, Hà Nội', productsSupplied: 1, rating: 5 },
    { id: '9', name: 'UpDesk', contactPerson: 'Ngô Gia Huy', email: 'huy.ng@updesk.com', phone: '0909123456', address: 'Quận 7, TP. Hồ Chí Minh', productsSupplied: 1, rating: 4 },
    { id: '10', name: 'AudioPro', contactPerson: 'Dương Mỹ Linh', email: 'linh.dm@audiopro.com', phone: '0918234567', address: 'Quận Ba Đình, Hà Nội', productsSupplied: 1, rating: 5 },
];


export const getInventoryItems = async (): Promise<InventoryItem[]> => {
  return new Promise(resolve => setTimeout(() => resolve(inventoryItems), 500));
};

export const getShipments = async (): Promise<Shipment[]> => {
  return new Promise(resolve => setTimeout(() => resolve(shipments), 500));
};

export const getSuppliers = async (): Promise<Supplier[]> => {
    return new Promise(resolve => setTimeout(() => {
        const suppliersWithProductCount = suppliers.map(supplier => {
            const count = inventoryItems.filter(item => item.supplier === supplier.name).length;
            return { ...supplier, productsSupplied: count };
        });
        resolve(suppliersWithProductCount);
    }, 500));
};

export const getDashboardStats = async () => {
    return new Promise(resolve => setTimeout(() => resolve({
        totalInventory: inventoryItems.reduce((sum, item) => sum + item.quantity, 0),
        inventoryValue: 1258300, // Mock value
        shipmentsInProgress: shipments.filter(s => s.status === ShipmentStatus.InTransit).length,
        issues: shipments.filter(s => s.status === ShipmentStatus.Delayed || s.status === ShipmentStatus.Cancelled).length,
    }), 500));
};
