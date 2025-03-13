import { ProductModel } from '../models/product.model'
import {
  CreateProductDTO,
  ProductFilters,
  UpdateProductDTO,
} from '../dtos/product.dto'
import { BaseRepository } from '~/utils/repository'

export class ProductRepository {
  static getQuery(filters: ProductFilters) {
    const condition: Record<string, any> = {}

    if (filters.keyword) {
      condition['name'] = { $regex: new RegExp(filters.keyword, 'i') }
    }

    if (filters.name) {
      condition['name'] = filters.name
    }

    return { condition }
  }

  // static async create(data: CreateProductDTO) {
  //   return await ProductModel.create(data)
  // }

  static async getAll(filters: ProductFilters) {
    const { condition } = ProductRepository.getQuery(filters)

    // cach 1
    // const { sort } = BaseRepository.getQuery(filters)
    // return await ProductModel.find(condition).sort(sort)

    // cach 2
    return await BaseRepository.getAll(ProductModel, condition, filters)
  }

  static async getPaginate(filters: ProductFilters) {
    const { condition } = ProductRepository.getQuery(filters)

    // cach 1
    // const { sort, paginate } = BaseRepository.getQuery(filters)

    // const data = await ProductModel.find(condition)
    //   .sort(sort)
    //   .skip(paginate.skip)
    //   .limit(paginate.limit)

    // const totalData = await ProductModel.find(condition).countDocuments()

    // return { data, totalData }

    const result = await BaseRepository.getPagination(
      ProductModel,
      condition,
      filters
    )

    return result
  }

  // static async getById(id: string) {
  //   return await ProductModel.findById(id)
  // }

  static async update(id: string, data: UpdateProductDTO) {
    return await ProductModel.findByIdAndUpdate(id, data, { new: true })
  }

  static async delete(id: string) {
    return await ProductModel.findByIdAndDelete(id)
  }
}
