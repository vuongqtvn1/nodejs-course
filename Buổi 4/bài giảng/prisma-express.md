# Prisma với MySQL Express TypeScript

## 1. Cài Đặt MySQL
### 1.1. Tải MySQL từ trang chủ
- Truy cập [https://dev.mysql.com/downloads/](https://dev.mysql.com/downloads/)
- Tải về phiên bản phù hợp với hệ điều hành của bạn
- Cài đặt theo hướng dẫn

### 1.2. Cài đặt MySQL bằng XAMPP
- Truy cập [https://www.apachefriends.org/index.html](https://www.apachefriends.org/index.html)
- Tải về và cài đặt XAMPP
- Khởi động MySQL từ XAMPP Control Panel

### 1.3. Cài đặt MySQL bằng Docker
#### Sử dụng `docker pull`
```sh
 docker pull mysql:latest
```
#### Sử dụng `docker-compose`
```yaml
version: '3.1'
services:
  mysql:
    image: mysql:latest
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
    ports:
      - "3306:3306"
```
Chạy lệnh:
```sh
docker-compose up -d
```

---

## 2. Cài Đặt Prisma trong Express TypeScript
### 2.1. Khởi tạo dự án
```sh
mkdir prisma-mysql-demo && cd prisma-mysql-demo
npm init -y
```
### 2.2. Cài đặt các dependencies
```sh
npm install express @prisma/client typescript ts-node dotenv
npm install --save-dev prisma @types/express
```
### 2.3. Khởi tạo Prisma
```sh
npx prisma init
```
Cấu hình `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/mydb"
```

---

## 3. Tạo Bảng với Prisma, Migrate, và Seeding
### 3.1. Cấu hình schema.prisma
```prisma
model User {
  id        Int     @id @default(autoincrement())
  name      String
  email     String  @unique
  gender    String
  avatar    String?
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```
### 3.2. Chạy migrate
```sh
npx prisma migrate dev --name init
```
### 3.3. Seeding dữ liệu
Tạo `prisma/seed.ts`:
```ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: { name: 'John Doe', email: 'john@example.com', gender: 'male', avatar: '' }
  });

  await prisma.post.create({
    data: { title: 'Hello World', content: 'This is a test post', authorId: user.id }
  });
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
```

Thêm vào package.json:

```sh
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Chạy seed:
```sh
npx prisma db seed
```
---

## 4. Các Câu Lệnh Truy Vấn Trong Prisma
### 4.1. Thêm dữ liệu
```ts
await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com', gender: 'female', avatar: '' } });
await prisma.post.create({ data: { title: 'New Post', content: 'Some content', authorId: 1 } });
```
### 4.2. Chỉnh sửa dữ liệu
```ts
await prisma.user.update({ where: { id: 1 }, data: { name: 'Alice Updated' } });
```
### 4.3. Xóa dữ liệu
```ts
await prisma.post.delete({ where: { id: 1 } });
```
### 4.4. Truy vấn dữ liệu với `where`
```ts
const users = await prisma.user.findMany({ where: { gender: 'male' } });
```
### 4.5. Join bảng (Lấy bài viết và tác giả là nam)
```ts
const posts = await prisma.post.findMany({
  include: { author: true },
  where: { author: { gender: 'male' } }
});
```

---
