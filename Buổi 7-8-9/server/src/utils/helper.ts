import path from 'path'
import fs from 'fs'
import { ConfigEnvironment } from '~/config/env'

export const tryParseJson = (str: any) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return {}
  }
}

export const formatErrorYup = (errorYup: any) => {
  const errors: Record<string, Array<{ id: string; message: string }>> = {}

  errorYup.inner.forEach((error: any) => {
    if (error.path !== undefined) {
      errors[error.path] = error.errors.map((message: string) => ({
        id: message,
        message,
      }))
    }
  })

  return errors
}

export const getFilePath = (uploadDir: string, filename: string) => {
  return path.posix.join(uploadDir, filename)
}

export const createFolderDirectory = (directory: string) => {
  const isExist = fs.existsSync(directory)

  if (!isExist) {
    fs.mkdirSync(directory, { recursive: true })
  }
}
