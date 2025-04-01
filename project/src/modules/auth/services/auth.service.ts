import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

import { ConfigEnvironment } from "~/config/env";
import { HttpResponse } from "~/utils/http-response";
import { LoginDTO, RegisterDTO } from "../dtos/auth.dto";
import { EAuthProvider, IUser } from "../models/auth.model";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthService {
  static generateToken(user: IUser) {
    // generate token jsonwebtoken 1 day expire
    const token = jwt.sign({ id: user._id }, ConfigEnvironment.jwtSecret, {
      expiresIn: "1d", // 1 day
    });

    return token;
  }

  static withoutPassword(user: IUser) {
    const { password, ...data } = user;
    return data;
  }

  static async getById(userId: string) {
    const user = await AuthRepository.getById(userId);

    return user;
  }

  static async getByProvider(provider: EAuthProvider, providerId: string) {
    const user = await AuthRepository.getByProvider(provider, providerId);

    return user;
  }

  static async getMe(userId: string) {
    // b1. check user exist
    const user = await AuthRepository.getById(userId);

    if (!user) {
      throw HttpResponse.error({
        code: StatusCodes.UNAUTHORIZED,
        message: "Unauthorize",
      });
    }

    // b2. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async registerByAccount(data: RegisterDTO) {
    // b1. check email exist
    const existingUser = await AuthRepository.getByEmail(data.email);

    if (existingUser) {
      throw HttpResponse.error({ message: "Email đã tồn tại" });
    }

    // b2. hashing password => saving database user
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(data.password, salt);

    const user = await AuthRepository.registerByAccount({
      ...data,
      password: passwordHash,
    });

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async loginByAccount(data: LoginDTO) {
    // b1. check user exist
    const user = await AuthRepository.getByEmail(data.email);

    if (!user) {
      throw HttpResponse.error({
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // b2. compare password => password hash === password client
    const isMatching = bcrypt.compareSync(data.password, user.password);

    if (!isMatching) {
      throw HttpResponse.error({
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    // b3. generate token => return token, user information
    const token = this.generateToken(user);

    return { user: this.withoutPassword(user), token };
  }

  static async registerBySocial(payload: {
    data: RegisterDTO;
    provider: EAuthProvider;
    providerId: string;
  }) {
    const { data, provider, providerId } = payload;

    const userSocial = await this.getByProvider(provider, providerId);

    // exist user provider
    if (userSocial) {
      return userSocial;
    }

    // not account social
    // b1. check user exist
    const existUser = await AuthRepository.getByEmail(data.email);

    if (existUser) {
      throw HttpResponse.error({ message: "Email đã tồn tại" });
    }

    // b2. create user
    const user = await AuthRepository.registerBySocial({
      data,
      provider,
      providerId,
    });

    return user;
  }
}
