# MongoDB Atlas Setup Guide for Kho Vận Express

## Bước 1: Tạo MongoDB Atlas Account

1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Đăng ký tài khoản miễn phí (Free Tier)
3. Tạo Organization mới tên "Kho Vận Express"

## Bước 2: Tạo Database Cluster

1. Click **"Build a Database"**
2. Chọn **"M0 Sandbox"** (Free tier)
3. Chọn region **Singapore** hoặc **Tokyo** (gần Việt Nam nhất)
4. Đặt tên cluster: `khovan-express-cluster`

## Bước 3: Tạo Database User

1. Trong **Database Access**, click **"Add New Database User"**
2. Username: `khovan_user`
3. Password: `khovan_password_2024` (hoặc tự tạo password mạnh)
4. Database User Privileges: **Read and write to any database**

## Bước 4: Whitelist IP Address

1. Trong **Network Access**, click **"Add IP Address"**
2. Chọn **"Allow Access from Anywhere"** (0.0.0.0/0) để test
3. Hoặc thêm IP cụ thể của bạn

## Bước 5: Lấy Connection String

1. Trong **Database**, click **"Connect"** trên cluster
2. Chọn **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy connection string, có dạng:
   ```
   mongodb+srv://khovan_user:<password>@khovan-express-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=khovan-express-cluster
   ```

## Bước 6: Cập nhật Backend .env

Cập nhật file `backend/.env`:
```env
MONGODB_URI=mongodb+srv://khovan_user:khovan_password_2024@khovan-express-cluster.xxxxx.mongodb.net/khovan_express?retryWrites=true&w=majority&appName=khovan-express-cluster
```

## Bước 7: Chạy Seeding Script

```bash
cd backend
npm run seed
```

## Kết nối với VS Code MongoDB Extension

1. Mở VS Code
2. Mở MongoDB Extension
3. Click **"Add Connection"**
4. Paste connection string từ Atlas
5. Đặt tên connection: "Kho Vận Express Atlas"

## Database Structure

Sau khi setup, database sẽ có các collections:
- `inventory` - Quản lý kho hàng
- `shipments` - Quản lý đơn vận chuyển  
- `suppliers` - Quản lý nhà cung cấp

## Troubleshooting

### Lỗi "Authentication failed"
- Kiểm tra username/password trong connection string
- Đảm bảo user có quyền read/write database

### Lỗi "IP not whitelisted"
- Thêm IP address hiện tại vào Network Access
- Hoặc allow access from anywhere để test

### Lỗi connection timeout
- Kiểm tra internet connection
- Thử region khác (Singapore, Tokyo, Mumbai)

## VS Code MongoDB Extension Commands

Sau khi kết nối thành công:
- **Ctrl+Shift+P** → "MongoDB: Connect"
- Explore collections trong sidebar
- Chạy queries trong MongoDB Playground