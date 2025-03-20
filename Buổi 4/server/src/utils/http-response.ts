export class HttpResponse {
  static Paginate(data: any) {
    return {
      status: 'success',
      code: 200,
      message: 'Lấy dữ liệu thành công.',
      data,
    }
  }

  static created(data: any) {
    return {
      status: 'success',
      code: 201,
      message: 'Dữ liệu đã được tạo thành công.',
      data,
    }
  }

  static error(errors: any) {
    return {
      status: 'error',
      code: 400,
      message: 'Dữ liệu không hợp lệ.',
      error_code: 'ERR123456',
      errors,
    }
  }

  static notFound(message = 'Không tìm thấy dữ liệu') {
    return {
      status: 'not-found',
      code: 404,
      message,
      error_code: 'NOT_FOUND',
    }
  }
}
