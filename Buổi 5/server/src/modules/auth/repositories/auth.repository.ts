import { RegisterDTO } from '../dtos/auth.dto'
import { UserModel } from '../models/auth.model'

export class AuthRepository {
  static async register(data: RegisterDTO) {
    return (await UserModel.create(data)).toObject()
  }

  // .lean() => document transform json
  static async getUserById(userId: string) {
    return await UserModel.findById(userId, '-password').lean()
  }

  static async getUserByEmail(email: string) {
    return await UserModel.findOne({ email }).lean()
  }
}
