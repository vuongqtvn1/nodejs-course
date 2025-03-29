import mongoose, { Document } from 'mongoose'

export enum EFileType {
  Folder = 'folder',
  File = 'file',
}

export interface IFile extends Document {
  name: string // ten cai file hoac folder
  url: string // duong dan tuong doi hoac duong dan cloud den cai file do
  size: number // kich thuoc cua file
  format: string // image/png minetype
  type: EFileType // ten cai file hoac folder
  folder: mongoose.ObjectId | null
}

const fileSchema = new mongoose.Schema<IFile>(
  {
    name: String,
    url: String,
    size: Number,
    format: String,
    type: { type: String, enum: Object.values(EFileType), required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
  },
  { timestamps: true }
)

export const FileModel = mongoose.model('File', fileSchema)
