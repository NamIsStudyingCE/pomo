# HANDOFF: Pomo

> Đọc file này ĐẦU TIÊN nếu bạn là agent/người mới. Đủ để tiếp tục mà không cần hỏi lại.
> Trạng thái: **CODE HOÀN CHỈNH, ĐÃ VERIFY TĨNH. Chờ deploy (cần Supabase + Vercel account).**

## 1. Trạng thái hiện tại (2026-10-04)

| Hạng mục | Trạng thái | Bằng chứng |
|---|---|---|
| SPEC.md | Đóng băng, user đã duyệt | — |
| Toàn bộ code F1-F9 | Hoàn chỉnh | `src/` |
| Unit tests | 31/31 PASS | `npm run test` |
| TypeScript strict | Sạch | `npx tsc --noEmit` |
| ESLint (+ import boundaries) | Sạch | `npm run lint` |
| Production build | PASS, 8 routes | `npm run build` |
| Contrast WCAG AA | PASS (bằng chứng mục 6.2) | contrast-check.py |
| Dev-server smoke | 4 routes render OK | `npm run dev` + curl |
| Click-through với DB thật | ⏳ Chưa chạy được: cần Supabase credentials | checklist mục 6.3 |
| Deploy public | ⏳ Chờ account | mục 4 + 5 |

## 2. Bản đồ repo

```
D:\pomo\
  SPEC.md              # yêu cầu (ĐÓNG BĂNG)
  ARCHITECTURE.md      # quyết định kỹ thuật + schema SQL + contracts
  DESIGN.md            # design direction (antislop R-37)
  PROGRESS.md          # trạng thái slices
  HANDOFF.md           # file này
  docs/project.md      # context SDD
  supabase/migrations/0001_init.sql   # CHẠY FILE NÀY TRONG SUPABASE SQL EDITOR
  src/
    app/               # routes: /login /auth/callback /(app)/today|focus|review|settings
    modules/           # auth tasks focus goal stats review suggest settings i18n
    design-system/     # Button Dialog Input data-display Switch SegmentedControl
    lib/               # env, supabase-browser, time (pure), utils
  tests/               # streak, scoring, insights, time-math
```

Ranh giới: `app → modules → (design-system, lib)`. Không import ngược. ESLint enforce cho lib/design-system.

## 3. Chạy local

```powershell
cd D:\pomo
npm install          # lần đầu
copy .env.example .env.local   # rồi điền 2 biến từ Supabase (mục 4)
npm run dev          # http://localhost:3000
npm run test         # 31 unit tests
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # production build
```

Ghi chú: npm 12 có thể cảnh báo "install scripts blocked" (esbuild, unrs-resolver) — vô hại, binary đi qua optionalDependencies.

## 4. Setup Supabase (chi tiết từng bước, ~10 phút)

### 4.1 Tạo project
1. Vào https://supabase.com → **Start your project** → đăng nhập (GitHub/email).
2. Dashboard → **New project** → chọn organization (mặc định có sẵn một cái tên bạn).
3. Điền: **Name** = `pomo` · **Database Password** = bấm **Generate** rồi LƯU lại đâu đó · **Region** = `Singapore`.
4. Bấm **Create new project** → chờ 1-2 phút provision.

### 4.2 Chạy migration (tạo 3 bảng + RLS)
1. Sidebar trái → **SQL Editor** → **New query**.
2. Mở `D:\pomo\supabase\migrations\0001_init.sql`, copy TOÀN BỘ, dán vào editor → **Run** (Ctrl+Enter).
3. Kỳ vọng: "Success. No rows returned". Kiểm tra: sidebar → **Table Editor** phải thấy 3 bảng `profiles`, `tasks`, `focus_sessions`.

### 4.3 Lấy keys
1. Sidebar trái dưới cùng → biểu tượng bánh răng **Settings** → **API** (hoặc **Data API**).
2. Copy **Project URL** (dạng `https://abcdefgh.supabase.co`).
3. Copy **anon public** key (nếu dashboard hiển thị định dạng mới `sb_publishable_...` thì dùng key đó, supabase-js v2 hỗ trợ cả hai).

