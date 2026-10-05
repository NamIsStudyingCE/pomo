# ARCHITECTURE: Pomo

> Nguồn sự thật kỹ thuật của project. Đọc file này trước khi sửa bất kỳ module nào.
> SPEC.md là yêu cầu (đóng băng); file này là cách hiện thực. Nếu hai file mâu thuẫn, SPEC thắng và file này phải được cập nhật.
> Cập nhật lần cuối: 2026-10-04 (v1, sau khi SPEC được duyệt)

---

## 1. Sơ đồ tổng thể

```
Trình duyệt (PC / mobile)
  └─ Next.js App Router (Vercel)
       ├─ app/                 routing only, không business logic
       ├─ modules/             feature modules (auth, tasks, focus, goal, stats, review, suggest, settings, i18n)
       ├─ design-system/       UI primitives thuần (không biết business)
       └─ lib/                 pure functions + supabase client
            │
            ▼ HTTPS (anon key + RLS)
       Supabase Cloud
       ├─ Postgres: profiles, tasks, focus_sessions
       └─ Auth: magic link (PKCE)
```

Nguyên tắc nền:

- **Không backend riêng** (SPEC D1). Client gọi Supabase trực tiếp, RLS làm lớp bảo mật duy nhất.
- **Một nguồn sự thật**: mọi thống kê tính on-demand từ `focus_sessions` + `tasks` (SPEC D10).
- **Ranh giới import một chiều**: `app → modules → (design-system, lib)`. `lib` và `design-system` KHÔNG được import từ `modules`. Modules không import lẫn nhau trừ qua điểm chạm được liệt kê ở mục 4.
- **Check bắt buộc**: ranh giới import được enforce bằng ESLint `no-restricted-imports` (xem mục 10). Mọi contract trong file này đều nêu cách kiểm chứng.

---

## 2. Tech stack (chốt phiên bản)

| Gói | Phiên bản | Vai trò |
|---|---|---|
| next | ^15.5 | Framework (App Router) |
| react / react-dom | ^19.1 | UI |
| typescript | ^5.6 | Strict mode bắt buộc |
| tailwindcss + @tailwindcss/postcss | ^4.1 | Styling, CSS-first config (`@theme`) |
| @supabase/supabase-js | ^2.45 | Data + Auth (client-side PKCE) |
| @tanstack/react-query | ^5.59 | Server state: cache, invalidate, retry |
| zustand | ^5 | CHỈ cho timer/session store |
| @dnd-kit/core + sortable + utilities | ^6 / ^8 / ^3 | Kéo thả + keyboard reorder |
| recharts | ^2.15 | Bar chart tuần |
| @phosphor-icons/react | ^2.1 | Icon duy nhất (KHÔNG Lucide) |
| vitest + @testing-library/react + jsdom | ^2 / ^16 / ^25 | Unit test domain logic |
| eslint + eslint-config-next | ^9 / ^15 | Lint + import boundaries |

Lý do từng chọn lựa: SPEC mục 8. Không thêm dependency ngoài bảng này mà không ghi lại lý do ở đây trước.

---

## 3. Cấu trúc thư mục chi tiết

```
D:\pomo\
  SPEC.md ARCHITECTURE.md PROGRESS.md HANDOFF.md DESIGN.md
  docs/project.md
  supabase/migrations/0001_init.sql     # schema source of truth
  src/
    app/
      layout.tsx                        # font, theme init, Providers
      page.tsx                          # redirect -> /today
      globals.css                       # tailwind + tokens + base styles
      login/page.tsx
      auth/callback/page.tsx            # đợi supabase-js xử lý PKCE code rồi redirect
      (app)/layout.tsx                  # AuthGuard + AppShell (sidebar/bottom nav + session bootstrap)
      (app)/today/page.tsx
      (app)/focus/page.tsx
      (app)/review/page.tsx
      (app)/settings/page.tsx
    modules/
      i18n/        vi.ts en.ts index.tsx          # dictionary + I18nProvider + useT()
      auth/        AuthProvider.tsx AuthGuard.tsx api.ts
      tasks/       types.ts api.ts hooks.ts TaskList.tsx TaskItem.tsx TaskComposer.tsx
                   TaskEditDialog.tsx PriorityPicker.tsx
      focus/       types.ts api.ts session-store.ts time-math.ts TimerRing.tsx
                   TaskPickerDialog.tsx DistractionDialog.tsx SessionCompleteDialog.tsx
                   useSessionBootstrap.ts
      stats/       streak.ts api.ts StatsRow.tsx
      goal/        GoalProgress.tsx
      review/      api.ts insights.ts WeeklyChart.tsx ReviewView.tsx
      suggest/     scoring.ts api.ts useSuggestions.ts SuggestDialog.tsx
      settings/    api.ts SettingsForm.tsx ThemeToggle.tsx
    design-system/ Button.tsx Dialog.tsx Input.tsx data-display.tsx Switch.tsx SegmentedControl.tsx
    lib/           supabase-browser.ts env.ts time.ts utils.ts
  tests/           streak.test.ts scoring.test.ts insights.test.ts time-math.test.ts
```

