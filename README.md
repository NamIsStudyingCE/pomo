# Pomo — Deep Work Tracker

<p align="center">
  <strong>Honest, minimalist deep-work & focus tracking application.</strong><br>
  Built with Next.js 15 (App Router), Tailwind CSS v4, TypeScript, and Supabase.
</p>

<p align="center">
  <img src="public/icon-192.png" alt="Pomo Logo" width="96" height="96" />
</p>

---

## ✨ Features

- ⏱️ **Honest Focus Engine**: Focus timer calculated from real timestamps rather than inaccurate intervals. Automatically detects tab departure (Page Visibility API) and deducts distracted time.
- 📋 **Intuitive Task Management**: Clean task composer, reordering via drag-and-drop or keyboard (`@dnd-kit`), and auto-prioritization based on urgency and historical habits.
- 📊 **Insightful Stats & Streaks**: Real-time daily goal progress, streak counters, and weekly analytics (bar charts via Recharts) highlighting optimal focus dayparts.
- 👤 **Offline Guest Mode**: Fully functional offline without an account. Automatically isolates and persists tasks, sessions, and preferences locally in `localStorage`.
- 🔐 **Passwordless Magic Link**: Secure, client-side PKCE authentication powered by Supabase Auth.
- 🎨 **Terracotta Minimalist Aesthetic**: Warm paper palette (`#faf7f1`), ink typography (`#23201C`), and terracotta accents (`#C74A16`) with zero-FOUC dark mode support.
- 🌐 **Internationalization (i18n)**: Fully bilingual support (Tiếng Việt & English).
- 💻 **Desktop PWA & Single-Instance Support**: Installable as a standalone progressive web app with custom desktop launcher scripts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) & [TanStack Query v5](https://tanstack.com/query)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Testing**: [Vitest](https://vitest.dev/) (31 unit tests)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/NamIsStudyingCE/pomo.git
cd pomo
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

*(Note: The app runs seamlessly in **Guest Mode** even without Supabase credentials).*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality

Run unit test suites:

```bash
npm run test
```

Typecheck and lint:

```bash
npm run typecheck
npm run lint
```

Build for production:

```bash
npm run build
```

---

## 📄 License

MIT © [NamIsStudyingCE](https://github.com/NamIsStudyingCE)
