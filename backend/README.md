# Kho Vận Express - Backend API

Backend REST API cho hệ thống quản lý kho vận và logistics Kho Vận Express. Được xây dựng với Node.js, Express, TypeScript, và MongoDB.

## 🚀 Tính năng

- **RESTful API** với CRUD operations đầy đủ
- **MongoDB** với Mongoose ODM
- **TypeScript** để type safety
- **Express.js** framework
- **Validation** với Joi và Mongoose schemas
- **Error Handling** middleware
- **CORS** support
- **Rate Limiting** để bảo mật
- **Logging** với Winston
- **Database seeding** với dữ liệu mẫu tiếng Việt

## 📋 Yêu cầu hệ thống

- Node.js >= 18.0.0
- MongoDB >= 4.4
- npm hoặc yarn

## 🛠️ Cài đặt

1. **Clone repository và di chuyển vào thư mục backend:**
   ```bash
   cd backend
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Tạo file môi trường:**
   ```bash
   cp .env.example .env
   ```

4. **Cấu hình biến môi trường trong `.env`:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/khovan_express
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGINS=http://localhost:3000,http://localhost:5173
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

5. **Khởi chạy MongoDB** (nếu chạy local):
   ```bash
   mongod
   ```

6. **Seed database với dữ liệu mẫu:**
   ```bash
   npm run seed
   ```

7. **Khởi chạy server development:**
   ```bash
   npm run dev
   ```

Server sẽ chạy tại: `http://localhost:5000`

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/          # Cấu hình database và app
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Database seeding scripts
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── dist/                # Compiled JavaScript (after build)
├── logs/                # Log files
├── .env.example         # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## 🔗 API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan
- `GET /api/dashboard/shipment-distribution` - Phân bổ trạng thái lô hàng
- `GET /api/dashboard/recent-activity` - Hoạt động gần đây

### Inventory (Tồn kho)
- `GET /api/inventory` - Danh sách sản phẩm (có pagination)
- `GET /api/inventory/:id` - Chi tiết sản phẩm
- `POST /api/inventory` - Tạo sản phẩm mới
- `PUT /api/inventory/:id` - Cập nhật sản phẩm
- `DELETE /api/inventory/:id` - Xóa sản phẩm

#### Query Parameters cho GET /api/inventory:
- `page` - Trang hiện tại (default: 1)
- `limit` - Số items per page (default: 10)
- `search` - Tìm kiếm theo tên, SKU, nhà cung cấp
- `location` - Lọc theo vị trí kho
- `lowStock` - Lọc sản phẩm sắp hết hàng (true/false)

### Shipments (Lô hàng)
- `GET /api/shipments` - Danh sách lô hàng (có pagination)
- `GET /api/shipments/:id` - Chi tiết lô hàng
- `GET /api/shipments/track/:trackingNumber` - Tra cứu theo mã vận đơn
- `POST /api/shipments` - Tạo lô hàng mới
- `PUT /api/shipments/:id` - Cập nhật lô hàng
- `PATCH /api/shipments/:id/status` - Cập nhật trạng thái
- `DELETE /api/shipments/:id` - Xóa lô hàng

#### Query Parameters cho GET /api/shipments:
- `page` - Trang hiện tại
- `limit` - Số items per page
- `status` - Lọc theo trạng thái
- `origin` - Lọc theo điểm đi
- `destination` - Lọc theo điểm đến

### Suppliers (Nhà cung cấp)
- `GET /api/suppliers` - Danh sách nhà cung cấp (có pagination)
- `GET /api/suppliers/:id` - Chi tiết nhà cung cấp
- `POST /api/suppliers` - Tạo nhà cung cấp mới
- `PUT /api/suppliers/:id` - Cập nhật nhà cung cấp
- `DELETE /api/suppliers/:id` - Xóa nhà cung cấp

#### Query Parameters cho GET /api/suppliers:
- `page` - Trang hiện tại
- `limit` - Số items per page
- `search` - Tìm kiếm theo tên, người liên hệ
- `minRating` - Lọc theo đánh giá tối thiểu

## 📊 Response Format

Tất cả API responses đều theo format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

Hoặc khi có lỗi:

```json
{
  "success": false,
  "error": "Error message"
}
```

## 🧪 Scripts

```bash
# Development
npm run dev              # Chạy với nodemon (auto-reload)
npm run start:dev        # Chạy với ts-node

# Production  
npm run build            # Compile TypeScript
npm run start            # Chạy compiled JavaScript

# Database
npm run seed             # Seed database với dữ liệu mẫu

# Code Quality
npm run lint             # Check linting
npm run lint:fix         # Fix linting issues
npm test                 # Chạy tests
```

## 🔒 Bảo mật

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Chỉ allow origins được cấu hình
- **Helmet**: Security headers
- **Input Validation**: Mongoose schemas + custom validation
- **Error Handling**: Không leak sensitive information

## 🏗️ Database Schema

### Inventory (Tồn kho)
```typescript
{
  name: string,           // Tên sản phẩm
  sku: string,            // Mã SKU (unique)
  quantity: number,       // Số lượng
  location: string,       // Vị trí kho
  imageUrl: string,       // URL hình ảnh
  supplier: string,       // Nhà cung cấp
  createdAt: Date,
  updatedAt: Date
}
```

### Shipment (Lô hàng)
```typescript
{
  trackingNumber: string, // Mã vận đơn (unique)
  origin: string,         // Điểm đi
  destination: string,    // Điểm đến
  status: ShipmentStatus, // Trạng thái
  estimatedDelivery: Date,// Ngày giao hàng dự kiến
  weight: number,         // Cân nặng (kg)
  createdAt: Date,
  updatedAt: Date
}
```

### Supplier (Nhà cung cấp)
```typescript
{
  name: string,           // Tên công ty (unique)
  contactPerson: string,  // Người liên hệ
  email: string,          // Email
  phone: string,          // Số điện thoại
  address: string,        // Địa chỉ
  productsSupplied: number, // Số sản phẩm cung cấp
  rating: number,         // Đánh giá (1-5)
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development

### Thêm API endpoint mới:

1. **Tạo controller** trong `src/controllers/`
2. **Thêm route** trong `src/routes/`
3. **Import route** vào `src/app.ts`
4. **Test API** với Postman hoặc curl

### Database Indexes:

Các indexes đã được tối ưu cho:
- Text search trên name, sku, supplier
- Filtering theo status, rating, quantity
- Sorting theo createdAt, rating

## 📝 Logs

Logs được lưu trong thư mục `logs/`:
- `error.log` - Chỉ errors
- `combined.log` - Tất cả logs
- Console output trong development mode

## 🚀 Production Deployment

1. **Build project:**
   ```bash
   npm run build
   ```

2. **Set production environment:**
   ```env
   NODE_ENV=production
   ```

3. **Chạy production server:**
   ```bash
   npm start
   ```

4. **Cấu hình reverse proxy** (nginx/apache)
5. **Setup process manager** (PM2)
6. **Configure MongoDB** với authentication

## 🤝 Contributing

1. Fork repo
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.