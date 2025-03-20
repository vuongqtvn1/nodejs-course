# Middleware trong Express

## 1. Middleware là gì?

Middleware trong Express là các hàm trung gian có quyền truy cập vào **request (req)**, **response (res)** và **hàm next()**. Middleware có thể:

- **Thay đổi request hoặc response** (chỉnh sửa, thêm dữ liệu vào `req` hoặc `res`).
- **Dừng lại hoặc tiếp tục luồng xử lý** (gọi `next()` để chuyển tiếp hoặc kết thúc response).
- **Xử lý logic chung** như kiểm tra xác thực, logging, xử lý lỗi, hạn chế truy cập, v.v.

---

## 2. Middleware mặc định của Express

### a. `express.json()` - Middleware parse JSON

Middleware này **tự động parse body của request có kiểu JSON** vào `req.body`.

```js
const express = require("express");
const app = express();

app.use(express.json()); // Middleware parse JSON

app.post("/data", (req, res) => {
  console.log(req.body); // Dữ liệu JSON đã được parse
  res.send({ message: "Dữ liệu đã nhận", data: req.body });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

### b. `express.urlencoded()` - Middleware xử lý dữ liệu form

Middleware này **parse dữ liệu từ form gửi lên (application/x-www-form-urlencoded)**.

```js
app.use(express.urlencoded({ extended: true }));
```

- `extended: true`: Có thể parse object lồng nhau.
- `extended: false`: Chỉ parse dữ liệu dạng chuỗi và array đơn giản.

**Ví dụ:**

```js
app.post("/submit", (req, res) => {
  console.log(req.body); // Lấy dữ liệu từ form
  res.send({ message: "Dữ liệu form đã nhận", data: req.body });
});
```

---

### c. `express.static()` - Middleware phục vụ file tĩnh

Middleware này phục vụ file tĩnh như ảnh, CSS, JavaScript từ thư mục cụ thể.

```js
app.use(express.static("public"));
```

- Nếu có file `/public/logo.png`, có thể truy cập qua `http://localhost:3000/logo.png`.

**Tùy chỉnh đường dẫn:**

```js
app.use("/static", express.static("public"));
```

Bây giờ file `/public/logo.png` sẽ được truy cập qua `http://localhost:3000/static/logo.png`.

Bạn cũng có thể phục vụ nhiều thư mục:

```js
app.use(express.static("public"));
app.use(express.static("assets"));
```

**Tuỳ chỉnh theo điều kiện cụ thể:**

```js
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
```

Bây giờ file `/uploads/image.jpg` sẽ được truy cập qua `http://localhost:3000/uploads/image.jpg`.

## 3. Middleware tự định nghĩa

### a. Logger Middleware - Ghi log request

Ghi lại thông tin mỗi request vào console.

```js
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next(); // Chuyển tiếp request đến middleware tiếp theo
};

app.use(logger);
```

---

### b. Middleware kiểm tra xác thực (Authentication)

Kiểm tra token trước khi xử lý request.

```js
const checkAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

app.get("/private", checkAuth, (req, res) => {
  res.send("Welcome to private route!");
});
```

---

### c. Middleware xử lý lỗi

```js
const errorHandler = (err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message });
};

app.use(errorHandler);
```

---

## 4. Middleware của bên thứ ba phổ biến

### a. `morgan` – Logging request

```js
const morgan = require("morgan");
app.use(morgan("combined"));
```

---

### b. `cors` – Cho phép request từ domain khác

- **Allow tất cả các domain:**

```js
const cors = require("cors");
app.use(cors());
```

- **Allow chỉ 1 domain cụ thể:**

```js
app.use(cors({ origin: "https://example.com" }));
```

- **Allow nhiều domain cụ thể:**

```js
const allowedOrigins = ["https://example.com", "https://another.com"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
```

---

### c. `helmet` – Bảo mật HTTP headers

- **Chặn Clickjacking:**

```js
const helmet = require("helmet");
app.use(helmet.frameguard({ action: "deny" }));
```

- **Chặn XSS với ví dụ client gửi dữ liệu có mã độc:**

```js
app.use(helmet.xssFilter());

app.post("/comment", (req, res) => {
  const userInput = req.body.comment;
  res.send(`Bạn đã gửi bình luận: ${userInput}`);
});
```

**Ví dụ gửi request chứa XSS từ client:**

```json
{
  "comment": "<script>alert('Hacked!');</script>"
}
```

Sau khi bật `helmet.xssFilter()`, trình duyệt sẽ chặn script độc hại này.

---

### d. `express-rate-limit` – Giới hạn request

- **Chặn theo IP:**

```js
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 request mỗi 15 phút
  message: "Quá nhiều request, vui lòng thử lại sau!",
});

app.use(limiter);
```

- **Chặn theo địa chỉ email:**

```js
const emailLimiter = {};

const rateLimitByEmail = (req, res, next) => {
  const email = req.body.email;
  if (!email) return res.status(400).json({ message: "Email là bắt buộc" });

  if (!emailLimiter[email]) {
    emailLimiter[email] = { count: 1, firstRequestTime: Date.now() };
  } else {
    emailLimiter[email].count++;
    if (
      emailLimiter[email].count > 5 &&
      Date.now() - emailLimiter[email].firstRequestTime < 60000
    ) {
      return res
        .status(429)
        .json({ message: "Quá nhiều request từ email này" });
    }
  }
  next();
};

app.post("/register", rateLimitByEmail, (req, res) => {
  res.send("Đăng ký thành công!");
});
```

---

### e. `compression` – Nén dữ liệu phản hồi

```js
const compression = require("compression");
app.use(compression());
```

Giúp giảm kích thước phản hồi, tối ưu tốc độ tải trang.

---

### f. `cookie-parser` – Xử lý cookie

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser());
```

Dùng để đọc và xử lý cookie trong request.

---

### g. `express-session` – Quản lý session

```js
const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Đặt true nếu dùng HTTPS
  })
);
```

Giúp lưu trữ thông tin session trên server.

---
