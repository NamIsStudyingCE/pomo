# PROGRESS: Pomo

> Cập nhật sau MỖI vertical slice. Agent tiếp theo đọc file này + HANDOFF.md trước khi làm gì khác.
> Cập nhật lần cuối: 2026-10-04 (tất cả slices hoàn thành, chờ deploy)

## Trạng thái tổng

| Slice | Nội dung | Trạng thái |
|---|---|---|
| Docs | SPEC (đóng băng), ARCHITECTURE, DESIGN, docs/project.md | ✅ Xong |
| S0 | Scaffold + migration + auth magic link + shell + i18n | ✅ Xong (build pass) |
| S1 | Tasks CRUD + kéo thả bằng chuột + bàn phím (F1, F4) | ✅ Xong |
| S2 | Focus engine + honest timing + cảnh báo rời tab (F2, F5) | ✅ Xong |
| S3 | Daily goal + stats hôm nay + streak (F3, F6) | ✅ Xong |
| S4 | Weekly review + chart + insights (F7) | ✅ Xong |
| S5 | Gợi ý task 2 lớp (F8) | ✅ Xong |
| S6 | 31 unit tests xanh + build xanh + lint sạch + contrast PASS | ✅ Xong |
| Deploy | Supabase project + Vercel public URL | ⏳ Chờ credentials (hướng dẫn: HANDOFF.md mục 4-5) |

## Đã hoàn thành (chi tiết)

- **S0**: Next.js 15 + TS strict + Tailwind v4 (tokens theo DESIGN.md), Be Vietnam Pro, theme light/dark chống FOUC, i18n VI/EN type-safe, magic link PKCE client-side + AuthGuard, shell sidebar desktop + bottom nav mobile, màn hình MissingConfig khi thiếu env.
- **S1**: tasks CRUD đầy đủ (composer 1 chạm, edit dialog, xóa có xác nhận), fractional position + normalizePositions, dnd-kit với KeyboardSensor (reorder bằng bàn phím), nhóm "Đã xong" thu gọn.
- **S2**: session-store (zustand), ghi row `in_progress` ngay khi start, tick từ timestamps (không đếm interval), Page Visibility API trừ thời gian rời tab + cảnh báo khi quay lại, document.title đếm ngược, recovery sau refresh (quá hạn → stopped_early, KHÔNG auto-completed), âm thanh WebAudio (toggle trong settings), 2 dialog global (rời tab / hoàn thành).
- **S3**: GoalProgress cập nhật tức thì qua invalidate ['sessions'], StatsRow 3 ô (phút/phiên/streak), streak pure function có test (kể cả AC-F6-3: ngày mới chưa focus vẫn giữ chuỗi).
- **S4**: ReviewView với điều hướng tuần, Recharts bar chart (hôm nay tô đậm), insights: daypart tốt nhất + trend/best-day, ngưỡng <3 session → "chưa đủ dữ liệu" (không bịa).
- **S5**: scoring.ts 2 lớp (luật tĩnh + hành vi 28 ngày, w = completed/20), REASON_DISPLAY_ORDER ưu tiên lý do khẩn rồi thói quen, SuggestDialog với nút Focus từng gợi ý.
- **S6**: `npm run test` 31/31 xanh; `npm run build` pass; `npm run lint` sạch; `npx tsc --noEmit` sạch; contrast kiểm bằng contrast-check.py (evidence ở HANDOFF mục 6); dev-server smoke test 4 routes render OK.
- **Desktop Assets**: Icon nhận diện rút gọn Terracotta Pomodoro (P. mark) hoàn tất: `src/app/icon.svg`, `src/app/apple-icon.svg`, `src/app/manifest.ts`, static `public/pomo.ico` (multi-size 16-256px cho Windows Shortcut) và `public/pomo.png` (512px). Build pass 12 static routes.
- **UI Refinements**: Dialog hỗ trợ nút đóng 'X' và description; TaskPickerDialog bổ sung radio circle màu cam nâu đậm (chỉ lấp đầy khi chọn), hover sáng viền, làm mờ task chưa chọn, và hiển thị dòng trạng thái "Đã chọn X mục" song ngữ VI/EN.

## Đang làm dở

- Không có.

## Còn lại

1. Tạo Supabase project + chạy `supabase/migrations/0001_init.sql` + lấy 2 keys (HANDOFF mục 4).
2. Điền `.env.local`, verify thủ công bằng click-through (checklist HANDOFF mục 6).
3. Deploy Vercel + cấu hình Auth URLs (HANDOFF mục 5). App sẽ có link public chạy trên PC.

## Quyết định quan trọng đã chốt (đừng hỏi lại)

1. Auth = magic link PKCE thuần client, AuthGuard phía client, KHÔNG middleware cookie.
2. Timer từ timestamps; row `in_progress` ghi ngay khi start; recovery quá hạn → `stopped_early`.
3. Streak theo ngày local của `ended_at`; tuần bắt đầu Thứ 2.
4. Không delete policy cho focus_sessions (lịch sử bất biến); xóa task giữ `task_title` snapshot.
5. Accent fill = #C74A16 cả 2 theme; chữ accent = accent-strong (#A63B10 light / #F0763F dark); hover nút = brightness-90 (bằng chứng contrast: HANDOFF mục 6).
6. Open questions SPEC dùng mặc định đã duyệt: toggle âm thanh bật; màn chính = Hôm nay; không giới hạn cứng số task; tz = trình duyệt.
7. Lý do gợi ý hiển thị theo REASON_DISPLAY_ORDER: overdue > due_today > daypart > momentum > due_soon > completion > priority_high > stale > default.

## Hướng dẫn cho agent tiếp theo

1. Đọc: HANDOFF.md trước, rồi SPEC.md (AC), ARCHITECTURE.md, DESIGN.md.
2. Lệnh: `npm install`, `npm run dev`, `npm run test`, `npm run lint`, `npm run typecheck`, `npm run build`.
3. Không sửa SPEC.md. Thay đổi yêu cầu → dùng quy trình sdd-refine + cập nhật ARCHITECTURE/DESIGN tương ứng.
4. Nếu context sắp đầy: cập nhật HANDOFF.md TRƯỚC mọi việc khác.
