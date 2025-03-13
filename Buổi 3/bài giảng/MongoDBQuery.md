# Những câu lệnh truy vấn trong MongoDB (Mongoose)

## 1. Kết nối đến MongoDB

```js
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
```

## 2. Định nghĩa Schema và Model (Su dung mongodb driver la se khong co cai nay)

```js
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
});

const orderSchema = new mongoose.Schema({
  product: String,
  price: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);
```

## 3. Các câu lệnh truy vấn

### 3.1. Thêm một tài liệu (document)

```js
const newUser = new User({
  name: "John Doe",
  age: 30,
  email: "john@example.com",
});
await newUser.save();
// hoặc
await User.create({ name: "John Doe", age: 30, email: "john@example.com" });
```

### 3.2. Tìm kiếm tài liệu

- **Tìm tất cả**

```js
const users = await User.find();
```

- **Tìm với điều kiện**

```js
const user = await User.findOne({ name: "John Doe" });
```

```js
const usersOver25 = await User.find({ age: { $gt: 25 } });
```

- **Tìm theo ID**

```js
const user = await User.findById("60c72b2f9b1e8b3a2c8d9aeb");
```

### 3.3. Sắp xếp (Sort) và phân trang (Pagination)

- **Sắp xếp theo tuổi tăng dần**

```js
const users = await User.find().sort({ age: 1 });
```

- **Sắp xếp theo tuổi giảm dần**

```js
const users = await User.find().sort({ age: -1 });
```

- **Phân trang với giới hạn và bỏ qua**

```js
const page = 2;
const limit = 5;
const users = await User.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### 3.4. Cập nhật tài liệu

- **Cập nhật một tài liệu**

```js
await User.updateOne({ name: "John Doe" }, { age: 35 });
```

- **Cập nhật nhiều tài liệu**

```js
await User.updateMany({ age: { $lt: 25 } }, { age: 25 });
```

- **Tìm và cập nhật**

```js
const updatedUser = await User.findOneAndUpdate(
  { name: "John Doe" },
  { age: 36 },
  { new: true } // Trả về document đã cập nhật
);
```

### 3.5. Xóa tài liệu

- **Xóa một tài liệu**

```js
await User.deleteOne({ name: "John Doe" });
```

- **Xóa nhiều tài liệu**

```js
await User.deleteMany({ age: { $lt: 18 } });
```

- **Tìm và xóa**

```js
const deletedUser = await User.findOneAndDelete({ name: "John Doe" });
```

### 3.6. Join bảng khác (Populate)

```js
const orders = await Order.find().populate("userId");
```

```js
const userWithOrders = await User.find().populate("orders");
```

### 3.7. Các toán tử nâng cao

- **$gt (Greater Than - Lớn hơn)**

```js
const users = await User.find({ age: { $gt: 25 } });
```

- **$lt (Less Than - Nhỏ hơn)**

```js
const users = await User.find({ age: { $lt: 30 } });
```

- **$in (Nằm trong danh sách giá trị)**

```js
const users = await User.find({ age: { $in: [20, 25, 30] } });
```

- **$nin (Không nằm trong danh sách giá trị)**

```js
const users = await User.find({ age: { $nin: [20, 25, 30] } });
```

- **$eq (Equal - Bằng với giá trị cụ thể)**

```js
const users = await User.find({ age: { $eq: 25 } });
```

- **$ne (Not Equal - Khác với giá trị cụ thể)**

```js
const users = await User.find({ age: { $ne: 25 } });
```

- **$and (Kết hợp nhiều điều kiện - AND)**

```js
const users = await User.find({
  $and: [{ age: { $gt: 18 } }, { age: { $lt: 30 } }],
});
```

- **$or (Kết hợp nhiều điều kiện - OR)**

```js
const users = await User.find({
  $or: [{ age: { $gt: 30 } }, { name: "Alice" }],
});
```

- **$cond (Điều kiện trong Aggregation)**

```js
const users = await User.aggregate([
  {
    $project: {
      name: 1,
      age: 1,
      category: {
        $cond: { if: { $gt: ["$age", 30] }, then: "Senior", else: "Junior" },
      },
    },
  },
]);
```

- **$filter (Lọc dữ liệu trong mảng)**

```js
const usersWithFilteredOrders = await User.aggregate([
  {
    $project: {
      name: 1,
      orders: {
        $filter: {
          input: "$orders",
          as: "order",
          cond: { $gt: ["$$order.price", 50] },
        },
      },
    },
  },
]);
```

- **$map (Ánh xạ dữ liệu trong mảng)**

```js
const usersWithModifiedOrders = await User.aggregate([
  {
    $project: {
      name: 1,
      orderDescriptions: {
        $map: {
          input: "$orders",
          as: "order",
          in: {
            desc: {
              $concat: [
                "Product: ",
                "$$order.product",
                " - Price: ",
                { $toString: "$$order.price" },
              ],
            },
          },
        },
      },
    },
  },
]);
```
