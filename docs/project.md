# Project: Pomo

## Mission

Pomo là ứng dụng web giúp người làm việc trí óc theo dõi, duy trì và cải thiện khả năng tập trung sâu một cách trung thực (rời tab không được tính giờ), có dữ liệu (thống kê ngày/tuần/streak), và gợi ý nhẹ nhàng (rule + học hành vi cực nhẹ, không khoe AI).

## Tech Stack

- Language: TypeScript 5.6+ (strict)
- Framework: Next.js 15 (App Router) + React 19
- Build tool: npm (scripts: dev / build / lint / test / typecheck)
- Database: Supabase Postgres (cloud), schema trong `supabase/migrations/`
- ORM / data access: `@supabase/supabase-js` trực tiếp + RLS (không ORM)
- Migrations: file SQL trong `supabase/migrations/`, chạy tay qua Supabase SQL Editor
- Messaging: none
- Testing: Vitest + Testing Library (unit test pure domain logic trong `tests/`)
- Other: Tailwind CSS v4, TanStack Query, Zustand (chỉ timer), dnd-kit, Recharts, @phosphor-icons/react, Be Vietnam Pro (next/font)

## Architecture

Feature modules trong `src/modules/<name>/`, mỗi module tự chứa `api.ts` (data access) + `hooks.ts` + components + `types.ts`. `src/app/` chỉ routing. `src/lib/` pure functions + supabase client. `src/design-system/` UI primitives không biết business.

Import một chiều: `app -> modules -> (design-system, lib)`. Chi tiết + bảng điểm chạm giữa modules: ARCHITECTURE.md mục 3.

## Conventions

- Package/dir naming: kebab-case cho file component nhóm (TaskList.tsx giữ PascalCase theo component), camelCase cho hooks/utils.
- Data access: CHỈ trong `modules/*/api.ts`, component không gọi supabase trực tiếp.
- Query keys chuẩn: `['tasks']`, `['sessions','today']`, `['sessions','range',from,to]`, `['profile']`.
- Error handling: api.ts trả throw Error có message; hooks bắt và map sang error state của UI (3 trạng thái bắt buộc: empty/loading/error).
- Auth: mọi route trong `(app)` cần session (AuthGuard client-side); login bằng magic link PKCE.
- Chuỗi UI: KHÔNG hardcode, luôn qua `useT()` (modules/i18n). Không em dash trong chuỗi UI.
- Icons: chỉ `@phosphor-icons/react`. Không Lucide. Không emoji trang trí.
- Comment code: chỉ giải thích "tại sao" (quyết định, ràng buộc, workaround); ngắn, sentence case; không narration (antislop-code).
- Ngày/tuần: tính theo timezone trình duyệt; tuần bắt đầu Thứ 2.

## Approved Dependencies

next, react, react-dom, typescript, tailwindcss, @tailwindcss/postcss, postcss, @supabase/supabase-js, @tanstack/react-query, zustand, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities, recharts, @phosphor-icons/react, vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/dom, jsdom, eslint, eslint-config-next, @types/node, @types/react, @types/react-dom, clsx.

Thêm dependency mới: phải ghi lý do vào ARCHITECTURE.md mục 2 trước.
