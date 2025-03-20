# Bài Giảng: Các Câu Lệnh Truy Vấn Nâng Cao Trong Mongoose

## 1. Mô hình dữ liệu (Models)

### 1.1. User Model
```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);
```

### 1.2. Post Model
```js
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tags: [String]
});

// Tạo chỉ mục Full-Text Search
PostSchema.index({ title: "text", content: "text" });

const Post = mongoose.model("Post", PostSchema);
```

### 1.3. Order Model
```js
const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{ name: String, quantity: Number, price: Number }],
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model("Order", OrderSchema);
```

---

## 2. Truy vấn nâng cao với `find()`

### + Tìm kiếm văn bản toàn phần (Full-Text Search)
#### Cần tạo chỉ mục trước:
```js
await Post.createIndexes({ title: "text", content: "text" });
```
#### Truy vấn:
```js
const posts = await Post.find({ $text: { $search: "mongodb" } });
```
#### Kết quả:
```json
[
  { "title": "Hướng dẫn MongoDB", "content": "Học MongoDB cơ bản và nâng cao." }
]
```

### + Tìm kiếm gần đúng bằng `$regex`
#### Truy vấn:
```js
const users = await User.find({ name: { $regex: "^A", $options: "i" } });
```
#### Kết quả:
```json
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Alex", "email": "alex@example.com" }
]
```

---


### + `select()` - Chọn trường dữ liệu
Dữ liệu mẫu:
```js
await User.create([
  { name: "Alice", email: "alice@example.com", age: 25, role: "admin" },
  { name: "Bob", email: "bob@example.com", age: 30, role: "user" }
]);
```
Truy vấn:
```js
const users = await User.find().select("name email");
```
Kết quả:
```json
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob", "email": "bob@example.com" }
]
```

### + `exists()` - Kiểm tra sự tồn tại
Truy vấn:
```js
const usersWithEmail = await User.find({ email: { $exists: true } });
```
Kết quả:
```json
[
  { "name": "Alice", "email": "alice@example.com" },
  { "name": "Bob", "email": "bob@example.com" }
]
```

### + `countDocuments()` - Đếm số lượng
Truy vấn:
```js
const userCount = await User.countDocuments({ age: { $gte: 18 } });
```
Kết quả:
```json
{
  "count": 2
}
```

### + `distinct()` - Lấy danh sách giá trị duy nhất
Truy vấn:
```js
const roles = await User.distinct("role");
```
Kết quả:
```json
["admin", "user"]
```


### + `populate()` - Kết hợp dữ liệu từ collection khác
Dữ liệu mẫu:
```js
const alice = await User.findOne({ name: "Alice" });
await Post.create({ title: "Post 1", content: "Hello World", author: alice._id });
```
Truy vấn:
```js
const posts = await Post.find().populate("author", "name email");
```
Kết quả:
```json
[
  { "title": "Post 1", "content": "Hello World", "author": { "name": "Alice", "email": "alice@example.com" } }
]
```

### + `sort()` - Sắp xếp kết quả
Truy vấn:
```js
const users = await User.find().sort({ age: -1 });
```
Kết quả:
```json
[
  { "name": "Bob", "age": 30 },
  { "name": "Alice", "age": 25 }
]
```

### + `limit()` và `skip()` - Phân trang dữ liệu
Truy vấn:
```js
const users = await User.find().limit(1).skip(1);
```
Kết quả:
```json
[
  { "name": "Bob", "email": "bob@example.com" }
]
```

### + `where()` - Điều kiện nâng cao
Truy vấn:
```js
const users = await User.where("age").gt(18).lt(30);
```
Kết quả:
```json
[
  { "name": "Alice", "age": 25 }
]
```

---

## 3. Truy vấn nâng cao với `aggregate()`

### + `$match` - Lọc dữ liệu
Truy vấn:
```js
const users = await User.aggregate([
  { $match: { age: { $gte: 30 } } }
]);
```
Kết quả:
```json
[
  { "name": "Bob", "age": 30 }
]
```

### + `$group` - Gom nhóm dữ liệu
Truy vấn:
```js
const ageStats = await User.aggregate([
  { $group: { _id: "$age", total: { $sum: 1 } } }
]);
```
Kết quả:
```json
[
  { "_id": 25, "total": 1 },
  { "_id": 30, "total": 1 }
]
```

### + `$lookup` - Kết hợp dữ liệu từ collection khác
Truy vấn:
```js
const posts = await Post.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "author",
      foreignField: "_id",
      as: "authorInfo"
    }
  }
]);
```
Kết quả:
```json
[
  { "title": "Post 1", "content": "Hello World", "authorInfo": [{ "name": "Alice" }] }
]
```

### + `$unwind` - Phân rã mảng
Dữ liệu mẫu:
```js
await Order.create({ user: alice._id, items: [{ name: "Laptop", quantity: 1, price: 1000 }, { name: "Mouse", quantity: 2, price: 50 }] });
```
Truy vấn:
```js
const orders = await Order.aggregate([
  { $unwind: "$items" }
]);
```
Kết quả:
```json
[
  { "user": "Alice", "items": { "name": "Laptop", "quantity": 1, "price": 1000 } },
  { "user": "Alice", "items": { "name": "Mouse", "quantity": 2, "price": 50 } }
]
```

### + `$out` - Xuất kết quả sang collection mới
Truy vấn:
```js
await User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $out: "adults" }
]);
```
Kết quả: Dữ liệu được lưu vào collection `adults` trong database.

### + `$replaceRoot` - Thay thế gốc tài liệu
Truy vấn:
```js
const orders = await Order.aggregate([
  { $unwind: "$items" },
  { $replaceRoot: { newRoot: "$items" } }
]);
```
Kết quả:
```json
[
  { "name": "Laptop", "quantity": 1, "price": 1000 },
  { "name": "Mouse", "quantity": 2, "price": 50 }
]
```

### + `$sample` - Lấy ngẫu nhiên tài liệu
Truy vấn:
```js
const randomUsers = await User.aggregate([
  { $sample: { size: 1 } }
]);
```
Kết quả (ví dụ ngẫu nhiên):
```json
[
  { "name": "Alice", "email": "alice@example.com" }
]
```

### + `$set` - Thêm hoặc cập nhật trường dữ liệu
Truy vấn:
```js
const users = await User.aggregate([
  { $set: { status: "Active" } }
]);
```
Kết quả:
```json
[
  { "name": "Alice", "status": "Active" },
  { "name": "Bob", "status": "Active" }
]
```

### + `$merge` - Gộp kết quả vào collection khác
Truy vấn:
```js
await User.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $merge: "adults" }
]);
```
Kết quả: Dữ liệu được gộp vào collection `adults`.

---

## 4. `aggregate()` vs. `find()`
- `find()` chủ yếu dùng để truy vấn dữ liệu đơn giản, có thể kết hợp với `populate()` để lấy dữ liệu liên quan.
- `aggregate()` mạnh mẽ hơn, hỗ trợ các phép biến đổi dữ liệu như `$lookup`, `$group`, `$unwind`, `$addFields`.
- **Lưu ý:** Các toán tử như `$group`, `$unwind`, `$lookup` chỉ có trong `aggregate()`, không dùng được với `find()`.

---