### Điểm chạm cho phép giữa các module

| Ai dùng | Dùng | Vì sao |
|---|---|---|
| mọi module | `lib/*`, `design-system/*`, `modules/i18n` | nền chung |
| `app/(app)/layout` | `modules/auth/AuthGuard`, `modules/focus/useSessionBootstrap` | khởi động phiên + khôi phục session |
| `modules/tasks`, `modules/suggest` | `modules/focus/api` (startSession) | nút "bắt đầu focus" từ task/gợi ý |
| `modules/stats`, `modules/review`, `modules/suggest` | `modules/focus/types` (FocusSession type) | đọc dữ liệu session |
| `modules/goal`, `modules/settings` | `modules/settings/api` (profile) | goal nằm trong profiles |

Ngoài bảng này là vi phạm ranh giới. Check: ESLint rule ở mục 10 + review.

---

## 4. Kiến trúc dữ liệu

### 4.1 Migration `supabase/migrations/0001_init.sql`

```sql
-- profiles: 1-1 với auth.users, tạo tự động bằng trigger
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  daily_goal_minutes int not null default 120
    check (daily_goal_minutes between 15 and 960),
  preferred_session_minutes int not null default 25
    check (preferred_session_minutes between 5 and 120),
  locale text not null default 'vi' check (locale in ('vi','en')),
  sound_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  deadline date,
  completed_at timestamptz,
  position double precision not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_user_position_idx on public.tasks (user_id, position);
create index tasks_user_deadline_idx on public.tasks (user_id, deadline) where completed_at is null;

create table public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  task_title text not null,
  planned_minutes int not null check (planned_minutes between 1 and 240),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  actual_focus_seconds int check (actual_focus_seconds >= 0),
  distraction_seconds int not null default 0 check (distraction_seconds >= 0),
  ended_reason text not null default 'in_progress'
    check (ended_reason in ('in_progress','completed','stopped_early')),
  created_at timestamptz not null default now()
);
create index sessions_user_started_idx on public.focus_sessions (user_id, started_at desc);
create index sessions_inprogress_idx on public.focus_sessions (user_id)
  where ended_reason = 'in_progress';

-- updated_at tự động cho tasks
create or replace function public.set_updated_at() returns trigger
language plpgsql as $fn$
begin
  new.updated_at = now();
  return new;
end $fn$;
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- tạo profile khi user đăng ký
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $fn$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $fn$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: mọi bảng, mọi thao tác đều scoped theo chủ sở hữu
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;

create policy profiles_select on public.profiles for select using (auth.uid() = id);
create policy profiles_insert on public.profiles for insert with check (auth.uid() = id);
create policy profiles_update on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);

create policy tasks_select on public.tasks for select using (auth.uid() = user_id);
create policy tasks_insert on public.tasks for insert with check (auth.uid() = user_id);
create policy tasks_update on public.tasks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy tasks_delete on public.tasks for delete using (auth.uid() = user_id);

create policy sessions_select on public.focus_sessions for select using (auth.uid() = user_id);
create policy sessions_insert on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy sessions_update on public.focus_sessions for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- KHÔNG có delete policy cho focus_sessions: lịch sử focus là bất biến.
```

### 4.2 Quy ước dữ liệu

- `focus_sessions.ended_reason = 'in_progress'` tồn tại tối đa 1 row/user (partial unique không cần thiết vì client kiểm soát, nhưng recovery chỉ lấy row mới nhất).
- "Ngày" của một session khi tính streak = ngày LOCAL của `ended_at` (fallback `started_at`). Lý do: công sức được ghi nhận khi session kết thúc.
- `position` của task: số thực, task mới = `max(position) + 1000`, kéo thả = trung bình 2 vị trí kề (fractional indexing, SPEC D7). Khi |khoảng| < 1e-6 thì reindex toàn bộ (hàm `normalizePositions` trong tasks/api).
- Xóa task: hard delete; `focus_sessions.task_id` tự SET NULL, `task_title` snapshot giữ lịch sử (SPEC D6).

