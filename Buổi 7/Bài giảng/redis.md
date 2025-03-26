# Bài giảng: Redis trong Node.js với TypeScript và Express

## 1. Redis là gì?
Redis (Remote Dictionary Server) là một hệ thống lưu trữ dữ liệu dạng key-value in-memory, hoạt động với hiệu suất cao và độ trễ thấp. Redis có thể được sử dụng như một cơ sở dữ liệu, bộ nhớ cache hoặc một message broker.

### Đặc điểm chính của Redis:
- **Tốc độ cao**: Redis hoạt động trên RAM nên tốc độ truy xuất nhanh hơn nhiều so với cơ sở dữ liệu truyền thống.
- **Hỗ trợ nhiều cấu trúc dữ liệu**: String, List, Set, Hash, Sorted Set, Stream, Pub/Sub.
- **Hỗ trợ persistence**: Có thể lưu trữ dữ liệu xuống ổ cứng để tránh mất dữ liệu khi hệ thống bị tắt.
- **Hỗ trợ clustering**: Redis có thể hoạt động ở chế độ cluster để tăng khả năng mở rộng.

## 2. Trường hợp sử dụng Redis trong thực tế
Redis thường được sử dụng trong các tình huống sau:
1. **Caching**: Giảm tải cho cơ sở dữ liệu chính bằng cách lưu trữ tạm thời dữ liệu được truy vấn thường xuyên.
2. **Session Storage**: Lưu trữ phiên làm việc của người dùng khi sử dụng ứng dụng web.
3. **Queue & Message Broker**: Dùng làm hàng đợi tin nhắn cho các hệ thống Microservices.
4. **Rate Limiting**: Giới hạn số lượng request từ người dùng trong khoảng thời gian nhất định.
5. **Leaderboard & Counting**: Lưu trữ danh sách xếp hạng hoặc đếm số lượng truy cập.

## 3. Cách triển khai Redis trên Server và Client

### Cài đặt Redis Server
Để cài đặt Redis trên hệ thống:

**Linux/macOS:**
```sh
sudo apt update && sudo apt install redis-server  # Ubuntu
brew install redis  # macOS
```

**Windows:**
Tải và cài đặt từ: https://github.com/microsoft/WSL-Redis

Kiểm tra Redis đang chạy:
```sh
redis-server --version
```


**Docker:**

Tạo file docker-compose.yml để chạy Redis server:

```sh
version: '3.8'
services:
  redis:
    image: redis:latest
    container_name: redis_server
    ports:
      - "6379:6379"
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data
volumes:
  redis_data:
```

Khởi chạy Redis server bằng Docker:

```sh
docker-compose up
```


### Cài đặt Redis Client trong Node.js với TypeScript
Chúng ta sử dụng thư viện `ioredis` để kết nối Redis với Node.js:
```sh
npm install ioredis jsonwebtoken express socket.io cors
```

Ví dụ kết nối Redis trong Node.js với TypeScript:
```typescript
import Redis from 'ioredis';

const redis = new Redis();

// Kiểm tra kết nối
redis.ping().then(res => console.log("Redis connected: ", res));
```

## 4. Các trường hợp sử dụng Redis đầy đủ

### 4.1. Caching Authentication & Thu hồi JWT Token
#### **Luồng xử lý:**
1. Khi người dùng đăng nhập, hệ thống sẽ tạo JWT token và lưu vào Redis với thời gian hết hạn.
2. Khi xác thực, hệ thống kiểm tra token từ Redis trước khi xác thực với database.
3. Khi người dùng đăng xuất hoặc bị thu hồi quyền, hệ thống xóa token khỏi Redis.

#### **Code Implementation**
```typescript
import jwt from 'jsonwebtoken';
import express from 'express';
import Redis from 'ioredis';

const app = express();
const redis = new Redis();
const SECRET_KEY = "your_secret_key";

// Đăng nhập và lưu token vào Redis
app.post("/login", async (req, res) => {
    const userId = "123";
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    await redis.set(`jwt:${userId}`, token, "EX", 3600);
    res.json({ token });
});

// Xác thực request
app.get("/protected", async (req, res) => {
    const token = req.headers.authorization;
    const userId = "123";
    const cachedToken = await redis.get(`jwt:${userId}`);
    
    if (!cachedToken || cachedToken !== token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({ message: "Authenticated" });
});

// Đăng xuất và thu hồi token
app.post("/logout", async (req, res) => {
    const userId = "123";
    await redis.del(`jwt:${userId}`);
    res.json({ message: "Logged out" });
});
```

### 4.2. Caching dữ liệu sản phẩm hoặc bài viết
#### **Luồng xử lý:**
1. Kiểm tra xem dữ liệu có trong Redis hay không.
2. Nếu có, trả về dữ liệu từ Redis.
3. Nếu không, truy vấn database và lưu kết quả vào Redis.

#### **Code Implementation**
```typescript
app.get("/product/:id", async (req, res) => {
    const productId = req.params.id;
    const cachedProduct = await redis.get(`product:${productId}`);
    
    if (cachedProduct) {
        return res.json(JSON.parse(cachedProduct));
    }
    
    const product = { id: productId, name: "Laptop", price: 1200 }; // Giả lập database
    await redis.set(`product:${productId}`, JSON.stringify(product), "EX", 300);
    res.json(product);
});
```

### 4.3. Pub/Sub thông báo khi thêm mới sản phẩm với WebSocket
#### **Luồng xử lý:**
1. Khi một sản phẩm mới được thêm vào database, hệ thống publish sự kiện Redis.
2. Các subscriber nhận sự kiện và gửi thông báo đến WebSocket client.

#### **Publisher (Thêm sản phẩm mới)**
```typescript
const pub = new Redis();
app.post("/add-product", async (req, res) => {
    const newProduct = { id: 3, name: "Tablet" };
    await pub.publish("new_product", JSON.stringify(newProduct));
    res.json({ message: "Product added" });
});
```

#### **Subscriber (Gửi thông báo qua WebSocket)**
```typescript
import { Server } from "socket.io";
const io = new Server(3001, { cors: { origin: "*" } });
const sub = new Redis();

sub.subscribe("new_product");
sub.on("message", (channel, message) => {
    if (channel === "new_product") {
        io.emit("product_update", JSON.parse(message));
    }
});

io.on("connection", (socket) => {
    console.log("New client connected");
});
```

