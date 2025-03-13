# Cấu trúc folder dự án phổ biến trong Express.js TypeScript

Trong một dự án Express.js sử dụng TypeScript, tổ chức folder hợp lý giúp code dễ quản lý, mở rộng và bảo trì. Có nhiều cách tổ chức, nhưng cách phổ biến nhất là theo style **modules**.

## 1. Cấu trúc thư mục phổ biến theo modules

```
📦 src/
 ┣ 📂 config/            # Cấu hình chung
 ┣ 📂 modules/           # Chứa các module chính
 ┃ ┣ 📂 user/            # Module người dùng (ví dụ cụ thể)
 ┃ ┃ ┣ 📂 controllers/  # Xử lý request
 ┃ ┃ ┣ 📂 services/     # Xử lý logic nghiệp vụ
 ┃ ┃ ┣ 📂 repositories/ # Tương tác với database
 ┃ ┃ ┣ 📂 validators/   # Xác thực dữ liệu đầu vào
 ┃ ┃ ┣ 📂 middlewares/  # Middleware cho module này
 ┃ ┃ ┣ 📂 routes/       # Định nghĩa API
 ┃ ┃ ┗ 📜 index.ts      # Gộp tất cả các phần của module
 ┣ 📂 middlewares/      # Middleware chung cho hệ thống
 ┣ 📂 utils/            # Các hàm tiện ích chung
 ┣ 📂 types/            # Định nghĩa kiểu dữ liệu
 ┣ 📜 server.ts         # Điểm bắt đầu của ứng dụng
 ┣ 📜 app.ts            # Khởi tạo Express app
```

---

## 2. Ví dụ cụ thể - Module User

### 2.1. Khai báo routes (routes/user.routes.ts)

```ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validateUser } from "../validators/user.validator";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.get("/", authMiddleware, userController.getUsers);
router.post("/", validateUser, userController.createUser);
router.put("/:id", validateUser, authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);

export default router;
```

### 2.2. Controller xử lý request (controllers/user.controller.ts)

```ts
import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private userService = new UserService();

  async getUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }

  async createUser(req: Request, res: Response) {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  }

  async updateUser(req: Request, res: Response) {
    const updatedUser = await this.userService.updateUser(
      req.params.id,
      req.body
    );
    res.json(updatedUser);
  }

  async deleteUser(req: Request, res: Response) {
    await this.userService.deleteUser(req.params.id);
    res.sendStatus(204);
  }
}
```

### 2.3. Service xử lý logic nghiệp vụ (services/user.service.ts)

```ts
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository = new UserRepository();

  async getAllUsers() {
    return this.userRepository.findAll();
  }

  async createUser(userData: any) {
    return this.userRepository.create(userData);
  }

  async updateUser(id: string, userData: any) {
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
```

### 2.4. Repository xử lý database (repositories/user.repository.ts)

```ts
import mongoose from "mongoose";
import { UserModel } from "../models/user.model";

export class UserRepository {
  async findAll() {
    return UserModel.find();
  }

  async create(userData: any) {
    return UserModel.create(userData);
  }

  async update(id: string, userData: any) {
    return UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string) {
    return UserModel.findByIdAndDelete(id);
  }
}
```

### 2.5. Middleware kiểm tra đăng nhập (middlewares/auth.middleware.ts)

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

### 2.6. Validator kiểm tra dữ liệu request (validators/user.validator.ts)

```ts
import * as yup from "yup";
import { Request, Response, NextFunction } from "express";

const userSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await userSchema.validate(req.body, { abortEarly: false });
    next();
  } catch (error) {
    res.status(400).json({ errors: error.errors });
  }
};
```

---

## 3. Tổng kết

- **Cấu trúc theo modules** giúp code dễ mở rộng.
- **Controller**: Nhận request, gọi **Service** để xử lý.
- **Service**: Xử lý logic, gọi **Repository** để truy cập database.
- **Repository**: Làm việc trực tiếp với MongoDB.
- **Middleware**: Kiểm tra đăng nhập, phân quyền.
- **Validator**: Xác thực dữ liệu đầu vào bằng Yup.
- **Routes**: Định nghĩa API.