### 4.4 Điền `.env.local`
```powershell
cd D:\pomo
copy .env.example .env.local
notepad .env.local
```
Điền 2 giá trị vừa copy. Không dấu ngoặc kép, không khoảng trắng thừa.

### 4.5 Cấu hình Auth URLs
1. Sidebar → **Authentication** → **URL Configuration**.
2. **Site URL**: `http://localhost:3000` (sau deploy đổi thành domain Vercel).
3. **Redirect URLs** → Add: `http://localhost:3000/auth/callback` và `https://<domain-vercel-của-bạn>.vercel.app/auth/callback`.
4. Email provider (magic link) mặc định ĐÃ bật, không cần chỉnh gì thêm.
5. Giới hạn đã biết: SMTP mặc định chỉ gửi vài email/giờ. Bị chặn khi test nhiều → Authentication → SMTP gắn SMTP riêng (Resend, SES...).

### 4.6 Test local
```powershell
cd D:\pomo
npm run dev
```
Mở http://localhost:3000 → nhập email → mở hộp thư → click link → phải vào được trang "Hôm nay". Nếu link báo lỗi redirect: kiểm tra lại mục 4.5.

## 5. Deploy Vercel (chi tiết, ~10 phút)

### 5.1 Đẩy code lên GitHub
Cách A (gh CLI): `cd D:\pomo; git init; git add -A; git commit -m "pomo: initial"; gh repo create pomo --private --push --source .`
Cách B (web): github.com → **New repository** → tên `pomo`, Private, KHÔNG tick "Add README" → Create. Sau đó:
```powershell
cd D:\pomo
git init; git add -A; git commit -m "pomo: initial"
git branch -M main
git remote add origin https://github.com/<username>/pomo.git
git push -u origin main
```

