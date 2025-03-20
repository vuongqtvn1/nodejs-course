# CRUD Example with Local Mock Data

## 1. Khởi tạo dự án Express với TypeScript

```sh
mkdir express-crud-example
cd express-crud-example
npm init -y
npm install express cors body-parser
npm install --save-dev typescript @types/express @types/node @types/cors
```

## 2. Cấu hình TypeScript

Tạo file `tsconfig.json`:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}
```

## 3. Tạo cấu trúc thư mục

```sh
mkdir src
cd src
```

## 4. Tạo file `server.ts`

```ts
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

interface Product {
  id: number;
  name: string;
  price: number;
}

// Mock data
let products: Product[] = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Phone", price: 800 },
];

// Get all products
app.get("/products", (req: Request, res: Response) => {
  res.json(products);
});

// Get product by ID
app.get("/products/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
});

// Create a new product
app.post("/products", (req: Request, res: Response) => {
  const newProduct: Product = {
    id: products.length + 1,
    name: req.body.name,
    price: req.body.price,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put("/products/:id", (req: Request, res: Response) => {
  const index = products.findIndex((p) => p.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Partially update a product
app.patch("/products/:id", (req: Request, res: Response) => {
  const product = products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  Object.assign(product, req.body);
  res.json(product);
});

// Delete a product
app.delete("/products/:id", (req: Request, res: Response) => {
  products = products.filter((p) => p.id !== Number(req.params.id));
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## 5. Chạy ứng dụng

```sh
npx tsc
node dist/server.js
```

## 6. API Endpoints

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| GET    | `/products`     | Lấy danh sách sản phẩm               |
| GET    | `/products/:id` | Lấy chi tiết sản phẩm theo ID        |
| POST   | `/products`     | Thêm sản phẩm mới                    |
| PUT    | `/products/:id` | Cập nhật sản phẩm                    |
| PATCH  | `/products/:id` | Cập nhật một phần thông tin sản phẩm |
| DELETE | `/products/:id` | Xóa sản phẩm                         |

### Giải thích từng phần

1. **Cấu hình server**:

   - Sử dụng Express để tạo API
   - Middleware `cors()` cho phép truy cập từ các nguồn khác nhau
   - `express.json()` để parse request body JSON

2. **Định nghĩa dữ liệu**:

   - Interface `Product` mô tả sản phẩm với `id`, `name`, `price`
   - Mock data `products` là mảng chứa danh sách sản phẩm

3. **CRUD Routes**:

   - `GET /products`: Trả về toàn bộ danh sách sản phẩm
   - `GET /products/:id`: Trả về sản phẩm theo ID
   - `POST /products`: Thêm sản phẩm mới vào danh sách
   - `PUT /products/:id`: Cập nhật sản phẩm theo ID
   - `PATCH /products/:id`: Cập nhật một số thông tin sản phẩm
   - `DELETE /products/:id`: Xóa sản phẩm theo ID

4. **Chạy ứng dụng**:
   - `npx tsc` để build TypeScript
   - `node dist/server.js` để chạy server
