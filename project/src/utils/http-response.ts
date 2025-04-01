import { StatusCodes } from 'http-status-codes'

export class HttpResponse {
  static get({ message, data }: { message?: string; data: any }) {
    return {
      status: 'success',
      code: StatusCodes.OK,
      message: message || 'Lấy dữ liệu thành công.',
      data,
    }
  }

  static created({ message, data }: { message?: string; data: any }) {
    return {
      status: 'success',
      code: StatusCodes.CREATED,
      message: message || 'Dữ liệu đã được tạo thành công.',
      data,
    }
  }

  static updated({ message, data }: { message?: string; data: any }) {
    return {
      status: 'success',
      code: StatusCodes.OK,
      message: message || 'Dữ liệu đã được cập nhập thành công.',
      data,
    }
  }

  static deleted({ message, data }: { message?: string; data: any }) {
    return {
      status: 'success',
      code: StatusCodes.OK,
      message: message || 'Dữ liệu đã được xóa thành công.',
      data,
    }
  }

  static error({
    message,
    code = StatusCodes.BAD_REQUEST,
    errors,
    detail,
  }: {
    message: string
    code?: StatusCodes
    errors?: any
    detail?: any
  }) {
    return {
      status: 'error',
      code,
      message,
      detail,
      errors,
    }
  }
}