### 5.2 Deploy
1. https://vercel.com → **Continue with GitHub**.
2. **Add New...** → **Project** → **Import** repo `pomo` (Framework tự nhận Next.js, không cần chỉnh build settings).
3. Mục **Environment Variables** → thêm 2 biến (value lấy từ `.env.local`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy** → chờ ~1-2 phút → nhận domain `https://pomo-<hash>.vercel.app`.
5. QUAN TRỌNG: quay lại Supabase mục 4.5 → **Site URL** đổi thành domain Vercel → Save. (Không đổi thì magic link quay về localhost.)
6. Mở domain trên PC → đăng nhập → chạy checklist 6.3.
7. Vận hành: push lên `main` = auto-deploy. Rollback: Vercel → Deployments → ... → Redeploy bản cũ.

## 6. Verification

### 6.1 Đã verify (bằng chứng)

- Build/test/lint/typecheck xanh (mục 1).
- Contrast (contrast-check.py, WCAG AA): ink/paper 15.17 · muted/paper 5.32 · trắng/accent 4.75 · accent-strong(A63B10)/paper 6.03 · accent-strong/soft 5.19 · dark: ink 15.16 · muted 6.56 · accent-strong(F0763F)/paper 6.20 · accent(C74A16) ranh giới trên dark 3.72 (≥3 cho non-text).
- Grep sạch: không em dash, không Inter, không Lucide, không gradient tím, không console.log.
- Dev server render: /login /today /review /settings (chưa có env → MissingConfig hiện sau hydration, đúng thiết kế).

### 6.2 Delivery Gate (antislop, DURING mode)

- **Block 1 Hard Gate**: R-02 PASS (grep) · R-17/18/36/38 PASS (app không có số liệu/testimonial giả; mọi số từ DB) · R-23 PASS (không asset tự bịa; wordmark text) · R-24 PASS (nav → routes thật) · R-25 PASS (bằng chứng 6.1) · R-26 PASS-by-code (mọi nút có hành vi; click-through ở 6.3) · R-27 PASS (empty/loading/error ở mọi data view) · R-32 PASS-by-code (focus-visible, native dialog Esc, dnd-kit keyboard, role=switch) · R-33 PASS · R-34 PARTIAL (tokens đo đạc; rendered dark-mode nằm trong 6.3) · R-35 PARTIAL (smoke render xong; click-through đầy đủ cần credentials) · R-03 PARTIAL (mobile-first đã build; verify trên device thật ở 6.3).
- **Block 2 Purpose-Gate**: PASS. Accent = cà chua Pomodoro (DESIGN.md), icons Phosphor liên quan nội dung, font vì tiếng Việt, motion tối thiểu phục vụ timer.
- **Block 3 Liveliness**: PASS. Dials ENERGY 1 / RHYTHM 2 / MOTION 1; focal point = ring timer / CTA chính; 1 accent; motif ring nhất quán.
- **Block 4 Craftsmanship**: C-1 mọi quyết định có lý do (DESIGN.md) · C-2 không nút chết · C-3 không section thừa · C-4 đủ states + keyboard · C-5 không claim giả.

### 6.3 Checklist click-through còn lại (cần `.env.local` thật, ~15 phút)

Làm tuần tự trên `npm run dev`, ghi kết quả từng dòng (R-35):

1. Login: nhập email → nhận magic link → click → vào /today.
2. Tạo 3 task (1 High có deadline hôm nay) → reload → còn nguyên.
3. Kéo thả đổi thứ tự → reload → giữ thứ tự. Lặp bằng bàn phím (focus handle, Space, mũi tên, Space).
4. Sửa task, đổi priority/deadline → lưu → UI cập nhật.
5. Xóa task → dialog xác nhận → mất khỏi list.
6. Nút "Gợi ý việc ưu tiên hôm nay" → hiện ≤3 task kèm lý do → nút Focus trên gợi ý → vào /focus.
7. /focus: đồng hồ chạy, title tab đếm ngược. Refresh trang → đồng hồ đúng chỗ (sai số <2s).
8. Rời tab 30s → quay lại → cảnh báo nêu đúng ~00:30 → "Tiếp tục tập trung".
9. Dừng sớm → dialog ghi nhận phút thực tế → goal + stats hôm nay tăng tương ứng.
10. Tạo session ngắn 5 phút (hoặc chỉnh 5) → đợi hết → âm thanh + dialog → "Đánh dấu việc đã xong" → task xuống nhóm Đã xong.
11. /review: chart có cột hôm nay; tuần trước/sau điều hướng được; insight hiện (hoặc "chưa đủ dữ liệu" nếu <3 session).
12. /settings: đổi goal → progress bar /today đổi; đổi ngôn ngữ → toàn bộ UI đổi ngay; đổi theme → cả 2 mode không vỡ layout; reload → giữ lựa chọn.
13. Mobile (DevTools 360px): bottom nav dùng được, không overflow ngang, nút ≥44px.
14. Console: 0 error. Network: không request đỏ.

## 7. Nếu tiếp tục phát triển

- Đọc ARCHITECTURE.md trước. Mọi dependency mới phải ghi lý do vào mục 2 của nó.
- SPEC đóng băng: thay đổi yêu cầu → sdd-refine (viết diff summary, user duyệt, cập nhật Revision History).
- Ý tưởng backlog KHÔNG thuộc SPEC hiện tại (chỉ làm khi user yêu cầu): PWA manifest, custom SMTP, reindex position định kỳ, xuất CSV.
- Verify nâng cao: dùng skill `ui-verification` (Playwright probes) khi app đã chạy với DB thật.

## 8. Quyết định quan trọng (tóm tắt, chi tiết ở ARCHITECTURE/PROGRESS)

Auth PKCE client-side · timer từ timestamps · honest focus (rời tab = trừ giờ) · recovery quá hạn → stopped_early · streak theo ended_at local · tuần Thứ 2 · sessions bất biến (không xóa) · fractional position · gợi ý 2 lớp w=completed/20 · accent #C74A16 + hover brightness-90.
