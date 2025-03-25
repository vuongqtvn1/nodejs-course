# WebSocket trong Node.js

## 1. Định Nghĩa
WebSocket là một giao thức giao tiếp hai chiều giữa client và server, cho phép truyền dữ liệu theo thời gian thực mà không cần gửi request liên tục như HTTP.

## 2. Trường Hợp Sử Dụng
- Chat real-time
- Cập nhật dữ liệu liên tục (giá cổ phiếu, tỷ giá,...)
- Trò chơi trực tuyến
- Thông báo hệ thống


## 3. Cách Triển Khai WebSocket ở Server và Client

### Server (Node.js, Express, TypeScript, socket.io)
Cài đặt thư viện:
```sh
npm install express socket.io cors
npm install --save-dev @types/socket.io @types/express
```

Tạo file `server.ts`:
```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('message', (data) => {
        console.log('Message received:', data);
        io.emit('message', data); // Phát tin nhắn tới tất cả client
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));
```

### Client (React + socket.io-client)
Cài đặt thư viện:
```sh
npm install socket.io-client
```

Tạo file `Chat.tsx`:
```tsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });
        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (input) {
            socket.emit("message", input);
            setInput("");
        }
    };

    return (
        <div>
            <h2>Chat App</h2>
            <div>
                {messages.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
```


## 3. CORS
CORS cần thiết khi client và server chạy trên domain khác nhau, sử dụng cấu hình `cors` trong `Server` như trên.

## 4. Xác Thực WebSocket
Thêm token vào quá trình kết nối:
```typescript
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token === "your-secret-token") {
        return next();
    }
    return next(new Error("Authentication error"));
});
```

## 5. Quản lý Kết Nối và Ngắt Kết Nối theo Channel
```typescript
io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('sendMessage', ({ room, message }) => {
        io.to(room).emit('message', message);
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
    });
});
```

## 6. Gửi và Nhận Dữ Liệu
- Server sử dụng `io.to(room).emit()` để gửi tin nhắn cho từng phòng cụ thể.
- Client sử dụng `socket.emit()` để gửi dữ liệu và `socket.on()` để nhận dữ liệu theo room.



## 7. Ứng dụng chat WebSocket ở Server và Client

### Server (Node.js, Express, TypeScript, socket.io)
Cài đặt thư viện:
```sh
npm install express socket.io cors
npm install --save-dev @types/socket.io @types/express
```

Tạo file `server.ts`:
```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
    });

    socket.on('message', ({ name, room, message }) => {
        console.log(`[${room}] ${name}: ${message}`);
        io.to(room).emit('message', { name, message });
    });

    socket.on('leaveRoom', (room) => {
        socket.leave(room);
        console.log(`${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(4000, () => console.log('Server running on port 4000'));
```

### Client (React + socket.io-client)
Cài đặt thư viện:
```sh
npm install socket.io-client
```

Tạo file `Chat.tsx`:
```tsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function Chat() {
    const [messages, setMessages] = useState<{ name: string, message: string }[]>([]);
    const [input, setInput] = useState("");
    const [name, setName] = useState("");
    const [room, setRoom] = useState("");
    const [chatType, setChatType] = useState("group");

    useEffect(() => {
        socket.on("message", (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => {
            socket.off("message");
        };
    }, []);

    const joinRoom = () => {
        if (room) {
            socket.emit("joinRoom", room);
        }
    };

    const leaveRoom = () => {
        if (room) {
            socket.emit("leaveRoom", room);
            setMessages([]);
        }
    };

    const sendMessage = () => {
        if (input && name) {
            const targetRoom = chatType === "private" ? `${name}-${room}` : room;
            socket.emit("message", { name, room: targetRoom, message: input });
            setInput("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-center mb-4">Messenger Clone</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-2 border rounded-lg mb-3"
                />
                <select
                    onChange={(e) => setChatType(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-3"
                >
                    <option value="group">Group Chat</option>
                    <option value="private">Private Chat</option>
                </select>
                <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder={chatType === "group" ? "Enter group name" : "Enter recipient name"}
                    className="w-full p-2 border rounded-lg mb-3"
                />
                <div className="flex justify-between">
                    <button onClick={joinRoom} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Join</button>
                    <button onClick={leaveRoom} className="px-4 py-2 bg-red-500 text-white rounded-lg">Leave</button>
                </div>
                <div className="mt-4 h-64 overflow-y-auto bg-gray-200 p-3 rounded-lg">
                    {messages.map((msg, idx) => (
                        <p key={idx} className="p-2 bg-white rounded-lg shadow mb-2">
                            <strong>{msg.name}:</strong> {msg.message}
                        </p>
                    ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message"
                        className="flex-1 p-2 border rounded-lg"
                    />
                    <button onClick={sendMessage} className="px-4 py-2 bg-green-500 text-white rounded-lg">Send</button>
                </div>
            </div>
        </div>
    );
}
```


