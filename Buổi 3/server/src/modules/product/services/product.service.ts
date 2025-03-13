import { ProductRepository } from "../repositories/product.repository";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";

export class ProductService {
  static async createProduct(data: CreateProductDTO) {
    return await ProductRepository.create(data);
  }

  static async getProducts() {
    return await ProductRepository.getAll();
  }

  static async getProductById(id: string) {
    return await ProductRepository.getById(id);
  }

  static async updateProduct(id: string, data: UpdateProductDTO) {
    return await ProductRepository.update(id, data);
  }

  static async deleteProduct(id: string) {
    return await ProductRepository.delete(id);
  }
}
