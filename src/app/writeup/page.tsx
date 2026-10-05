import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomo — Project Writeup",
  description: "Product story, architecture, key decisions, and engineering tradeoffs of Pomo.",
};

export default function WriteupPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#23201C] px-6 py-12 md:py-20 flex justify-center selection:bg-[#E88C30]/20">
      <article className="w-full max-w-2xl bg-white border border-[#E8E0D4] rounded-2xl p-8 md:p-12 shadow-sm">
        {/* Header */}
        <div className="border-b border-[#E8E0D4] pb-6 mb-8">
          <div className="flex items-center justify-between gap-4">
            <span className="text-2xl font-bold tracking-tight">
              Pomo<span className="text-[#C74A16]">.</span>
            </span>
            <a
              href="https://pomo-jade.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C74A16] hover:underline"
            >
              Open Live App &rarr;
            </a>
          </div>
          <p className="text-xs uppercase tracking-wider text-[#6F655B] font-medium mt-1">
            Project Overview &amp; Engineering Decisions
          </p>
        </div>

        {/* The 976-character writeup */}
        <div className="space-y-5 text-sm md:text-base leading-relaxed text-[#23201C]/90 font-serif">
          <p>
            <strong>Pomo</strong> is an intentional deep-work web app. Users organize tasks by priority, run Pomodoro countdowns, log distraction penalties mid-session, and track authentic progress via 30/90/120m gemstone streak medals and weekly review charts.
          </p>

          <p>
            I built Pomo out of personal frustration with mainstream timers: they are either passive stopwatches or bloated apps with blinding neon themes, noisy feeds, and toxic gamification that turn focus into anxious performance. I needed a quiet, tactile tool to sustain mindful effort during intense engineering sessions.
          </p>

          <p>
            Pomo helps knowledge workers protect deep work through clear ritual and honest self-reflection.
          </p>

          <div className="pt-2 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#6F655B] mb-3">
              Key Decisions &amp; Tradeoffs
            </h2>
            <ul className="space-y-2 text-sm text-[#23201C]">
              <li className="flex items-start gap-2">
                <span className="text-[#C74A16] font-bold">&bull;</span>
                <span>
                  <strong>Friction-by-design:</strong> users explicitly log distractions instead of passive auto-tracking, prioritizing mindful awareness over vanity metrics.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C74A16] font-bold">&bull;</span>
                <span>
                  <strong>Tactile paper &amp; gemstone aesthetic:</strong> chosen over dark-neon charts to reward consistency calmly without dopamine addiction.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#C74A16] font-bold">&bull;</span>
                <span>
                  <strong>Hotkey navigation:</strong> designed for zero-friction daily flow.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-10 pt-6 border-t border-[#E8E0D4] flex items-center justify-end text-xs text-[#6F655B] font-mono">
          <span>By Nguyen Hoang Nam</span>
        </div>
      </article>
    </main>
  );
}