### 4.3 Truy vấn chuẩn

| Nhu cầu | Query |
|---|---|
| Tasks đang mở | `tasks where completed_at is null order by position` |
| Tasks đã xong | `tasks where completed_at not null order by completed_at desc limit 50` |
| Sessions hôm nay | `focus_sessions where started_at >= local_day_start` (lọc client theo tz trình duyệt) |
| Sessions 28 ngày (suggest/insights) | `focus_sessions where started_at >= today-28d` |
| In-progress (recovery) | `focus_sessions where ended_reason='in_progress' order by started_at desc limit 1` |

---

## 5. Kiến trúc Auth

- Magic link PKCE thuần client: `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: <origin>/auth/callback } })`.
- `/auth/callback` là client component: `supabase-js` tự `exchangeCodeForSession` qua `detectSessionInUrl` (mặc định), provider đợi `onAuthStateChange` rồi `router.replace('/today')`.
- `AuthGuard` trong `(app)/layout.tsx`: chưa có session thì `router.replace('/login')`. Không dùng middleware cookie (quyết định: giảm moving parts; app là công cụ cá nhân, không SEO cần SSR auth).
- Profile đọc/ghi qua `modules/settings/api.ts`; locale đồng bộ 2 chiều profile ↔ localStorage (mirror tránh FOUC ngôn ngữ, SPEC D13).

**Check**: đăng nhập/đăng xuất thủ công qua UI; RLS test bằng cách query user khác (trả 0 rows).

---

## 6. Kiến trúc state

| Loại state | Chủ sở hữu | Công cụ |
|---|---|---|
| Server data (tasks, sessions, profile) | TanStack Query cache, invalidate sau mỗi mutation | `modules/*/hooks.ts`, `api.ts` |
| Timer/session đang chạy | `modules/focus/session-store.ts` | Zustand (SPEC: store duy nhất) |
| UI state cục bộ (dialog mở, form) | Component state | useState/useReducer |
| Theme, locale | DOM class + localStorage mirror + profile | settings module |

Query keys chuẩn: `['tasks']`, `['tasks','done']`, `['sessions','today']`, `['sessions','range',from,to]`, `['profile']`, `['sessions','inprogress']`.

---

## 7. Focus session engine (lõi "trung thực")

### 7.1 Vòng đời

```
idle -> startSession(task, minutes)
  -> INSERT focus_sessions (ended_reason='in_progress', started_at=now)
  -> store: { sessionId, taskId, taskTitle, startedAtMs, plannedMs, distractionMs, status:'running' }
running -> tick (250ms): remaining = plannedMs - (now - startedAtMs - distractionMs)
  -> remaining <= 0 -> finalize('completed')
running -> visibilitychange:
  hidden: hiddenAt = now
  visible: distractionMs += now - hiddenAt; mở DistractionDialog(nêu thời gian rời)
running -> user dừng sớm -> finalize('stopped_early')
finalize(reason):
  actual = max(0, round((now - startedAtMs - distractionMs)/1000)) (completed: = planned*60)
  -> UPDATE row: ended_at, actual_focus_seconds, distraction_seconds, ended_reason
  -> invalidate ['sessions'], ['tasks'] ; âm thanh (nếu bật) ; dialog hoàn thành
```

### 7.2 Khôi phục sau refresh/crash

`useSessionBootstrap` (chạy 1 lần sau khi đăng nhập):
1. Query row `in_progress` mới nhất.
2. Không có -> idle.
3. Có, `now < started + planned` -> resume store ở trạng thái running (distraction lấy từ DB).
4. Có, đã quá hạn -> finalize ngay với `stopped_early`, actual = elapsed - distraction (KHÔNG gán completed, vì không chứng minh được người dùng còn focus; đây là lựa chọn trung thực, SPEC D3/D4).

### 7.3 Độ chính xác

- Mọi tính toán từ `Date.now()` và timestamp DB, không đếm setInterval (SPEC D2).
- Tab title cập nhật `mm:ss · task · Pomo` mỗi giây.
- Âm thanh hoàn thành: WebAudio oscillator 3 nốt ngắn, không file asset; tôn trọng `sound_enabled`.

**Check**: `tests/time-math.test.ts` cho computeRemaining/computeActual; kiểm thủ công refresh giữa session (AC-F2-2), rời tab (AC-F5-1).

---

## 8. Gợi ý thông minh (modules/suggest)

