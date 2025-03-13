# Bài giảng: MongoDB và ExpressJS

## 1. Giới thiệu MongoDB & NoSQL

MongoDB là một hệ quản trị cơ sở dữ liệu NoSQL dạng document, lưu trữ dữ liệu theo JSON/BSON thay vì dạng bảng như SQL.

### **Lợi ích của MongoDB**

- **Mô hình linh hoạt**: Không cần schema cứng có thể lưu trữ dữ liệu.
- **Hiệu suất cao**: Hỗ trợ indexing, replication, sharding.
- **Dễ dàng mở rộng**: Có thể chạy trên nhiều server.

---

## 2. Cài đặt MongoDB và Compass

### **Cài đặt MongoDB**

- Tải và cài đặt MongoDB từ trang chủ: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- Chạy lệnh để bật MongoDB service:
  ```sh
  mongod --dbpath <path_to_data_folder>
  ```

### **Cài đặt MongoDB Compass**

MongoDB Compass là GUI hỗ trợ quản lý cơ sở dữ liệu MongoDB.

- Tải và cài Compass từ trang chủ: [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

---

## 3. Kết nối MongoDB với Mongoose

- Cài package Mongoose:
  ```sh
  npm install mongoose
  ```
- Kết nối với MongoDB trong ExpressJS:

  ```js
  const mongoose = require("mongoose");

  mongoose
    .connect("mongodb://localhost:27017/mydatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
  ```

---

## 4. Docker MongoDB server

### **Cài đặt và chạy MongoDB bằng Docker**

```sh
docker pull mongo
```

```sh
docker run -d --name mongodb -p 27017:27017 -v mongo_data:/data/db mongo
```

### **Cài đặt và chạy MongoDB bằng Docker Compose**

Tạo file `docker-compose.yml`:

```yaml
version: "3.8"
services:
  mongo:
    image: mongo
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:
```

Chạy MongoDB bằng lệnh:

```sh
docker-compose up -d
```

---

## 5. Mongoose Schema và Model

### **Tạo Schema và Model cho User**

```js
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  gender: String,
});
const User = mongoose.model("User", UserSchema);
```

### **Tạo Schema và Model cho Bài Viết**

```js
const PostSchema = new mongoose.Schema({
  content: String,
  image: String,
  video: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Post = mongoose.model("Post", PostSchema);
```

### **Tạo Schema và Model cho Bình Luận**

```js
const CommentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model("Comment", CommentSchema);
```

---

## 6. Thực hiện CRUD với MongoDB & Mongoose

### **Tạo bài viết mới**

```js
const newPost = new Post({ content: "Hello world", author: userId });
await newPost.save();
```

### **Lấy danh sách bài viết**

```js
const posts = await Post.find().populate("author");
console.log(posts);
```

### **Cập nhật bài viết**

```js
await Post.updateOne({ _id: postId }, { content: "Updated content" });
```

### **Xoá bài viết**

```js
await Post.deleteOne({ _id: postId });
```

### **Like bài viết**

```js
await Post.updateOne({ _id: postId }, { $addToSet: { likes: userId } });
```

### **Unlike bài viết**

```js
await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
```

### **Thêm bình luận vào bài viết**

```js
const newComment = new Comment({
  post: postId,
  user: userId,
  content: "Nice post!",
});
await newComment.save();
```

### **Lấy danh sách bình luận của bài viết**

```js
const comments = await Comment.find({ post: postId }).populate("user");
console.log(comments);
```

### **Like bình luận**

```js
await Comment.updateOne({ _id: commentId }, { $addToSet: { likes: userId } });
```

### **Unlike bình luận**

```js
await Comment.updateOne({ _id: commentId }, { $pull: { likes: userId } });
```

### **Trả lời bình luận**

```js
const replyComment = new Comment({
  post: postId,
  user: userId,
  content: "Replying...",
  replies: [commentId],
});
await replyComment.save();
await Comment.updateOne(
  { _id: commentId },
  { $push: { replies: replyComment._id } }
);
```

### **Lấy danh sách trả lời bình luận**

```js
const commentWithReplies = await Comment.findById(commentId).populate(
  "replies"
);
console.log(commentWithReplies);
```

---
