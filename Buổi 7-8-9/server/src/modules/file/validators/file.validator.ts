import * as yup from 'yup'

export const createFolderSchema = yup.object({
  name: yup.string().required('Folder name is required'),
  folder: yup.string().length(24).nullable().default(null),
})

export const renameFileSchema = yup.object({
  name: yup.string().required('name is required'),
})
