import { Model, QueryWithHelpers } from 'mongoose'

export interface BaseFilters {
  page?: number
  limit?: number
  sort?: string
  order?: 'ASC' | 'DESC'
}

export class BaseRepository {
  static getQuery(filters: BaseFilters) {
    const sort: Record<string, any> = {}
    const paginate = {
      skip: 0,
      page: 0,
      limit: 0,
      hasPaginate: false,
    }

    if (filters.sort && filters.order) {
      sort[filters.sort] = filters.order === 'ASC' ? 1 : -1
    }

    if (filters.page && filters.limit) {
      paginate.skip = (filters.page - 1) * filters.limit
      paginate.page = filters.page
      paginate.limit = filters.limit
    }

    return { sort, paginate }
  }

  static async create<T>(model: Model<T>, data: T) {
    return await model.create(data)
  }

  static async getAll<T, Type extends BaseFilters>(
    model: Model<T>,
    condition: Record<string, any>,
    filters: Type
  ) {
    const { sort } = BaseRepository.getQuery(filters)

    return await model.find(condition).sort(sort)
  }

  static async getPagination<T, Type extends BaseFilters>(
    model: Model<T>,
    condition: Record<string, any>,
    filters: Type
  ) {
    const { sort, paginate } = BaseRepository.getQuery(filters)

    const data = await model
      .find(condition)
      .sort(sort)
      .skip(paginate.skip)
      .limit(paginate.limit)

    const totalData = await model.find(condition).countDocuments()

    return { data, totalData }
  }

  static async getById<T = any>(model: Model<T>, id: string) {
    return await model.findById(id)
  }

  static async findOne<T = any>(model: Model<T>, condition: object) {
    return await model.findOne(condition)
  }

  static async update<T extends Document = any>(
    model: Model<T>,
    id: string,
    data: T
  ) {
    return await model.findByIdAndUpdate(id, { ...data }, { new: true })
  }

  static async delete<T = any>(model: Model<T>, id: string) {
    return await model.findByIdAndDelete(id)
  }
}
