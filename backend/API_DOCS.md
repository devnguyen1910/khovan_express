# Kho Vận Express API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Hiện tại API chưa require authentication. Sẽ được thêm JWT authentication trong phiên bản tiếp theo.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
```

## Endpoints

### Health Check

#### GET /health
Kiểm tra trạng thái server

**Response:**
```json
{
  "success": true,
  "message": "Kho Vận Express API đang hoạt động",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

## Dashboard Endpoints

### GET /dashboard/stats
Lấy thống kê tổng quan dashboard

**Response:**
```json
{
  "success": true,
  "data": {
    "totalInventory": 2023,
    "inventoryValue": 1258300,
    "shipmentsInProgress": 3,
    "issues": 2
  }
}
```

### GET /dashboard/shipment-distribution
Lấy phân bổ trạng thái lô hàng cho biểu đồ

**Response:**
```json
{
  "success": true,
  "data": [
    { "status": "Chờ xử lý", "count": 5 },
    { "status": "Đang vận chuyển", "count": 8 },
    { "status": "Đã giao hàng", "count": 12 }
  ]
}
```

### GET /dashboard/recent-activity
Lấy hoạt động gần đây

**Query Parameters:**
- `limit` (optional): Số lượng items (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "recentShipments": [...],
    "recentInventory": [...]
  }
}
```

---

## Inventory Endpoints

### GET /inventory
Lấy danh sách sản phẩm tồn kho

**Query Parameters:**
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số items per page (default: 10)
- `search` (optional): Tìm kiếm theo name, sku, supplier
- `location` (optional): Lọc theo vị trí kho
- `lowStock` (optional): true/false - Lọc sản phẩm sắp hết hàng

**Example Request:**
```
GET /inventory?page=1&limit=20&search=laptop&lowStock=true
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Laptop Pro 15\"",
        "sku": "LP15-2024",
        "quantity": 150,
        "location": "Kho A-1",
        "imageUrl": "https://picsum.photos/seed/laptop/200/200",
        "supplier": "TechCorp",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### GET /inventory/:id
Lấy chi tiết một sản phẩm

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop Pro 15\"",
    "sku": "LP15-2024",
    "quantity": 150,
    "location": "Kho A-1",
    "imageUrl": "https://picsum.photos/seed/laptop/200/200",
    "supplier": "TechCorp",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST /inventory
Tạo sản phẩm mới

**Request Body:**
```json
{
  "name": "Laptop Pro 15\"",
  "sku": "LP15-2024",
  "quantity": 150,
  "location": "Kho A-1",
  "imageUrl": "https://picsum.photos/seed/laptop/200/200",
  "supplier": "TechCorp"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Sản phẩm đã được tạo thành công"
}
```

### PUT /inventory/:id
Cập nhật sản phẩm

**Request Body:** Tương tự POST

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Sản phẩm đã được cập nhật thành công"
}
```

### DELETE /inventory/:id
Xóa sản phẩm

**Response:**
```json
{
  "success": true,
  "message": "Sản phẩm đã được xóa thành công"
}
```

---

## Shipments Endpoints

### GET /shipments
Lấy danh sách lô hàng

**Query Parameters:**
- `page`, `limit`: Pagination
- `status`: Lọc theo trạng thái (Chờ xử lý, Đang vận chuyển, etc.)
- `origin`: Lọc theo điểm đi
- `destination`: Lọc theo điểm đến

**Response:**
```json
{
  "success": true,
  "data": {
    "shipments": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "trackingNumber": "SPE6839284759A",
        "origin": "Hà Nội",
        "destination": "TP. Hồ Chí Minh",
        "status": "Đang vận chuyển",
        "estimatedDelivery": "2024-08-01T00:00:00.000Z",
        "weight": 5.2,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### GET /shipments/track/:trackingNumber
Tra cứu lô hàng theo mã vận đơn

**Example:**
```
GET /shipments/track/SPE6839284759A
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### POST /shipments
Tạo lô hàng mới

**Request Body:**
```json
{
  "trackingNumber": "SPE6839284759A",
  "origin": "Hà Nội",
  "destination": "TP. Hồ Chí Minh",
  "status": "Chờ xử lý",
  "estimatedDelivery": "2024-08-01T00:00:00.000Z",
  "weight": 5.2
}
```

### PATCH /shipments/:id/status
Cập nhật trạng thái lô hàng

**Request Body:**
```json
{
  "status": "Đang vận chuyển"
}
```

**Các trạng thái hợp lệ:**
- "Chờ xử lý"
- "Đang vận chuyển"
- "Đã giao hàng"
- "Đã huỷ"
- "Bị trì hoãn"

---

## Suppliers Endpoints

### GET /suppliers
Lấy danh sách nhà cung cấp

**Query Parameters:**
- `page`, `limit`: Pagination
- `search`: Tìm kiếm theo name, contactPerson
- `minRating`: Lọc theo đánh giá tối thiểu

**Response:**
```json
{
  "success": true,
  "data": {
    "suppliers": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "name": "TechCorp",
        "contactPerson": "Nguyễn Văn An",
        "email": "an.nv@techcorp.com",
        "phone": "0901234567",
        "address": "Khu công nghệ cao Hòa Lạc, Hà Nội",
        "productsSupplied": 5,
        "rating": 5,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### POST /suppliers
Tạo nhà cung cấp mới

**Request Body:**
```json
{
  "name": "TechCorp",
  "contactPerson": "Nguyễn Văn An",
  "email": "an.nv@techcorp.com",
  "phone": "0901234567",
  "address": "Khu công nghệ cao Hòa Lạc, Hà Nội",
  "rating": 5
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request thành công |
| 201 | Created - Resource được tạo thành công |
| 400 | Bad Request - Request không hợp lệ |
| 404 | Not Found - Không tìm thấy resource |
| 429 | Too Many Requests - Vượt quá rate limit |
| 500 | Internal Server Error - Lỗi máy chủ |

## Common Error Messages

- "Không tìm thấy tài nguyên" - Resource not found
- "Dữ liệu đã tồn tại" - Duplicate data
- "Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau" - Rate limit exceeded
- "Lỗi máy chủ nội bộ" - Internal server error

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: Response sẽ include rate limit headers
- **Exceeded**: Return 429 status với error message

## Examples

### Tìm kiếm sản phẩm laptop sắp hết hàng:
```
GET /inventory?search=laptop&lowStock=true&limit=5
```

### Lấy lô hàng đang vận chuyển:
```
GET /shipments?status=Đang vận chuyển&page=1&limit=20
```

### Tìm nhà cung cấp đánh giá cao:
```
GET /suppliers?minRating=4&limit=10
```