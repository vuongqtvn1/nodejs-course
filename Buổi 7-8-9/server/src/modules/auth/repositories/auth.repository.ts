import { RegisterDTO } from "../dtos/auth.dto";
import { EAuthProvider, IUser, UserModel } from "../models/auth.model";

export class AuthRepository {
  static async getByEmail(email: string) {
    return await UserModel.findOne({ email }).lean();
  }

  static async getById(userId: string) {
    return await UserModel.findById(userId, "-password").lean();
  }

  static async getByProvider(provider: EAuthProvider, providerId: string) {
    return await UserModel.findOne(
      { provider, providerId },
      "-password"
    ).lean();
  }

  static async registerByAccount(data: RegisterDTO) {
    const user = await UserModel.create({
      ...data,
      provider: EAuthProvider.Account,
    });
    return user.toObject();
  }

  static async registerBySocial(payload: {
    data: RegisterDTO;
    provider: EAuthProvider;
    providerId: string;
  }) {
    const { data, provider, providerId } = payload;

    const user = await UserModel.create({
      ...data,
      provider,
      providerId,
    });

    return user.toObject();
  }
}
