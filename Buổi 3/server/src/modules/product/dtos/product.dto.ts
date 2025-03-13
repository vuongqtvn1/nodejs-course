// Data Transfer Object (DTO)

export interface CreateProductDTO {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateProductDTO {
  name?: string;
  price?: number;
  description?: string;
}
