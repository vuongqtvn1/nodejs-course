// Data Transfer Object (DTO)

import { BaseFilters } from '~/utils/repository'
import { EFileType } from '../models/file.model'

export interface CreateFolderDTO {
  name: string
  folder: string | null
}

export interface RenameFileDTO {
  name: string
}

export interface CreateFileDTO {
  name: string
  url: string
  size: number
  format: string
  type: EFileType
  folder: string | null
}

export interface FileFilters extends BaseFilters {
  keyword?: string
  type?: EFileType
  format?: string
  folder?: string
}
