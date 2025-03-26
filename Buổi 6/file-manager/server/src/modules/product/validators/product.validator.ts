import * as yup from 'yup'

export const productSchema = yup.object({
  name: yup.string().required('Product name is required'),
  price: yup.number().positive().required('Price must be a positive number'),
  description: yup.string().optional(),
})
