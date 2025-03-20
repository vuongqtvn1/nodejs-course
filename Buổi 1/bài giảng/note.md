# **Buổi 1: Giới thiệu về Backend & Node.js và Ôn tập lại JS**

## **1. Giới thiệu về Backend**

### **Backend là gì? So sánh Backend & Frontend**

- **Frontend**: Phần giao diện người dùng, chạy trên trình duyệt (HTML, CSS, JavaScript,...).
- **Backend**: Phần xử lý logic, tương tác với cơ sở dữ liệu, xử lý API (Node.js, Express, PostgreSQL,...).
- **So sánh Backend & Frontend:**
  - Frontend tập trung vào giao diện và trải nghiệm người dùng.
  - Backend quản lý dữ liệu, logic và xử lý yêu cầu từ client.

## **2. Giới thiệu về Node.js**

### **Node.js là gì?**

- Môi trường runtime cho JavaScript trên server.
- Dựa trên V8 Engine của Chrome.
- Hỗ trợ I/O phi đồng bộ.
- Dùng nhiều trong các ứng dụng web real-time, API services.

### **Cách hoạt động**

- Xử lý event-driven, non-blocking I/O.
- Phù hợp cho các ứng dụng real-time, chat app, streaming.

## **3. Cài đặt Node.js và các công cụ cần thiết**

### **Cài đặt Node.js**

- Cài nvm (node package manager)

- MacOS/ Linux

  ```bash
  https://github.com/nvm-sh/nvm
  ```

- Window

  ```bash
  https://github.com/coreybutler/nvm-windows
  ```

- Shell Command

  ```bash
  nvm list : lấy danh sách các phiên bản nodejs trong máy mình đã cài
  nvm install phiên bản node : download phiên bản nodejs đó về máy mình
  nvm use phiên bản node : chỉ định phiên bản máy mình sử dụng Ư
  ```

- Tải tại: [https://nodejs.org/](https://nodejs.org/)
- Kiểm tra phiên bản:
  ```bash
  node -v
  ```
- Cài npm package globally:
  ```bash
  npm install -g nodemon
  ```

### **Cài đặt VS Code & Postman**

- VS Code: Code editor hỗ trợ JavaScript, TypeScript.
- Postman: Test API nhanh chóng.

## **4. Ôn tập JavaScript & TypeScript**

### **4.1. JavaScript cơ bản**

- **Biến và kiểu dữ liệu**:
  ```javascript
  let name = "Alice";
  const age = 25;
  let isStudent = false;
  ```
- **Toán tử và điều kiện**:
  ```javascript
  let a = 10,
    b = 5;
  console.log(a + b, a - b, a * b, a / b);
  console.log(a > b ? "a lớn hơn b" : "b lớn hơn a");
  ```
- **Hàm**:
  ```javascript
  function greet(name) {
    return `Xin chào, ${name}!`;
  }
  console.log(greet("Alice"));
  ```
- **Arrow function**:
  ```javascript
  const square = (x) => x * x;
  console.log(square(4));
  ```
- **Destructuring**:
  ```javascript
  const person = { name: "Alice", age: 25 };
  const { name, age } = person;
  console.log(name, age);
  ```
- **Promise & Async/Await**:
  ```javascript
  function fetchData() {
    return new Promise((resolve) =>
      setTimeout(() => resolve("Dữ liệu tải xong!"), 2000)
    );
  }
  async function getData() {
    let data = await fetchData();
    console.log(data);
  }
  getData();
  ```

### **4.2. TypeScript cơ bản**

- **Khai báo biến với kiểu dữ liệu**:
  ```typescript
  let message: string = "Hello TypeScript";
  let count: number = 42;
  let isDone: boolean = false;
  ```
- **Interface và Object**:
  ```typescript
  interface User {
    name: string;
    age: number;
  }
  let user: User = { name: "Alice", age: 25 };
  ```
- **Hàm trong TypeScript**:
  ```typescript
  function add(a: number, b: number): number {
    return a + b;
  }
  console.log(add(5, 3));
  ```
- **Class và OOP**:
  ```typescript
  class Person {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    greet() {
      return `Xin chào, tôi là ${this.name}`;
    }
  }
  let alice = new Person("Alice");
  console.log(alice.greet());
  ```
- **Generics**:
  ```typescript
  function identity<T>(arg: T): T {
    return arg;
  }
  console.log(identity<string>("Hello"));
  console.log(identity<number>(123));
  ```

## **5. Chạy chương trình "Hello World" trong Node.js**

### **Viết file `app.js`**

```javascript
console.log("Hello Backend");
```

- Chạy file:

```bash
node app.js
```

## **6. Giới thiệu Module trong Node.js**

### **Built-in module**

- fs, path, http, os, events, crypto, stream...
- Ví dụ:
  ```javascript
  const fs = require("fs");
  fs.writeFileSync("test.txt", "Hello, this is a test!");
  console.log("File created successfully");
  ```

### **Third-party module**

- npm (Node Package Manager)
- Cài module:
  ```bash
  npm install lodash
  ```
- Import module:
  ```javascript
  const _ = require("lodash");
  console.log(_.camelCase("hello world"));
  ```

## **7. CommonJS vs ES Module**

### **CommonJS**

- Dùng `require()`
- Xuất module: `module.exports`

```javascript
const fs = require("fs");
module.exports = { hello: "world" };
```

### **ES Module**

- Dùng `import/export`
- Cần bật `"type": "module"` trong `package.json`

```javascript
import fs from "fs";
export const hello = "world";
```

## **8. Bài tập & Ví dụ**

### **Bài tập 1: Ôn lại JS & TypeScript**

- Viết arrow function
  ```javascript
  const add = (a, b) => a + b;
  console.log(add(2, 3));
  ```
- Dùng destructuring:
  ```javascript
  const { name, age } = { name: "Alice", age: 25 };
  console.log(name, age);
  ```

### **Bài tập 2: Viết một script Node.js**

```javascript
console.log("Hello Backend");
```

### **Bài tập 3: Tạo và import module**

- Tạo file `math.js`

```javascript
export function add(a, b) {
  return a + b;
}
```

- Import và sử dụng

```javascript
import { add } from "./math.js";
console.log(add(2, 3));
```

---
