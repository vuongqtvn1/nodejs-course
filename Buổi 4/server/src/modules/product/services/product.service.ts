import { ProductRepository } from '../repositories/product.repository'
import {
  CreateProductDTO,
  ProductFilters,
  UpdateProductDTO,
} from '../dtos/product.dto'
import { BaseRepository } from '~/utils/repository'

export class ProductService {
  static async createProduct(data: CreateProductDTO) {
    // return await BaseRepository.create<IProduct>(ProductModel, data)
  }

  static async getProducts(filters: ProductFilters) {
    return await ProductRepository.getAll(filters)
  }

  static async getProductFilter(filters: ProductFilters) {
    return await ProductRepository.getPaginate(filters)
  }

  static async getProductById(id: string) {
    return null
    // return await BaseRepository.getById(ProductModel, id)
  }

  static async updateProduct(id: string, data: UpdateProductDTO) {
    return await ProductRepository.update(id, data)
  }

  static async deleteProduct(id: string) {
    return await ProductRepository.delete(id)
  }
}
