# Prisma Models

## 1. Prisma Migrate

### 1.1 Models (Introspection và Migration)

#### Định nghĩa Models
Model trong Prisma là một đại diện của một bảng trong cơ sở dữ liệu. Mỗi model được định nghĩa trong schema.prisma.

Ví dụ:
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  role  Role
  address Address
}
```

#### Mapping model names to tables or collections
Mặc định, Prisma sử dụng tên model để tạo bảng trong cơ sở dữ liệu. Ta có thể ánh xạ tên model sang bảng bằng `@@map`.

Ví dụ:
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique

  @@map("users_table")
}
```

### 1.2 Defining Fields

#### Scalar Fields
Scalar fields là các trường lưu trữ giá trị đơn giản như `String`, `Int`, `Boolean`, `DateTime`, `Float`.

Ví dụ:
```prisma
model Product {
  id    Int     @id @default(autoincrement())
  name  String
  price Float
}
```

#### Relation Fields
Relation fields được sử dụng để thiết lập quan hệ giữa các model.

Ví dụ:
```prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}
```

#### Native Types Mapping
Cho phép sử dụng các kiểu dữ liệu native của từng hệ quản trị CSDL.

Ví dụ (PostgreSQL):
```prisma
model Example {
  id   Int    @id @default(autoincrement())
  data String @db.Text
}
```

### 1.3 Defining Attributes

#### Defining an ID Field
```prisma
model Example {
  id Int @id @default(autoincrement())
}
```

#### Defining a Default Value
```prisma
model User {
  id   Int    @id @default(autoincrement())
  name String @default("Anonymous")
}
```

#### Defining a Unique Field
```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
}
```

#### Defining an Index
```prisma
model Product {
  id   Int    @id @default(autoincrement())
  name String

  @@index([name])
}
```

#### Defining Enums
```prisma
enum Role {
  USER
  ADMIN
}
```
Ví dụ sử dụng Enum trong model:
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
  role  Role   @default(USER)
}
```

#### Defining Composite Types
Composite types giúp lưu trữ dữ liệu phức hợp.

Ví dụ:
```prisma
type Address {
  street  String
  city    String
  country String
}

model User {
  id      Int      @id @default(autoincrement())
  name    String
  email   String   @unique
  address Address?
}
```

### 1.4 Queries (CRUD)
Prisma Client hỗ trợ các thao tác CRUD như sau:

- **Create**:
```ts
const newUser = await prisma.user.create({
  data: {
    name: "John",
    email: "john@example.com",
    role: "USER"
  },
});
```
- **Read**:
```ts
const users = await prisma.user.findMany();
```
- **Update**:
```ts
const updatedUser = await prisma.user.update({
  where: { id: 1 },
  data: { name: "Updated Name" },
});
```
- **Delete**:
```ts
await prisma.user.delete({ where: { id: 1 } });
```

### 1.5 Seeding dữ liệu
```ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  for (let i = 0; i < 5; i++) {
    await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: "USER",
      },
    });
  }

  for (let i = 0; i < 30; i++) {
    await prisma.post.create({
      data: {
        title: faker.lorem.sentence(),
        authorId: faker.number.int({ min: 1, max: 5 })
      },
    });
  }
}

main();
```

---

## 3. Indexes (Sort, Search,...)

### Full-Text Search (PostgreSQL)
```prisma
model Article {
  id    Int    @id @default(autoincrement())
  title String
  body  String
  
  @@fulltext([title])
  @@fulltext([body])
}
```

Truy vấn tìm kiếm:
```ts
const results = await prisma.article.findMany({
  where: {
    title: {
      search: "keyword",
    },
  },
});
```

---

## 4. Views và Mapping

### 4.1 Views trong Prisma
Views trong Prisma có thể được sử dụng để biểu diễn dữ liệu từ nhiều bảng.

Ví dụ:
```sql
CREATE VIEW active_users AS
SELECT * FROM users WHERE status = 'active';
```

### 4.2 Mapping Views vào Prisma
Prisma không hỗ trợ Views trực tiếp, nhưng có thể dùng bằng cách ánh xạ với model.

```prisma
model ActiveUser {
  id   Int    @id
  name String
  email String

  @@map("active_users")
}
```

---

## Kết luận
Bài giảng trên cung cấp tổng quan về Prisma, từ migration, model, quan hệ, index, đến views. Với Prisma, bạn có thể dễ dàng làm việc với cơ sở dữ liệu bằng TypeScript một cách trực quan và hiệu quả.

