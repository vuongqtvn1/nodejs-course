import { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export class ProductController {
  static async create(req: Request, res: Response) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    const products = await ProductService.getProducts();
    res.json(products);
  }

  static async getOne(req: Request, res: Response) {
    const product = await ProductService.getProductById(req.params.id);
    product
      ? res.json(product)
      : res.status(404).json({ message: "Not Found" });
  }

  static async update(req: Request, res: Response) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ProductService.deleteProduct(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