Pure function `scoreTasks(tasks, behavior, now)` trong `scoring.ts` (test: `tests/scoring.test.ts`).

```
base(priority)            high=100, medium=60, low=30
deadline                  quá hạn +80; hôm nay +50; ngày mai +30; <=3 ngày +15
tuổi task                 tạo > 7 ngày +10
w = min(1, completedSessions28d / 20)          # trọng số lớp học, cold start -> 0
  daypart khớp hiện tại   task có session ở daypart hiện tại: +40*w ; global best daypart khớp: +15*w
  momentum                task có session trong 3 ngày: +20*w
  tỉ lệ hoàn thành        >=0.7: +10*w ; <=0.3 (>=3 sessions): -15*w
tie-break: position tăng dần -> top 3
```

`behavior` aggregate 1 lần từ sessions 28 ngày (per-task: daypart histogram, last session, completed/total; global: best daypart). Lý do hiển thị = yếu tố đóng góp lớn nhất (template i18n, KHÔNG dùng từ "AI/model").

---

## 9. Weekly review + insights (modules/review)

- Tuần = Thứ 2..Chủ nhật (ISO, local tz). Điều hướng tuần bằng offset.
- `buildInsights(sessions28d, thisWeek, prevWeek)` trong `insights.ts` (test: `tests/insights.test.ts`):
  - Dưới 3 sessions trong 28 ngày -> trạng thái "chưa đủ dữ liệu", không sinh câu nào.
  - Câu 1: daypart có tổng phút lớn nhất ("Bạn tập trung tốt nhất vào buổi sáng").
  - Câu 2 (chọn 1): |delta%| >= 20 so với tuần trước -> câu xu hướng; ngược lại -> ngày trong tuần tốt nhất.
- Chart: Recharts `BarChart`, 7 cột Mon..Sun, màu accent, ngày 0 phút hiển thị rõ.

---

## 10. Contracts + cách kiểm chứng (codebase-architecture: mọi contract kèm check)

| Contract | Check |
|---|---|
| `lib/`, `design-system/` không import `modules/` | ESLint `no-restricted-imports` theo thư mục + `npm run lint` |
| Không logic trong `app/` (chỉ routing + compose) | Review; component thật nằm ở `modules/` |
| Mọi số liệu truy về rows thật | Unit test domain (streak/scoring/insights/time-math) + review query |
| Mọi UI có empty/loading/error | `ui-design` Quality Bar + click-through R-35 trước bàn giao |
| Không em dash/Inter/gradient tím/3-card/Lucide | antislop Delivery Gate + grep pre-ship |
| Type safety | `npm run typecheck` (tsc --noEmit) phải sạch |
| Build | `npm run build` phải pass |
| Unit tests | `npm run test` phải xanh |

---

## 11. i18n

- `modules/i18n/vi.ts` + `en.ts`: cùng shape, type `Messages = typeof vi`.
- `I18nProvider`: locale từ profile (fallback localStorage -> 'vi'), `useT()` trả function `t(key, params?)`.
- Mọi chuỗi UI qua `t()`, kể cả lý do gợi ý và insight (template có placeholder).

## 12. Theme

- Class `.dark` trên `<html>`; script inline trong `layout.tsx` đọc localStorage `pomo-theme` hoặc `prefers-color-scheme` (chống FOUC).
- Tokens trong `globals.css` `@theme` (paper/ink/accent/line/muted/surface), biến đổi theo `.dark`.
- Accent contrast: kiểm bằng `antislop-human/contrast-check.py` trước khi chốt.

## 13. Chiến lược test

| Tầng | Công cụ | Đối tượng |
|---|---|---|
| Pure domain logic | Vitest | streak.ts, scoring.ts, insights.ts, time-math.ts |
| Component | (không ở phase này, quy mô app nhỏ) | click-through R-35 thay thế |
| E2E/verify | ui-verification probes khi có Supabase thật | ghi trong HANDOFF |

## 14. Deploy

GitHub -> Vercel import -> env `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` -> deploy `main`. Supabase: chạy `0001_init.sql`, Site URL + Redirect URLs = domain Vercel + `http://localhost:3000/auth/callback`. Chi tiết từng bước copy-paste: HANDOFF.md mục Deploy.

## 15. Quyết định đã biết sẽ không làm (tránh scope creep)

- Không SSR user-data, không middleware auth (client-side guard).
- Không service worker/offline sync; online-only với error states rõ ràng.
- Không xóa session lịch sử (no delete policy).
