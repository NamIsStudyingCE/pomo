"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedLogo() {
  const letterPRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDotRef = useRef<HTMLSpanElement>(null);
  const clockCircleRef = useRef<HTMLDivElement>(null);
  const clockTicksRef = useRef<HTMLDivElement>(null);
  const orbitDotRef = useRef<HTMLDivElement>(null);
  const fullTextRef = useRef<HTMLDivElement>(null);
  const finalTrailingDotRef = useRef<HTMLSpanElement>(null);

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Nếu đã chạy xong animation trong phiên này, hiển thị ngay kết quả cuối cùng mà không lặp lại
    if (sessionStorage.getItem("pomo_logo_animated") === "true") {
      setHasAnimated(true);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    let blinkInterval: NodeJS.Timeout | null = null;

    // Khởi tạo 12 vạch giờ
    if (clockTicksRef.current) {
      clockTicksRef.current.innerHTML = "";
      const radius = 48;
      const centerX = 60;
      const centerY = 60;

      for (let hour = 1; hour <= 12; hour++) {
        const angleDeg = hour * 30 - 90;
        const rad = (angleDeg * Math.PI) / 180;
        const x = centerX + radius * Math.cos(rad);
        const y = centerY + radius * Math.sin(rad);

        const tick = document.createElement("div");
        tick.id = `logo-tick-${hour}`;
        tick.className =
          "absolute rounded-full bg-[#C74A16] transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0";
        tick.style.left = `${x}px`;
        tick.style.top = `${y}px`;
        tick.style.width = hour % 3 === 0 ? "5px" : "3.5px";
        tick.style.height = hour % 3 === 0 ? "5px" : "3.5px";
        clockTicksRef.current.appendChild(tick);
      }
    }

    // Tọa độ tâm chữ P
    let pCenterX = 24;
    let pCenterY = 24;
    if (letterPRef.current && containerRef.current) {
      const pRect = letterPRef.current.getBoundingClientRect();
      const cRect = containerRef.current.getBoundingClientRect();
      pCenterX = pRect.left - cRect.left + pRect.width / 2;
      pCenterY = pRect.top - cRect.top + pRect.height / 2;
    }

    if (clockCircleRef.current) {
      clockCircleRef.current.style.left = `${pCenterX - 60}px`;
      clockCircleRef.current.style.top = `${pCenterY - 60}px`;
    }

    // BƯỚC 2: Dấu chấm thu nhỏ lại rồi biến mất (sau 700ms)
    timers.push(
      setTimeout(() => {
        if (initialDotRef.current) {
          initialDotRef.current.style.transition = "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
          initialDotRef.current.style.transform = "scale(0)";
          initialDotRef.current.style.opacity = "0";
        }
      }, 700)
    );

    // BƯỚC 3: Vòng tròn giấy ấm nở ra từ tâm chữ P (sau 1200ms)
    timers.push(
      setTimeout(() => {
        if (clockCircleRef.current) {
          clockCircleRef.current.style.transition =
            "transform 0.6s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.4s ease";
          clockCircleRef.current.style.opacity = "1";
          clockCircleRef.current.style.transform = "scale(1)";
        }
      }, 1200)
    );

    // BƯỚC 4: 12 vạch giờ xuất hiện theo chiều kim đồng hồ (sau 1800ms)
    timers.push(
      setTimeout(() => {
        for (let hour = 1; hour <= 12; hour++) {
          timers.push(
            setTimeout(() => {
              const tick = document.getElementById(`logo-tick-${hour}`);
              if (tick) {
                tick.style.opacity = "1";
                tick.style.transform = "translate(-50%, -50%) scale(1)";
              }
            }, (hour - 1) * 70)
          );
        }
      }, 1800)
    );

    // BƯỚC 5: Chấm cam xuất hiện bên ngoài và chạy đến vị trí số 5 (sau 2900ms)
    timers.push(
      setTimeout(() => {
        if (!orbitDotRef.current) return;
        const orbitRadius = 66;
        const startHour = 12;
        const startAngle = (startHour * 30 - 90) * (Math.PI / 180);
        const startX = pCenterX + orbitRadius * Math.cos(startAngle);
        const startY = pCenterY + orbitRadius * Math.sin(startAngle);

        orbitDotRef.current.style.transition = "none";
        orbitDotRef.current.style.left = `${startX - 6}px`;
        orbitDotRef.current.style.top = `${startY - 6}px`;
        orbitDotRef.current.style.opacity = "1";
        orbitDotRef.current.style.transform = "scale(1)";

        const startTime = performance.now();
        const duration = 950;

        function stepOrbit(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentDeg = -90 + 150 * ease;
          const currentRad = (currentDeg * Math.PI) / 180;
          const curX = pCenterX + orbitRadius * Math.cos(currentRad);
          const curY = pCenterY + orbitRadius * Math.sin(currentRad);

          if (orbitDotRef.current) {
            orbitDotRef.current.style.left = `${curX - 6}px`;
            orbitDotRef.current.style.top = `${curY - 6}px`;
          }

          if (progress < 1) {
            requestAnimationFrame(stepOrbit);
          }
        }
        requestAnimationFrame(stepOrbit);
      }, 2900)
    );

    // BƯỚC 6: Vòng tròn thu nhỏ và biến mất (sau 4200ms)
    timers.push(
      setTimeout(() => {
        if (clockCircleRef.current) {
          clockCircleRef.current.style.transition =
            "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease";
          clockCircleRef.current.style.transform = "scale(0)";
          clockCircleRef.current.style.opacity = "0";
        }
      }, 4200)
    );

    // BƯỚC 7: Chấm cam kéo bung tên đầy đủ app (sau 4700ms)
    timers.push(
      setTimeout(() => {
        if (fullTextRef.current) {
          fullTextRef.current.style.transition = "max-width 1.1s cubic-bezier(0.16, 1, 0.3, 1)";
          fullTextRef.current.style.maxWidth = "440px";
        }

        if (orbitDotRef.current && letterPRef.current && containerRef.current) {
          const pRect = letterPRef.current.getBoundingClientRect();
          const cRect = containerRef.current.getBoundingClientRect();
          orbitDotRef.current.style.transition = "all 1.1s cubic-bezier(0.16, 1, 0.3, 1)";
          const finalX = pRect.right - cRect.left + 338;
          const finalY = pRect.bottom - cRect.top - 12;
          orbitDotRef.current.style.left = `${finalX}px`;
          orbitDotRef.current.style.top = `${finalY}px`;
        }

        // BƯỚC 8: Chấm blink một cái rồi lặp lại mỗi 5.5 giây (sau 5850ms)
        timers.push(
          setTimeout(() => {
            if (orbitDotRef.current) orbitDotRef.current.style.opacity = "0";
            if (finalTrailingDotRef.current) {
              finalTrailingDotRef.current.style.opacity = "1";
              finalTrailingDotRef.current.classList.add("animate-ping");
              setTimeout(() => {
                finalTrailingDotRef.current?.classList.remove("animate-ping");
              }, 400);

              blinkInterval = setInterval(() => {
                if (finalTrailingDotRef.current) {
                  finalTrailingDotRef.current.style.opacity = "0.2";
                  setTimeout(() => {
                    if (finalTrailingDotRef.current) {
                      finalTrailingDotRef.current.style.opacity = "1";
                    }
                  }, 250);
                }
              }, 5500);
            }
            sessionStorage.setItem("pomo_logo_animated", "true");
          }, 1150)
        );
      }, 4700)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, []);

  if (hasAnimated) {
    return (
      <div className="relative flex flex-wrap items-baseline select-none">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink leading-tight">
          Pomo - Deep Work Tracker
        </h1>
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent ml-1 mb-1 shrink-0 animate-pulse" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative min-h-[90px] flex items-start pt-1 select-none overflow-visible">
      {/* Chữ P cố định */}
      <div className="relative z-20 flex items-baseline">
        <span ref={letterPRef} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink leading-tight">
          P
        </span>
        {/* Dấu chấm ban đầu của P. */}
        <span
          ref={initialDotRef}
          className="inline-block h-2 w-2.5 rounded-full bg-accent ml-0.5 mb-1 shrink-0 transition-all origin-center"
        />
      </div>

      {/* Vòng tròn đồng hồ nền giấy ấm nở ra từ P */}
      <div
        ref={clockCircleRef}
        className="pointer-events-none absolute z-10 flex h-[120px] w-[120px] scale-0 items-center justify-center rounded-full opacity-0 shadow-sm transition-all"
        style={{
          background: "rgba(250, 247, 241, 0.95)",
          border: "1.5px dashed rgba(199, 74, 22, 0.35)",
        }}
      >
        <div ref={clockTicksRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Dấu chấm cam chuyển động quỹ đạo */}
      <div
        ref={orbitDotRef}
        className="pointer-events-none absolute z-30 h-3 w-3 scale-0 rounded-full bg-accent opacity-0 transition-transform"
        style={{ left: 0, top: 0 }}
      />

      {/* Phần chữ bung ra theo sau dấu chấm */}
      <div
        ref={fullTextRef}
        className="relative z-20 flex max-w-0 flex-nowrap items-baseline overflow-hidden"
        style={{ whiteSpace: "nowrap" }}
      >
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink leading-tight whitespace-nowrap">
          omo - Deep Work Tracker
        </span>
        <span
          ref={finalTrailingDotRef}
          className="inline-block h-2.5 w-2.5 rounded-full bg-accent ml-1 mb-1 shrink-0 opacity-0 transition-opacity"
        />
      </div>
    </div>
  );
}
