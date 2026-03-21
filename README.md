# LifeShots

一个移动端优先的个人照片记录 Web App / PWA（MVP）。

- 前端: Next.js + Tailwind CSS
- 后端: Next.js Route Handlers (API Routes)
- 数据库: PostgreSQL + Prisma
- 图片存储: 本地目录（预留 S3/R2 切换空间）
- 部署: Docker + Nginx

## 1. 项目目录结构

```txt
LifeShots/
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ auth/
│  │  │  ├─ photos/
│  │  │  └─ files/
│  │  ├─ login/
│  │  ├─ upload/
│  │  ├─ categories/
│  │  ├─ photos/
│  │  ├─ favorites/
│  │  ├─ settings/
│  │  ├─ offline/
│  │  ├─ layout.tsx
│  │  ├─ page.tsx
│  │  └─ globals.css
│  ├─ components/
│  ├─ lib/
│  └─ types/
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
│  ├─ manifest.webmanifest
│  ├─ sw.js
│  └─ icons...
├─ docs/
│  └─ schema.sql
├─ docker/
│  └─ nginx/default.conf
├─ storage/
│  ├─ uploads/
│  └─ thumbs/
├─ Dockerfile
├─ docker-compose.yml
└─ .env.example
```

## 2. 数据库 Schema 设计

详细 SQL 见 [`docs/schema.sql`](./docs/schema.sql)，Prisma 定义见 [`prisma/schema.prisma`](./prisma/schema.prisma)。

核心表:

- `users`: 账户信息
- `photos`: 照片主数据（分类、原图/缩略图、描述、拍摄时间、收藏）
- `tags`: 用户标签
- `photo_tags`: 照片与标签多对多

`photos` 包含字段:

- `id`
- `user_id`
- `category`
- `image_url`
- `thumb_url`
- `caption`
- `taken_at`
- `created_at`
- `is_favorite`

## 3. MVP 页面与 API

### 页面

- `/login` 登录/注册
- `/` 首页时间线
- `/upload` 上传页
- `/categories` 分类页
- `/categories/[category]` 分类详情
- `/photos/[id]` 照片详情（编辑描述、标签、收藏、删除）
- `/favorites` 收藏页
- `/settings` 设置页

### API

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET|PATCH /api/auth/me`
- `GET|POST /api/photos`
- `GET|PATCH|DELETE /api/photos/:id`
- `GET /api/files/:kind/:filename`

说明:

- 上传接口接收 `multipart/form-data`
- 服务器用 `sharp` 自动生成缩略图
- 图片默认通过本地磁盘存储到 `storage/uploads` 和 `storage/thumbs`

## 4. PWA 配置

已包含:

- `public/manifest.webmanifest`
- `public/sw.js`（基础离线缓存）
- iOS 主屏幕图标与 `appleWebApp` 元信息
- `src/components/pwa-register.tsx` 自动注册 Service Worker

## 5. Docker 与部署配置

- `Dockerfile`: 构建并运行 Next.js
- `docker-compose.yml`: `postgres + app + nginx`
- `docker/nginx/default.conf`: Nginx 反向代理到 Next.js

## 6. 本地开发与服务器部署步骤

### 本地开发

1. 复制环境变量

```bash
cp .env.example .env
```

2. 启动 PostgreSQL（本地已有可跳过）

3. 初始化数据库与 Prisma Client

```bash
npm run prisma:generate
npm run db:push
```

4. 创建一个测试用户

```bash
npm run db:seed
```

5. 启动开发服务

```bash
npm run dev
```

访问: `http://localhost:3000`

### 服务器部署（Docker）

1. 配置生产环境变量（尤其 `JWT_SECRET`）

2. 启动容器

```bash
docker compose up -d --build
```

3. 域名解析到服务器，Nginx 默认监听 `80`

4. 建议后续补充 HTTPS（例如 Certbot 或云厂商证书）

---

## 未来扩展建议

- 抽象存储层接口，平滑切换 S3 / Cloudflare R2
- 增加 EXIF 信息读取与自动时间线归档
- 增加多用户管理（邀请码、管理员后台）
- 增加备份与数据导出
