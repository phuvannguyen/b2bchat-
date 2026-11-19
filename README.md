# B2B Chat

Ứng dụng chat cho doanh nghiệp: iOS, Android và web từ một codebase.

| Thư mục              | Nội dung                                                    |
| -------------------- | ----------------------------------------------------------- |
| `apps/app`           | App Expo (React Native + Expo Router) cho iOS, Android, web |
| `apps/api`           | API NestJS (REST + realtime)                                |
| `packages/contracts` | Schema Zod dùng chung: kiểu dữ liệu, API, sự kiện realtime  |
| `packages/chat-core` | Logic chat không phụ thuộc giao diện                        |
| `deploy/`            | Docker Compose, Caddy và script deploy lên server           |
| `.github/`           | CI, deploy, build mobile, mẫu PR, CODEOWNERS                |

## Chạy trên máy

Cần Node 24 (xem `.node-version`), pnpm 12 và Docker.

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/app/.env.example apps/app/.env
pnpm services:up   # Postgres + Redis
pnpm dev           # API ở http://localhost:3000/api, Expo ở http://localhost:8081
```

## Kiểm tra trước khi tạo PR

```bash
pnpm check               # lint + typecheck + test + build cho toàn repo
pnpm --filter api test   # chỉ chạy cho một phần
```

## Tài liệu

- [CONTRIBUTING.md](CONTRIBUTING.md): quy trình làm việc của đội
- [docs/SETUP.md](docs/SETUP.md): cài đặt GitHub, server, Expo (làm một lần)
- [CLAUDE.md](CLAUDE.md): quy ước cho Claude và cho người mới vào dự án
