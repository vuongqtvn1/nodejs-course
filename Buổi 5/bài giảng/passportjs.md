# Xác thực và phân quyền với JWT / PassportJS

### 1. Giới thiệu về PassportJS

#### **PassportJS là gì?**

PassportJS là một middleware xác thực trong Node.js hỗ trợ nhiều phương thức xác thực khác nhau như Local, Google, GitHub, Discord,...

### 2. Cấu hình PassportJS

#### **Hướng dẫn lấy CLIENT_ID và CLIENT_SECRET**

- **Google**:
  1. Truy cập [Google Developer Console](https://console.cloud.google.com/)
  2. Tạo một dự án mới.
  3. Chọn "OAuth consent screen" → Điền thông tin ứng dụng.
  4. Chọn "Credentials" → "Create Credentials" → "OAuth Client ID".
  5. Chọn "Application Type" là Web Application.
  6. Nhập Redirect URI: `http://localhost:3000/auth/google/callback`.
  7. Lưu lại `CLIENT_ID` và `CLIENT_SECRET`.

- **Discord**:
  1. Truy cập [Discord Developer Portal](https://discord.com/developers/applications).
  2. Tạo ứng dụng mới.
  3. Chọn "OAuth2" → "Add Redirect" → `http://localhost:3000/auth/discord/callback`.
  4. Lưu lại `CLIENT_ID` và `CLIENT_SECRET`.

- **GitHub**:
  1. Truy cập [GitHub Developer Settings](https://github.com/settings/developers).
  2. Tạo OAuth App mới.
  3. Nhập "Homepage URL" và "Authorization Callback URL" (`http://localhost:3000/auth/github/callback`).
  4. Lưu lại `CLIENT_ID` và `CLIENT_SECRET`.

#### **passport-config.ts**

```typescript
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Strategy as GitHubStrategy } from 'passport-github';
import express, { NextFunction, Request, Response } from "express";

const app = express();

app.use(passport.initialize());

type User = { id: string, name: string };
const users: User[] = [];

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    users.push({ id: profile.id, name: profile.displayName });
    return done(null, profile);
}));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    callbackURL: '/auth/discord/callback'
}, (accessToken, refreshToken, profile, done) => {
    users.push({ id: profile.id, name: profile.username });
    return done(null, profile);
}));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: '/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
    users.push({ id: profile.id, name: profile.username });
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj: any, done) => {
    done(null, obj);
});
```

> **Giải thích:**
>
> - `passport.serializeUser`: Lưu thông tin user vào session để duy trì trạng thái đăng nhập.
> - `passport.deserializeUser`: Lấy thông tin user từ session để sử dụng trong các request tiếp theo.

### 3. Route xác thực với PassportJS

```typescript
import express from 'express';
import passport from 'passport';

const app = express();

app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/protected');
});

app.get('/auth/discord', passport.authenticate('discord'));
app.get('/auth/discord/callback', passport.authenticate('discord', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/protected');
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/protected');
});

app.listen(3000, () => console.log('Server chạy trên cổng 3000'));
```

