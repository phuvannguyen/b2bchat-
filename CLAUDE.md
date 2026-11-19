# Hướng dẫn cho Claude

Monorepo pnpm + Turborepo. Đọc file này, rồi chỉ đọc phần liên quan đến việc đang làm.

## Cấu trúc

- `apps/api`: NestJS 12, ESM, Vitest, oxlint. Quy ước riêng ở `apps/api/AGENTS.md`, tự nạp khi làm trong thư mục đó.
- `apps/app`: Expo SDK 58 + Expo Router, chạy iOS/Android/web. Quy ước riêng ở `apps/app/AGENTS.md`.
- `packages/contracts`: schema Zod dùng chung, là nguồn sự thật cho API và sự kiện realtime.
- `packages/chat-core`: logic chat thuần TypeScript, không import React hay React Native.

## Lệnh

- `pnpm check`: lint + typecheck + test + build toàn repo. Chạy trước khi kết thúc mọi việc.
- `pnpm --filter <api|app|@repo/contracts|@repo/chat-core> <lệnh>`: chạy cho một phần.
- `pnpm format`: định dạng code. CI kiểm tra bằng `pnpm format:check`.

## Quy tắc

- Chỉ sửa trong module của việc đang làm. Cần đổi `packages/contracts` thì nêu lý do trong PR và cập nhật cả api lẫn app.
- Mỗi thay đổi có test đi kèm.
- Backend: mỗi tính năng là một module NestJS trong `apps/api/src/<tinh-nang>/`, đăng ký ở `app.module.ts`. Validate input bằng schema từ `@repo/contracts`.
- App: màn hình nằm trong `apps/app/src/app/`, còn component, hook, lib để ngoài thư mục đó. Thêm thư viện bằng `npx expo install`. Không tạo `ios/`, `android/` bằng tay.
- Không commit bí mật. Biến môi trường mới thì thêm vào file `.env.example` tương ứng.
