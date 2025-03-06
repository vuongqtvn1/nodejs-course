# RESTful API Guide

## 1. Quy tắc đặt tên trong RESTful API

Quy tắc đặt tên giúp API dễ hiểu, nhất quán:

- **Dùng danh từ số nhiều** (không dùng động từ)
  ```plaintext
  ✅ GET /users  (Lấy danh sách user)
  ❌ GET /getUsers  (Sai, không cần dùng động từ)
  ```
- **Dùng gạch ngang (`-`) thay vì gạch dưới (`_`)**
  ```plaintext
  ✅ GET /user-orders
  ❌ GET /user_orders
  ```
- **Dùng query parameters cho bộ lọc**
  ```plaintext
  ✅ GET /products?category=electronics&price_lt=1000
  ❌ GET /products/electronics/under-1000
  ```
- **Sử dụng HTTP method đúng với hành động**
  ```plaintext
  ✅ DELETE /users/123  (Xóa user có ID 123)
  ❌ GET /deleteUser?id=123
  ```

## 2. HTTP Methods trong RESTful API

| Method   | Ý nghĩa           | Ví dụ               | Mô tả                      |
| -------- | ----------------- | ------------------- | -------------------------- |
| `GET`    | Lấy dữ liệu       | `GET /users`        | Lấy danh sách user         |
| `POST`   | Tạo dữ liệu mới   | `POST /users`       | Tạo user mới               |
| `PUT`    | Cập nhật toàn bộ  | `PUT /users/123`    | Cập nhật toàn bộ user 123  |
| `PATCH`  | Cập nhật một phần | `PATCH /users/123`  | Cập nhật một phần user 123 |
| `DELETE` | Xóa dữ liệu       | `DELETE /users/123` | Xóa user 123               |

### **Ví dụ chi tiết**

#### **1. Lấy danh sách sản phẩm**

```http
GET /products
```

**Response:**

```json
[
  { "id": 1, "name": "Laptop", "price": 1000 },
  { "id": 2, "name": "Phone", "price": 500 }
]
```

#### **2. Tạo sản phẩm mới**

```http
POST /products
Content-Type: application/json
```

**Body:**

```json
{ "name": "Tablet", "price": 300 }
```

**Response:**

```json
{ "id": 3, "name": "Tablet", "price": 300 }
```

#### **3. Đăng nhập (Authentication Example)**

```http
POST /auth/login
Content-Type: application/json
```

**Body:**

```json
{ "email": "user@example.com", "password": "securepass" }
```

**Response:**

```json
{ "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

#### **4. Lấy thông tin user đang đăng nhập**

```http
GET /auth/me
Authorization: Bearer <token>
```

**Response:**

```json
{ "id": 1, "name": "John Doe", "email": "user@example.com" }
```

#### **5. Đăng xuất**

```http
POST /auth/logout
Authorization: Bearer <token>
```

**Response:**

```json
{ "message": "Logged out successfully" }
```

## 3. HTTP Status Codes trong RESTful API

### ✅ Nhóm 2xx: Thành công

| Status Code      | Ý nghĩa                                  | Ví dụ                                       |
| ---------------- | ---------------------------------------- | ------------------------------------------- |
| `200 OK`         | Thành công                               | `GET /products` → Trả về danh sách sản phẩm |
| `201 Created`    | Tạo thành công                           | `POST /products` → Tạo sản phẩm mới         |
| `204 No Content` | Thành công nhưng không có dữ liệu trả về | `DELETE /products/3`                        |

### ⚠️ Nhóm 4xx: Lỗi từ Client

| Status Code              | Ý nghĩa                                  | Ví dụ                                  |
| ------------------------ | ---------------------------------------- | -------------------------------------- |
| `400 Bad Request`        | Request sai hoặc thiếu dữ liệu           | Không gửi đúng JSON khi `POST /users`  |
| `401 Unauthorized`       | Không có quyền truy cập (chưa đăng nhập) | Không có token khi `GET /orders`       |
| `403 Forbidden`          | Bị cấm truy cập                          | User thường cố truy cập API admin      |
| `404 Not Found`          | Không tìm thấy tài nguyên                | `GET /users/9999` (user không tồn tại) |
| `405 Method Not Allowed` | Phương thức HTTP không hợp lệ            | `PUT /users` (PUT yêu cầu có ID)       |

### 🚨 Nhóm 5xx: Lỗi từ Server

| Status Code                 | Ý nghĩa                           | Ví dụ                                   |
| --------------------------- | --------------------------------- | --------------------------------------- |
| `500 Internal Server Error` | Lỗi server                        | Exception chưa xử lý trong code         |
| `502 Bad Gateway`           | Gateway lỗi                       | API kết nối đến một dịch vụ khác bị lỗi |
| `503 Service Unavailable`   | Dịch vụ đang quá tải hoặc bảo trì | Server đang bảo trì                     |

---
