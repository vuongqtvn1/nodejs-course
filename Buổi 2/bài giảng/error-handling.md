# Xử lý lỗi trong Express.js

## 1. Giới thiệu về xử lý lỗi trong Express

Xử lý lỗi là một phần quan trọng trong việc xây dựng ứng dụng web. Express cung cấp cơ chế để quản lý lỗi một cách hiệu quả, giúp bạn kiểm soát và phản hồi lỗi đúng cách. Một hệ thống xử lý lỗi tốt giúp đảm bảo tính ổn định của ứng dụng và mang lại trải nghiệm tốt hơn cho người dùng.

## 2. Middleware xử lý lỗi

Trong Express, middleware xử lý lỗi có bốn tham số `(err, req, res, next)`, với `err` là đối tượng lỗi được truyền vào. Middleware này được đặt cuối cùng trong chuỗi middleware để đảm bảo mọi lỗi đều được bắt và xử lý đúng cách.

Ví dụ đơn giản về middleware xử lý lỗi:

```js
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Đã xảy ra lỗi trên server!");
});
```

## 3. Sử dụng Winston để ghi log lỗi

Winston là một thư viện ghi log phổ biến giúp lưu trữ và quản lý log một cách chuyên nghiệp. Dưới đây là cách tích hợp Winston vào Express để ghi log lỗi vào cả console và file:

### 3.1. Cài đặt Winston

```sh
npm install winston
```

### 3.2. Cấu hình Winston

```js
const winston = require("winston");
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});
```

### 3.3. Tích hợp Winston vào middleware xử lý lỗi

```js
app.use((err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
```

## 4. Chuẩn hóa phản hồi API với HttpResponse

Bạn có thể sử dụng một lớp tiện ích để chuẩn hóa phản hồi API, giúp các lỗi và dữ liệu được trả về một cách nhất quán:

```js
export class HttpResponse {
  static Paginate(data) {
    return {
      status: "success",
      code: 200,
      message: "Lấy dữ liệu thành công.",
      data,
    };
  }

  static created(data) {
    return {
      status: "success",
      code: 201,
      message: "Dữ liệu đã được tạo thành công.",
      data,
    };
  }

  static error(errors) {
    return {
      status: "error",
      code: 400,
      message: "Dữ liệu không hợp lệ.",
      error_code: "ERR123456",
      errors,
    };
  }

  static notFound(message = "Không tìm thấy dữ liệu") {
    return {
      status: "not-found",
      code: 404,
      message,
      error_code: "NOT_FOUND",
    };
  }
}
```

### 4.1. Middleware xử lý lỗi sử dụng HttpResponse và Winston

```js
export const errorMiddleware = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.url} - ${req.ip}`);
  res.status(400).json(HttpResponse.error(err.message));
};
```

## 5. Bắt lỗi đồng bộ

Bạn có thể sử dụng `try...catch` để bắt lỗi đồng bộ trong một route handler:

```js
app.get("/", (req, res, next) => {
  try {
    throw new Error("Lỗi xảy ra!");
  } catch (err) {
    next(err);
  }
});
```

## 6. Bắt lỗi bất đồng bộ

Với các hàm async, bạn có thể bắt lỗi và chuyển đến middleware xử lý lỗi:

```js
app.get("/", async (req, res, next) => {
  try {
    await someAsyncFunction();
  } catch (err) {
    next(err);
  }
});
```

### 6.1. Sử dụng wrapper để xử lý lỗi async tự động

Một cách tốt hơn để xử lý lỗi trong các route async là sử dụng một wrapper:

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get(
  "/data",
  asyncHandler(async (req, res) => {
    const data = await fetchDataFromDatabase();
    res.json(HttpResponse.success(data));
  })
);
```

## 7. Xử lý lỗi 404 (Not Found)

Khi không tìm thấy route phù hợp, bạn có thể xử lý lỗi 404 bằng middleware sau:

```js
app.use((req, res, next) => {
  next(HttpResponse.notFound());
});
```

## 8. Xử lý lỗi trong môi trường Production

Trong môi trường production, tránh hiển thị thông tin lỗi nhạy cảm. Bạn có thể kiểm tra biến môi trường `NODE_ENV` để quyết định có nên hiển thị stack trace hay không:

```js
app.use((err, req, res, next) => {
  logger.error(`Server Error: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});
```
