import { v2 as cloudinary } from 'cloudinary'
import { extractPublicId } from 'cloudinary-build-url'

cloudinary.config({
  cloud_name: 'vuongute',
  api_key: '448585553237892',
  api_secret: 'kHsci-mPjr-AZOPHpw56Vc8Yw5I',
})

export class CloudinaryHandler {
  static async deleteFile(path: string) {
    try {
      const publicId = extractPublicId(path)
      console.log({ publicId, path })
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.log(error)
    }
  }
}
