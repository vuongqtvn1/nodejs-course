# Prisma trong TypeScript

## 1. Giới thiệu về Prisma
Prisma là một ORM (Object-Relational Mapping) mạnh mẽ dành cho Node.js và TypeScript, giúp thao tác với cơ sở dữ liệu dễ dàng hơn. Nó cung cấp Prisma Client để truy vấn dữ liệu một cách tối ưu, hỗ trợ nhiều loại database như PostgreSQL, MySQL, SQLite, MongoDB, SQL Server.

---

## 2. Prisma Client
### 2.1. Setup & Configuration
#### Cài đặt Prisma và các dependency cần thiết:
```bash
npm install @prisma/client
```
Nếu chưa có Prisma, bạn cần cài đặt thêm:
```bash
npm install prisma --save-dev
```

#### Khởi tạo Prisma trong dự án:
```bash
npx prisma init
```
Lệnh này sẽ tạo file `.env` chứa thông tin database connection và thư mục `prisma` chứa `schema.prisma`.

#### Cấu hình file `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  name      String
  email     String  @unique
  age       Int
  createdAt DateTime @default(now())
}
```

#### Chạy migration để tạo bảng trong database:
```bash
npx prisma migrate dev --name init
```

#### Khởi tạo Prisma Client:
```bash
npx prisma generate
```
---

### 2.2. Queries (Truy vấn với Prisma Client)

#### 2.2.1. Kết nối với database
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
```

#### 2.2.2. Thêm dữ liệu (Create)
```typescript
const newUser = await prisma.user.create({
  data: {
    name: "Nguyen Van A",
    email: "nguyenvana@example.com",
    age: 25,
  },
});
console.log(newUser);
```

#### 2.2.3. Lấy danh sách người dùng (Read)
```typescript
const users = await prisma.user.findMany();
console.log(users);
```

#### 2.2.4. Cập nhật dữ liệu (Update)
```typescript
const updatedUser = await prisma.user.update({
  where: { email: "nguyenvana@example.com" },
  data: { age: 26 },
});
console.log(updatedUser);
```

#### 2.2.5. Xóa dữ liệu (Delete)
```typescript
await prisma.user.delete({
  where: { email: "nguyenvana@example.com" },
});
```

---

### 2.3. Demo các truy vấn nâng cao

#### 2.3.1. Truy vấn phân trang (Pagination)
```typescript
const users = await prisma.user.findMany({
  skip: 10,
  take: 5,
});
console.log(users);
```

#### 2.3.2. Sắp xếp dữ liệu (Sorting)
```typescript
const users = await prisma.user.findMany({
  orderBy: { age: "desc" },
});
console.log(users);
```

#### 2.3.3. Tìm kiếm toàn văn (Full-Text Search) - MySQL
```typescript
const users = await prisma.user.findMany({
  where: {
    name: {
      contains: "Nguyen",
    },
  },
});
console.log(users);
```

#### 2.3.4. Tìm kiếm gần đúng (Approximate Search)
```typescript
const users = await prisma.user.findMany({
  where: {
    name: {
      startsWith: "Nguyen",
    },
  },
});
console.log(users);
```

#### 2.3.5. Tìm kiếm giá trị lớn hơn, bé hơn
```typescript
const users = await prisma.user.findMany({
  where: {
    age: {
      gt: 20, // Lớn hơn 20
      lt: 30, // Nhỏ hơn 30
    },
  },
});
console.log(users);
```

#### 2.3.6. Truy vấn với điều kiện AND, OR
```typescript
const users = await prisma.user.findMany({
  where: {
    AND: [
      { age: { gt: 20 } },
      { name: { contains: "Nguyen" } },
    ],
  },
});
console.log(users);

const usersOr = await prisma.user.findMany({
  where: {
    OR: [
      { age: { lt: 18 } },
      { name: { startsWith: "Tran" } },
    ],
  },
});
console.log(usersOr);
```

#### 2.3.7. Truy vấn với IN và NOT IN
```typescript
const usersIn = await prisma.user.findMany({
  where: {
    id: {
      in: [1, 2, 3],
    },
  },
});
console.log(usersIn);

const usersNotIn = await prisma.user.findMany({
  where: {
    id: {
      notIn: [1, 2, 3],
    },
  },
});
console.log(usersNotIn);
```

#### 2.3.8. Truy vấn với Equal (eq) và Not Equal (ne)
```typescript
const userEq = await prisma.user.findMany({
  where: {
    age: {
      equals: 25,
    },
  },
});
console.log(userEq);

const userNe = await prisma.user.findMany({
  where: {
    age: {
      not: 25,
    },
  },
});
console.log(userNe);
```

#### 2.3.9. Cập nhật dữ liệu liên kết (Update Relations)
```typescript
const updatedPost = await prisma.post.update({
  where: { id: 1 },
  data: {
    author: {
      connect: { id: 2 }, // Kết nối bài viết với user có id = 2
    },
  },
});
console.log(updatedPost);
```
```typescript
const updatedPostDisconnect = await prisma.post.update({
  where: { id: 1 },
  data: {
    author: {
      disconnect: true, // Hủy liên kết bài viết với user hiện tại
    },
  },
});
console.log(updatedPostDisconnect);
```

#### 2.3.1. Truy vấn phân trang (Pagination)
```typescript
const users = await prisma.user.findMany({
  skip: 10,
  take: 5,
});
console.log(users);
```

#### 2.3.2. Sắp xếp dữ liệu (Sorting)
```typescript
const users = await prisma.user.findMany({
  orderBy: { age: "desc" },
});
console.log(users);
```

#### 2.3.3. Tìm kiếm toàn văn (Full-Text Search) - MySQL
```typescript
const users = await prisma.user.findMany({
  where: {
    name: {
      contains: "Nguyen",
      mode: "insensitive",
    },
  },
});
console.log(users);
```

#### 2.3.4. Tìm kiếm gần đúng (Approximate Search)
```typescript
const users = await prisma.user.findMany({
  where: {
    name: {
      startsWith: "Nguyen",
    },
  },
});
console.log(users);
```

#### 2.3.5. Tìm kiếm giá trị lớn hơn, bé hơn
```typescript
const users = await prisma.user.findMany({
  where: {
    age: {
      gt: 20, // Lớn hơn 20
      lt: 30, // Nhỏ hơn 30
    },
  },
});
console.log(users);
```

#### 2.3.6. Truy vấn với điều kiện AND, OR
```typescript
const users = await prisma.user.findMany({
  where: {
    AND: [
      { age: { gt: 20 } },
      { name: { contains: "Nguyen" } },
    ],
  },
});
console.log(users);

const usersOr = await prisma.user.findMany({
  where: {
    OR: [
      { age: { lt: 18 } },
      { name: { startsWith: "Tran" } },
    ],
  },
});
console.log(usersOr);
```

---

