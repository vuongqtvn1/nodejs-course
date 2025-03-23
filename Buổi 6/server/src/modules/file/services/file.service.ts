import fs from 'fs'
import path from 'path'
import { rimraf } from 'rimraf'

import { HttpResponse } from '~/utils/http-response'
import { CreateFileDTO, FileFilters } from '../dtos/file.dto'
import { FileRepository } from '../repositories/file.repository'
import { EFileType } from '../models/file.model'
import { createFolderDirectory } from '~/utils/helper'

export class FileService {
  static async createFolder(file: CreateFileDTO) {
    const parentFolder = file.folder

    if (parentFolder) {
      const existFolder = await FileRepository.getFolderById(parentFolder)

      if (!existFolder) {
        throw HttpResponse.notFound('Folder not found')
      }

      file.url = path.join(existFolder.url, file.name)
    }

    file.type = EFileType.Folder

    createFolderDirectory(file.url)

    return await FileRepository.create(file)
  }

  static async createFile(file: CreateFileDTO) {
    if (file.folder) {
      const existFolder = await FileRepository.getFolderById(file.folder)

      if (!existFolder) {
        // delete file
        fs.unlinkSync(file.url)
        throw HttpResponse.notFound('Folder not found')
      }
    }

    return await FileRepository.create(file)
  }

  static async getFolderById(id: string) {
    return await FileRepository.getFolderById(id)
  }

  static async getList(filters: FileFilters) {
    return await FileRepository.getList(filters)
  }

  static async getPagination(filters: FileFilters) {
    return await FileRepository.getPagination(filters)
  }

  static async deleteFile(id: string) {
    const file = await FileRepository.getFileById(id)

    if (!file) {
      throw HttpResponse.notFound('File not found')
    }

    fs.unlinkSync(file.url)
    await FileRepository.deleteFileById(id)
  }

  static async deleteManyFileByFolderId(folders: string[]) {
    if (!folders.length) return

    const [folderId, ...rest] = folders

    await FileRepository.deleteFileById(folderId)

    const childrenFolders = await FileRepository.getList({
      folder: folderId,
      type: EFileType.Folder,
    })

    const childrenIds = childrenFolders.map((item) => String(item._id))

    const newFolders = Array.isArray(rest)
      ? [...rest, ...childrenIds]
      : childrenIds

    await this.deleteManyFileByFolderId(newFolders)
  }

  static async deleteFolder(folderId: string) {
    const folder = await FileRepository.getFolderById(folderId)

    if (!folder) {
      throw HttpResponse.notFound('Folder not found')
    }

    rimraf.sync(folder.url)
    await FileRepository.deleteFileById(folderId)
    this.deleteManyFileByFolderId([folderId])
  }

  static async renameFile(payload: {
    fileId: string
    type: EFileType
    newName: string
  }) {
    const { fileId, newName, type } = payload

    // if (type === EFileType.File) {
    //   const file = await FileRepository.getFileById(fileId)

    //   if (!file) {
    //     throw HttpResponse.notFound('File not found')
    //   }
    //   // newName = anh1 => /uploads/ + anh1  + .jpg
    //   // /uploads/anh.jpg
    //   // const urlRename = path.join(
    //   //   path.dirname(file.url),
    //   //   newName + path.extname(file.url)
    //   // )

    //   // fs.renameSync(file.url, urlRename)

    //   await FileRepository.renameFile(fileId, newName)
    // }

    await FileRepository.renameFile(fileId, newName)
  }
}
