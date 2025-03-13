import { ProductModel } from "../models/product.model";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";

export class ProductRepository {
  static async create(data: CreateProductDTO) {
    return await ProductModel.create(data);
  }

  static async getAll() {
    return await ProductModel.find();
  }

  static async getById(id: string) {
    return await ProductModel.findById(id);
  }

  static async update(id: string, data: UpdateProductDTO) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
