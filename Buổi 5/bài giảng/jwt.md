# Xác thực và phân quyền với JWT

### 1. Giới thiệu về JWT (JSON Web Token)

#### **JWT (JSON Web Token) là gì?**

JWT là một chuẩn mở (RFC 7519) để truyền tải thông tin một cách an toàn giữa các bên dưới dạng JSON. Nó được sử dụng phổ biến trong hệ thống xác thực.

#### **Cấu trúc của JWT**

JWT bao gồm ba phần chính:

- **Header**: Chứa thông tin về thuật toán mã hóa (HS256, RS256,...)
- **Payload**: Chứa thông tin của data decode (id, role, exp,...)
- **Signature**: Dùng để kiểm tra tính hợp lệ của token

Ví dụ một JWT:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJ1c2VyIiwiZXhwIjoxNjg1NTU2ODAwfQ.P9A0TfTjkgX2G5FhQ4BMRsA8F5AjwY27c0kPkjFJ8gE
```

#### **Cơ chế hoạt động của JWT trong xác thực**

1. **Đăng ký:** Người dùng gửi thông tin (email, password) đến server.
2. **Xác thực:** Server kiểm tra thông tin, nếu hợp lệ sẽ tạo JWT chứa userId và gửi lại.
3. **Lưu trữ JWT:** Client lưu JWT vào localStorage hoặc cookie.
4. **Gửi yêu cầu có JWT:** Khi người dùng truy cập các API yêu cầu xác thực, JWT được gửi kèm trong header Authorization.
5. **Xác minh JWT:** Server kiểm tra JWT, nếu hợp lệ thì cho phép truy cập.

### **Ví dụ API xác thực bằng JWT**

#### **Cài đặt thư viện**
```bash
npm install jsonwebtoken bcryptjs express body-parser dotenv
```

#### **Cấu hình môi trường**
Tạo file `.env`:
```env
JWT_SECRET=mysecretkey
PORT=3000
```

#### **Tạo API đăng ký và đăng nhập với JWT**
```typescript
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const users: { email: string; password: string }[] = [];

// Đăng ký
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.json({ message: 'Đăng ký thành công!' });
});

// Đăng nhập
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    res.json({ token });
});

// Middleware kiểm tra JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.sendStatus(403);
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Route cần xác thực
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Bạn đã truy cập thành công vào route bảo vệ!', user: req.user });
});

app.listen(process.env.PORT, () => console.log(`Server chạy trên cổng ${process.env.PORT}`));
```

---

