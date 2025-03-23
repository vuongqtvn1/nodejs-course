import { BaseRepository } from '~/utils/repository'
import { CreateFileDTO, FileFilters } from '../dtos/file.dto'
import { EFileType, FileModel } from '../models/file.model'

export class FileRepository {
  static getQuery(filters: FileFilters) {
    const condition: Record<string, any> = {}

    if (filters.keyword) {
      condition['name'] = { $regex: new RegExp(filters.keyword, 'i') }
    }

    if (filters.format) {
      condition['format'] = filters.format
    }

    if (filters.type) {
      condition['type'] = filters.type
    }

    if (filters.folder) {
      condition['folder'] = filters.folder
    }

    return { condition }
  }

  static async create(file: CreateFileDTO) {
    return await FileModel.create(file)
  }

  static async getFileById(fileId: string) {
    return await FileModel.findOne({
      _id: fileId,
      type: EFileType.File,
    }).lean()
  }

  static async getFolderById(folderId: string) {
    return await FileModel.findOne({
      _id: folderId,
      type: EFileType.Folder,
    }).lean()
  }

  static async getList(filters: FileFilters) {
    const { condition } = FileRepository.getQuery(filters)

    return await BaseRepository.getAll(FileModel, condition, filters)
  }

  static async getPagination(filters: FileFilters) {
    const { condition } = FileRepository.getQuery(filters)

    return await BaseRepository.getPagination(FileModel, condition, filters)
  }

  static async deleteFileById(id: string) {
    return await BaseRepository.delete(FileModel, id)
  }

  static async deleteFileByFolderId(folderId: string) {
    return await FileModel.deleteMany({ folder: folderId })
  }

  static async renameFile(id: string, newName: string) {
    return await FileModel.findByIdAndUpdate(id, { name: newName })
  }
}
