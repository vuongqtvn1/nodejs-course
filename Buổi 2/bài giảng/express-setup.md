# Express với TypeScript

## 1. Cài đặt Express với TypeScript

### Bước 1: Khởi tạo dự án

```sh
mkdir express-typescript-server
cd express-typescript-server
npm init -y
```

### Bước 2: Cài đặt dependencies

```sh
npm install express dotenv cors body-parser
npm install -D typescript @types/node @types/express ts-node nodemon
```

### Bước 3: Cấu hình TypeScript

```sh
npx tsc --init
```

Mở `tsconfig.json` và chỉnh sửa:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "module": "CommonJS",
    "esModuleInterop": true,
    "strict": true
  }
}
```

### Bước 4: Cấu trúc thư mục

```sh
mkdir src
```

Tạo file `src/server.ts`.

## 2. Giải thích Query Params, Route Params, Body Data

### Query Params là gì?

Query Params là tham số được truyền trong URL sau dấu `?`, thường dùng để **lọc**, **sắp xếp**, hoặc **phân trang** dữ liệu.

**Cách lấy Query Params trong Express:**

```ts
req.query; // Trả về một object chứa các query params
```

**Ví dụ:**

```sh
GET /users/search?name=John
```

```ts
app.get("/users/search", (req: Request, res: Response) => {
  const name = req.query.name as string;
  res.json({ message: `Tìm kiếm user có tên: ${name}` });
});
```

### Route Params là gì?

Route Params là tham số động trong URL, thường dùng để lấy dữ liệu theo **ID** hoặc một thuộc tính cụ thể.

**Cách lấy Route Params trong Express:**

```ts
req.params; // Trả về object chứa các route params
```

**Ví dụ:**

```sh
GET /users/1
```

```ts
app.get("/users/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  res.json({ message: `Lấy thông tin user có ID: ${userId}` });
});
```

### Body Data là gì?

Body Data chứa dữ liệu được gửi lên server trong **body** của request, thường dùng cho **POST, PUT, PATCH**.

**Cách lấy Body Data trong Express:**

```ts
req.body; // Trả về object chứa dữ liệu từ body request
```

**Ví dụ:**

```sh
POST /users
Content-Type: application/json

{
  "id": 3,
  "name": "Alice"
}
```

```ts
app.post("/users", (req: Request, res: Response) => {
  const { id, name } = req.body;
  res.json({ message: `Thêm user: ${name} với ID: ${id}` });
});
```

## 3. Viết Server Express

Mở file `src/server.ts` và nhập đoạn code sau:

```ts
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Dữ liệu giả lập
let users = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Doe" },
];

// Demo các phương thức request trong Express
app.get("/users", (req, res) => res.json(users));
app.post("/users", (req, res) => {
  const { id, name } = req.body;
  users.push({ id, name });
  res.json({ message: "User added", users });
});
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name } = req.body;
  users = users.map((user) => (user.id === userId ? { ...user, name } : user));
  res.json({ message: "User updated", users });
});
app.patch("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name } = req.body;
  users = users.map((user) =>
    user.id === userId ? { ...user, name: name || user.name } : user
  );
  res.json({ message: "User partially updated", users });
});
app.delete("/users/:id", (req, res) => {
  users = users.filter((user) => user.id !== parseInt(req.params.id));
  res.json({ message: "User deleted", users });
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
```
