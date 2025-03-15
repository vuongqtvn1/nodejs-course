// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository'
// import { IProduct } from '../models/product.model'

export interface CreateProductDTO {
  name: string
  price: number
  description?: string
}

export interface UpdateProductDTO {
  name?: string
  price?: number
  description?: string
}

export interface ProductFilters extends BaseFilters {
  keyword?: string
  name?: string
}
