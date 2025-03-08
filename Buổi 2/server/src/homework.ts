import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { HttpResponse } from "./http-response";
import logger from "./logger";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

const products = [
  { id: 1, name: "product 1" },
  { id: 2, name: "product 2" },
];

// POST /products tao san pham
app.post("/products", (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string") {
      throw new Error("Name is required");
    }

    products.push({ id: new Date().getTime(), name });

    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
});

// GET /products lay danh sach san pham
app.get("/products", (req, res, next) => {
  try {
    const name = req.query.name as string;

    if (name) {
      const product = products.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );

      res.status(200).json(product);
      return;
    }

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET  /products/:productId lay chi tiet san pham
app.get("/products/:productId", (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = products.find((item) => item.id === parseInt(productId));

    if (!product) {
      res.status(404).json(HttpResponse.notFound("Product not found"));
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /products/:productId cap nhap san pham
app.put("/products/:productId", (req, res, next) => {
  try {
    const productId = req.params.productId;

    const { name } = req.body;

    if (!name || typeof name !== "string") {
      throw new Error("Name is required");
    }

    const index = products.findIndex((item) => item.id === parseInt(productId));

    if (index === -1) {
      res.status(404).json(HttpResponse.notFound("Product not found"));
      return;
    }

    products.splice(index, 1, { id: parseInt(productId), name });

    res.status(200).json(products[index]);
  } catch (error) {
    next(error);
  }
});

// DELETE /products/:productId xoa san pham
app.delete("/products/:productId", (req, res, next) => {
  try {
    const productId = req.params.productId;

    const index = products.findIndex((item) => item.id === parseInt(productId));

    if (index === -1) {
      res.status(404).json(HttpResponse.notFound("Product not found"));
      return;
    }

    products.splice(index, 1);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

// handler notfound
app.use("*", (req, res, next) => {
  next(HttpResponse.notFound("Không tìm thấy api nay"));
});

// handler error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(500).json(HttpResponse.error(err.message));
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`⚡ Server is running on http://localhost:${PORT}`);
});
