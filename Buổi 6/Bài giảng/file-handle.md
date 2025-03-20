# Hướng Dẫn Xử Lý File Trong Node.js với Express.js và TypeScript

## 1. Giới thiệu
Trong bài này, chúng ta sẽ tìm hiểu cách thao tác với file trong Node.js sử dụng Express.js và TypeScript. Các thư viện quan trọng được sử dụng gồm:
- `express.static` để phục vụ file tĩnh
- `fs` để thao tác với hệ thống file
- `path` để xử lý đường dẫn file
- `multer` để upload file

---

## 2. Cài đặt môi trường
Trước tiên, tạo một dự án Node.js với TypeScript:

```sh
mkdir file-handling-node && cd file-handling-node
npm init -y
npm install express multer
npm install -D typescript @types/express @types/multer @types/node ts-node nodemon
```

Tạo file `tsconfig.json`:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "module": "CommonJS",
    "target": "ES6"
  }
}
```

Tạo thư mục `src` và file `server.ts`.

---

## 3. Sử dụng `express.static` để phục vụ file tĩnh
```ts
import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Phục vụ các file trong thư mục "public" tại đường dẫn "/static"
app.use('/static', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
```
**Giải thích:**
- `express.static` giúp Express phục vụ file tĩnh từ thư mục chỉ định.
- Khi truy cập `http://localhost:3000/static/example.txt`, nội dung của `public/example.txt` sẽ hiển thị.

---

## 4. Sử dụng `fs` để thao tác với file
### Đọc file đồng bộ:
```ts
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, 'public', 'example.txt');

try {
  const data = fs.readFileSync(filePath, 'utf8');
  console.log('Nội dung file:', data);
} catch (err) {
  console.error('Lỗi khi đọc file:', err);
}
```
**Giải thích:**
- `fs.readFileSync` đọc nội dung file đồng bộ, nếu có lỗi sẽ bắt lỗi bằng `try/catch`.

### Đọc file bất đồng bộ:
```ts
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Lỗi khi đọc file:', err);
    return;
  }
  console.log('Nội dung file:', data);
});
```
**Giải thích:**
- `fs.readFile` đọc file không chặn chương trình, nội dung file được trả về trong callback.

### Ghi file:
```ts
const newData = 'Hello, Node.js! Đây là nội dung mới của file.';
fs.writeFile(filePath, newData, 'utf8', (err) => {
  if (err) {
    console.error('Lỗi khi ghi file:', err);
    return;
  }
  console.log('File đã được ghi thành công!');
});
```
**Giải thích:**
- `fs.writeFile` ghi dữ liệu vào file bất đồng bộ.

### Xóa file:
```ts
fs.unlink(filePath, (err) => {
  if (err) {
    console.error('Lỗi khi xóa file:', err);
    return;
  }
  console.log('File đã được xóa thành công!');
});
```
**Giải thích:**
- `fs.unlink` xóa file một cách bất đồng bộ.

---

## 5. Sử dụng `path` để xử lý đường dẫn file
```ts
import path from 'path';

const filePath = '/user/local/example.txt';

console.log('Tên file:', path.basename(filePath)); // example.txt
console.log('Thư mục:', path.dirname(filePath)); // /user/local
console.log('Phần mở rộng:', path.extname(filePath)); // .txt
console.log('Đường dẫn tuyệt đối:', path.resolve('example.txt'));
```
**Giải thích:**
- `path.basename`: Lấy tên file từ đường dẫn.
- `path.dirname`: Lấy thư mục chứa file.
- `path.extname`: Lấy phần mở rộng của file.
- `path.resolve`: Chuyển đường dẫn về dạng tuyệt đối.

---

## 6. Sử dụng `multer` để upload file
### Cài đặt `multer` với thư mục lưu trữ
```ts
import multer from 'multer';
import express from 'express';

const app = express();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
```
**Giải thích:**
- `multer.diskStorage` cho phép kiểm soát nơi lưu file và cách đặt tên file.

### API upload file
```ts
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Chưa có file nào được upload');
  }
  res.send(`File uploaded: ${req.file.filename}`);
});
```
**Giải thích:**
- `upload.single('file')`: Middleware xử lý upload một file duy nhất.
- Nếu không có file, trả về lỗi 400.

### Giới hạn dung lượng file
```ts
const uploadLimited = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

### API upload với kiểm tra file
```ts
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép upload ảnh JPEG hoặc PNG!'), false);
  }
};

const uploadFiltered = multer({ storage, fileFilter });

app.post('/upload-validate', uploadFiltered.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('File không hợp lệ!');
  }
  res.send(`File hợp lệ, đã upload: ${req.file.filename}`);
});
```
**Giải thích:**
- `fileFilter`: Chỉ cho phép upload file JPEG và PNG.
- `limits.fileSize`: Giới hạn dung lượng file tối đa là 5MB.

---

