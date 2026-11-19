# Quy trình làm việc

## Nhánh và commit

- `main` luôn chạy được và tự deploy lên staging. Không push thẳng vào `main`.
- Mỗi việc một nhánh ngắn: `feat/tao-nhom`, `fix/cuon-tin-nhan`, `chore/...`.
- Commit theo Conventional Commits: `feat(api): thêm API tạo nhóm`, `fix(app): sửa lỗi cuộn tin nhắn`.

## Pull request

- Nhỏ và tập trung, nên dưới khoảng 400 dòng thay đổi. Lớn hơn thì tách.
- CI xanh và có ít nhất 1 người duyệt mới được merge. Dùng "Squash and merge".
- Đổi `packages/contracts` là đổi thỏa thuận giữa app và api: báo lead, cập nhật cả hai bên trong cùng PR.
- Tính năng chưa xong thì ẩn sau cờ (feature flag), không giữ nhánh sống nhiều ngày.

## Test

- Unit test đặt cạnh file: `*.spec.ts` trong api, `*.test.ts(x)` trong app và packages.
- E2E của api nằm ở `apps/api/test/*.e2e-spec.ts`, chạy bằng `pnpm test:e2e`. CI có sẵn Postgres và Redis.
- Sửa lỗi thì viết test tái hiện lỗi trước.

## Thêm thư viện

- App: `cd apps/app && npx expo install <gói>` để lấy đúng phiên bản hợp với Expo SDK.
- Phần khác: `pnpm --filter <api|@repo/contracts|@repo/chat-core> add <gói>`.
- pnpm chặn các bản phát hành chưa đủ 1 ngày và chặn script cài đặt chưa được duyệt. Gặp `ERR_PNPM_IGNORED_BUILDS` thì hỏi lead trước khi thêm gói vào `allowBuilds` trong `pnpm-workspace.yaml`.

## Phát hành

- Merge vào `main`: tự lên staging.
- Lên production và build app mobile: gắn tag phiên bản.

  ```bash
  git tag v0.1.0 && git push origin v0.1.0
  ```

- Build app cho tester: Actions → Mobile build → Run workflow → profile `preview`.
