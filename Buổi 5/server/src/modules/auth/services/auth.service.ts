import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { AuthRepository } from '../repositories/auth.repository'
import { RegisterDTO, LoginDTO } from '../dtos/auth.dto'
import { ConfigEnvironment } from '~/config/env'
import { IUser } from '../models/auth.model'

export class AuthService {
  static signJwt(user: IUser) {
    console.log('userId', String(user._id))
    // Signing a token with 1 hour of expiration:
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: { userId: String(user._id) },
      },
      ConfigEnvironment.jwtSecretKey
    )

    return token
  }

  static async getByEmail(email: string) {
    const user = await AuthRepository.getUserByEmail(email.toLowerCase())
    return user
  }

  static async getMe(userId: string) {
    const user = await AuthRepository.getUserById(userId)

    if (!user) {
      throw Error('User is not exist')
    }

    const token = this.signJwt(user)

    return {
      user,
      token,
    }
  }

  static async register(data: RegisterDTO) {
    const existEmail = await this.getByEmail(data.email)

    if (existEmail) {
      throw Error('Email is exist')
    }

    const salt = bcrypt.genSaltSync(10)
    const passwordHash = bcrypt.hashSync(data.password, salt)

    const user = await AuthRepository.register({
      ...data,
      email: data.email.toLowerCase(),
      password: passwordHash,
    })

    const token = this.signJwt(user)
    const { password, ...userNotPassword } = user

    return {
      token,
      user: userNotPassword,
    }
  }

  static async login(data: LoginDTO) {
    // Bước 1 kiểm tra email đã có chưa => tài khoản đã có
    const existUser = await this.getByEmail(data.email)

    if (!existUser) {
      throw Error('Account is not exist')
    }

    // Bước 2 kiểm tra mất khẩu đúng chưa => đúng
    const isMatching = await bcrypt.compare(data.password, existUser.password)

    if (!isMatching) {
      throw Error('Email or Password is not correct')
    }

    const { password, ...userNotPassword } = existUser

    // Bước 3 xin ra 1 cái token để đăng nhập và thông tin user
    const token = this.signJwt(existUser)
    return {
      token,
      user: userNotPassword,
    }
  }
}
