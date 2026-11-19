# Cài đặt lần đầu

Các bước này làm một lần, theo thứ tự.

## 1. GitHub

1. Tổ chức GitHub nên dùng gói **Team**. Repo private trên gói Free không bật được bảo vệ nhánh, environments và secrets theo môi trường.
2. Tạo repo trống rồi đẩy code lên:

   ```bash
   git remote add origin git@github.com:<org>/<repo>.git
   git push -u origin main
   ```

3. Settings → General → Pull Requests: chỉ để "Allow squash merging", bật "Automatically delete head branches".
4. Settings → Rules → Rulesets → New branch ruleset, áp cho nhánh mặc định (`main`):
   - Require a pull request before merging: 1 approval, bật dismiss stale approvals.
   - Require status checks to pass: thêm check `ci` (có sau lần CI chạy đầu tiên).
   - Block force pushes, Restrict deletions.
5. Thêm một ruleset cho tag `v*` để chỉ lead được tạo tag, vì gắn tag là lệnh deploy production.
6. Tạo các team `leads`, `backend`, `mobile` rồi điền vào `.github/CODEOWNERS`.

## 2. Server

Mỗi môi trường (staging, production) một server Linux có Docker. Trên server:

```bash
curl -fsSL https://get.docker.com | sh
sudo adduser --disabled-password --gecos "" deploy
sudo usermod -aG docker deploy
sudo -u deploy mkdir -p /home/deploy/b2b-chat /home/deploy/.ssh
# Tạo /home/deploy/b2b-chat/.env theo mẫu deploy/.env.example
```

- Mở cổng 80 và 443. Trỏ bản ghi DNS A của tên miền (ví dụ `staging.example.com`) về IP server. Caddy tự lấy chứng chỉ HTTPS.
- Trên máy của bạn, tạo khóa SSH riêng cho deploy: `ssh-keygen -t ed25519 -f deploy_key -N ""`. Chép nội dung `deploy_key.pub` vào `/home/deploy/.ssh/authorized_keys` trên server.
- Lấy dấu nhận diện của server: `ssh-keyscan <ip-server>`.

## 3. Environments và secrets trên GitHub

Settings → Environments, tạo `staging` và `production`:

| Mục                          | staging                    | production                |
| ---------------------------- | -------------------------- | ------------------------- |
| Deployment branches and tags | nhánh `main`               | tag `v*`                  |
| Secret `SSH_HOST`            | IP hoặc hostname server    | IP hoặc hostname server   |
| Secret `SSH_USER`            | `deploy`                   | `deploy`                  |
| Secret `SSH_PRIVATE_KEY`     | nội dung file `deploy_key` | khóa riêng cho production |
| Secret `SSH_KNOWN_HOSTS`     | kết quả `ssh-keyscan`      | kết quả `ssh-keyscan`     |
| Variable `DOMAIN`            | `staging.example.com`      | `app.example.com`         |

Trên gói Team, environment của repo private không có "Required reviewers" (chỉ gói Enterprise có). Vì vậy production chỉ deploy khi có người gắn tag `v*`, và ruleset ở bước 1.5 giới hạn ai được gắn.

## 4. Expo / EAS (build app mobile)

1. Tạo tài khoản tổ chức trên expo.dev.
2. Trên máy: `cd apps/app && npx eas-cli@latest login && npx eas-cli@latest init`. Lệnh này ghi `projectId` vào `app.json`; commit thay đổi đó.
3. Sửa `ios.bundleIdentifier` và `android.package` trong `app.json` (ví dụ `vn.tencongty.chat`). Hai giá trị này không đổi được sau khi app lên store.
4. Tạo access token trên expo.dev, lưu thành repo secret `EXPO_TOKEN`.
5. Sửa `EXPO_PUBLIC_API_URL` trong `apps/app/eas.json` thành tên miền thật.
6. Khi tài khoản Apple Developer và Google Play đã được duyệt: `npx eas-cli@latest credentials` để EAS quản lý chứng chỉ ký app.

## 5. Chạy thử

- Merge một PR vào `main` → tab Actions → Deploy sẽ build image và deploy staging. Mở `https://<DOMAIN>/api/health` để kiểm tra.
- Actions → Mobile build → Run workflow (profile `preview`). Link cài app hiện trên expo.dev khi build xong.
