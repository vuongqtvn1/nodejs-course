# Hướng dẫn thiết lập MySQL với Docker Compose và Prisma

## 1. Tạo `docker-compose.yml` để chạy MySQL
Tạo một file `docker-compose.yml` trong thư mục dự án của bạn:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Sau đó, chạy lệnh sau để khởi động MySQL:

```sh
docker-compose up -d
```

---

## 2. Cài đặt Prisma
Nếu chưa có Prisma trong dự án, bạn cài đặt nó bằng:

```sh
npm install prisma --save-dev
npx prisma init
```

Lệnh này sẽ tạo một thư mục `prisma/` và file `.env`.

---

## 3. Cấu hình Prisma kết nối MySQL
Mở file `.env` và cập nhật `DATABASE_URL`:

```env
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
```

Mở file `prisma/schema.prisma` và chỉnh sửa như sau:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
}
```

Tiếp theo, chạy lệnh sau để tạo bảng trong MySQL:

```sh
npx prisma migrate dev --name init
```

Và sinh Prisma Client:

```sh
yarn add @prisma/client
npx prisma generate
```

---

## 4. Kiểm tra dữ liệu bằng Terminal
Có thể sử dụng Prisma Studio để xem dữ liệu:

```sh
npx prisma studio
```

Hoặc sử dụng Prisma Client trong một script Node.js:

```js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Chạy lệnh:

```sh
node script.js
```

---

## 5. Kết nối bằng GUI
Có thể dùng một số công cụ GUI để xem dữ liệu:

- **TablePlus** (Windows/Mac)
- **MySQL Workbench** (Windows/Mac/Linux)
- **DBeaver** (Windows/Mac/Linux)

Dùng thông tin sau để kết nối:

- **Host**: `localhost`
- **Port**: `3306`
- **User**: `user`
- **Password**: `password`
- **Database**: `mydb`

---

## 6. Hướng dẫn sử dụng Prisma Studio 🚀

### 6.1. Prisma Studio

Chạy lệnh sau trong terminal:

```sh
npx prisma studio
```

Lệnh này sẽ mở một giao diện web tại địa chỉ mặc định:  
👉 `http://localhost:5555`

### 6.2. Duyệt dữ liệu
- Nhấp vào **User** để xem danh sách người dùng trong database.
- Nếu bảng trống, bạn có thể thêm dữ liệu.

### 6.3. Thêm dữ liệu mới
Nhấp vào **"Add Record"** để thêm một dòng mới vào bảng.  
Nhập dữ liệu vào các cột và nhấn **Save Changes** để lưu.

### 6.4. Sửa hoặc xóa dữ liệu
- Để **chỉnh sửa**, nhấp vào ô dữ liệu, thay đổi giá trị và nhấn **Save Changes**.
- Để **xóa một dòng**, nhấp vào biểu tượng thùng rác bên cạnh bản ghi.

### 6.5. Đóng Prisma Studio
Để dừng Prisma Studio, bạn có thể:
- **Nhấn `CTRL + C`** trong terminal để thoát.
- Hoặc đơn giản đóng tab trình duyệt.

### 6.6. Cập nhập modals, reset
- Nếu bạn cập nhật `schema.prisma`, hãy chạy lại:

  ```sh
  npx prisma migrate dev --name update_schema
  npx prisma generate
  ```

- Nếu bạn muốn reset dữ liệu, chạy:

  ```sh
  npx prisma db push --force-reset
  ```

---


