# Cache

Cache là kỹ thuật lưu trữ dữ liệu tạm thời nhầm giảm thiểu thời gian truy cập dữ liệu từ một nguồn cấp dữ liệu tốn nhiều chi phí (time) truy cập. Khi dữ liệu được lưu trữ, các lần truy cập sau sẽ sử dụng data cache mà không cần phải đi đến nguồn cấp dữ liệu.

Ví dụ:

```javascript
// Tạo một cache đơn giản sử dụng Object
const cache = {};

// Hàm để thêm dữ liệu vào cache
function addToCache(key, value) {
  cache[key] = value;
}

// Hàm để lấy dữ liệu từ cache
function getFromCache(key) {
  return cache[key];
}

// Mô phỏng việc lấy dữ liệu từ cơ sở dữ liệu
function fetchDataFromDatabase(id) {
  // Giả định dữ liệu được trả về từ cơ sở dữ liệu
  const data = `Data for ID ${id}`;
  addToCache(id, data); // Lưu dữ liệu vào cache
  return data;
}

const idToFetch = "123";

// Kiểm tra xem dữ liệu có trong cache không
const dataFromCache = getFromCache(idToFetch);
if (dataFromCache) {
  console.log("Data from cache:", dataFromCache);
} else {
  // Nếu không có trong cache, lấy dữ liệu từ cơ sở dữ liệu và lưu vào cache
  const dataFromDatabase = fetchDataFromDatabase(idToFetch);
  console.log("Data from database:", dataFromDatabase);
}

// Lần thứ hai, dữ liệu sẽ được lấy từ cache
const cachedData = getFromCache(idToFetch);
console.log("Cached data:", cachedData);
```

# Redis

Kho lưu trữ dữ liệu sử dụng bộ nhớ truy xuất nhanh, thường được sử dụng làm cơ sở dữ liệu, bộ nhớ đệm, treaming engine và message broker.

- Những ưu điểm của redis:

  - Bộ nhớ truy cập nhanh: Redis lưu trữ dữ liệu trong bộ nhớ RAM, cho phép truy cập dữ liệu với tốc độ rất nhanh. Điều này làm cho Redis rất phù hợp cho việc lưu trữ cache và dữ liệu tạm thời.

  - Cấu trúc dữ liệu đa dạng: Redis hỗ trợ nhiều cấu trúc dữ liệu như strings, sets, hashes, lists, sorted sets, stream,.... Điều này cho phép bạn lưu trữ dữ liệu theo cách phù hợp với mục tiêu sử dụng.

  - Atomic Operations: Redis hỗ trợ các công cụ giúp đảm bảo tính nhất quán của dữ liệu khi nhiều hoạt động thay đổi dữ liệu cùng một lúc.

  - Khả năng mở rộng: Redis có khả năng mở rộng theo chiều ngang (horizontal scaling) bằng cách kết hợp nhiều máy chủ Redis thành một cụm.

  - Replication: Redis cho phép sao chép dữ liệu từ một máy chủ gốc đến nhiều máy chủ con (replicas), giúp tăng cường độ tin cậy và khả năng phục hồi sau sự cố.

  - Pub/Sub Messaging: Redis hỗ trợ mô hình giao tiếp publish / subscribe (pub/sub), cho phép các ứng dụng gửi và nhận thông điệp qua các service.

  - Lua Scripting: Redis cho phép thực thi các script Lua trong server, giúp tối ưu hóa một số hoạt động phức tạp.

## Cài đặt phần mềm

Thêm config sau vào phần `services` của `docker-compose.yml` và chạy lại để cài đặt redis

```yml
redis:
  image: "bitnami/redis:latest"
  environment:
    - ALLOW_EMPTY_PASSWORD=yes
  ports:
    - 6379:6379
```

Trong đó:

- `redis`: Tên service

- `image`: Tên của image sẽ cài đặt

- `enviroment`: Cài đặt các biến môi trường khi start redis. `ALLOW_EMPTY_PASSWORD`: cho phép kết nối không cần mật khẩu

- `ports`: export port từ container ra máy tính (port đầu tiên là port từ máy tính, port thứ hai là của container) để các phần mềm khác kết nối vào

Cài đặt phần mêm `RedisInsight` để visualize dữ liệu: https://github.com/RedisInsight/RedisInsight

## Cài đặt redis cho Nodejs

## Thư viện `redis`

### 1. Cài đặt thư viện để thao tác với redis:

```shell
yarn add redis
```

### 2. Hướng dẫn sử dụng

```javascript
import { createClient } from "redis";

const client = createClient(); // Tạo kết nối đến redis

client.on("error", (err) => console.log("Redis Client Error", err));

await client.connect(); // Chờ kết nối hoàn thành

await client.set("key", "value"); // Lưu trữ dữ liệu dạng string vào redis
const value = await client.get("key"); // Lấy dữ liệu từ redis
await client.disconnect(); // Ngắt kết nối khi không sử dụng
```

## Thư viện `ioredis`

### 1. Cài đặt thư viện để thao tác với ioredis:

```shell
yarn add ioredis
```

### 2. Hướng dẫn sử dụng

```javascript
const Redis = require("ioredis");

const redis = new Redis(); // Tạo ra một kết nối đến 127.0.0.1:6379

redis.set("mykey", "value"); // Đưa dữ liệu vào Redis, trả về Promise<boolean>

// Hỗ trợ dạng callback function
redis.get("mykey", (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Prints "value"
  }
});

// Hỗ trợ dạng Promise
redis.get("mykey").then((result) => {
  console.log(result); // Prints "value"
});

// Thêm dữ liệu dạng set
redis.zadd("sortedSet", 1, "one", 2, "dos", 4, "quatro", 3, "three");

redis.zrange("sortedSet", 0, 2, "WITHSCORES").then((elements) => {
  // ["one", "1", "dos", "2", "three", "3"] as if the command was `redis> ZRANGE sortedSet 0 2 WITHSCORES`
  console.log(elements);
});

// Run một redis command
redis.set("mykey", "hello", "EX", 10); // CLI: redis> SET mykey hello EX 10
```
