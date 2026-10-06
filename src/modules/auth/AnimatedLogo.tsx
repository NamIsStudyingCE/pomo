"use client";

import { useEffect, useRef } from "react";

export function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterPRef = useRef<HTMLSpanElement>(null);
  const initialDotRef = useRef<HTMLSpanElement>(null);
  const clockCircleRef = useRef<HTMLDivElement>(null);
  const clockTicksRef = useRef<HTMLDivElement>(null);
  const orbitDotRef = useRef<HTMLDivElement>(null);
  const line1WrapRef = useRef<HTMLSpanElement>(null);
  const line1TypewriterRef = useRef<HTMLSpanElement>(null);
  const line2RowRef = useRef<HTMLDivElement>(null);
  const trackerTextWrapRef = useRef<HTMLSpanElement>(null);
  const trailingDotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {

    // Moi timer/interval deu di qua helper nay: unmount giua chung -> cleanup day du,
    // khong con interval ma hoac ghi DOM vao node da go (loi cu: typewriter interval ro ri).
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];
    const addTimer = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    // Cấu hình vòng tròn đồng hồ:
    const circleDiameter = 56;
    const circleRadius = circleDiameter / 2; // 28px
    const tickRadius = 20; // px (nằm gọn bên trong viền)
    const orbitRadius = 35; // px (dời xa viền đồng hồ hơn một chút, không đè viền 28px)

    const tickEls: HTMLDivElement[] = [];

    // Tạo 12 vạch giờ: 4 mốc 12h, 3h, 6h, 9h to bằng nhau (4px), các mốc còn lại 2.2px
    if (clockTicksRef.current) {
      clockTicksRef.current.innerHTML = "";
      tickEls.length = 0;
      for (let hour = 1; hour <= 12; hour++) {
        const angleDeg = hour * 30 - 90;
        const rad = (angleDeg * Math.PI) / 180;
        const x = circleRadius + tickRadius * Math.cos(rad);
        const y = circleRadius + tickRadius * Math.sin(rad);

        const tick = document.createElement("div");
        // Tailwind v4: scale-0 la property `scale` doc lap, KHONG bi inline style.transform ghi de.
        // Vi vay khoi tao bang style.transform truc tiep, khong dung class scale-0.
        tick.style.transform = "translate(-50%, -50%) scale(0)";
        tick.className =
          "absolute rounded-full bg-[#C74A16] transition-all duration-200 opacity-0";
        tick.style.left = `${x}px`;
        tick.style.top = `${y}px`;
        const isMainAxis = hour === 12 || hour === 3 || hour === 6 || hour === 9;
        const size = isMainAxis ? "4px" : "2.2px";
        tick.style.width = size;
        tick.style.height = size;
        clockTicksRef.current.appendChild(tick);
        tickEls.push(tick);
      }
    }

    let pCenterX = 13;
    let pCenterY = 18;

    function updateCoords() {
      if (letterPRef.current && containerRef.current) {
        const pRect = letterPRef.current.getBoundingClientRect();
        const cRect = containerRef.current.getBoundingClientRect();
        pCenterX = pRect.left - cRect.left + pRect.width / 2;
        pCenterY = pRect.top - cRect.top + pRect.height / 2;

        if (clockCircleRef.current) {
          clockCircleRef.current.style.left = `${pCenterX - circleRadius}px`;
          clockCircleRef.current.style.top = `${pCenterY - circleRadius}px`;
        }
      }
    }

    updateCoords();

    // BƯỚC 2: Dấu chấm ban đầu của P. thu nhỏ và biến mất (600ms)
    timers.push(
      setTimeout(() => {
        if (initialDotRef.current) {
          initialDotRef.current.style.transition =
            "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease";
          initialDotRef.current.style.transform = "scale(0)";
          initialDotRef.current.style.opacity = "0";
        }
      }, 600)
    );

    // BƯỚC 3: Vòng tròn trắng giấy ấm nở ra từ tâm P (1000ms)
    timers.push(
      setTimeout(() => {
        updateCoords();
        if (clockCircleRef.current) {
          clockCircleRef.current.style.transition =
            "transform 0.5s cubic-bezier(0.34, 1.3, 0.64, 1), opacity 0.35s ease";
          clockCircleRef.current.style.opacity = "1";
          clockCircleRef.current.style.transform = "scale(1)";
        }
      }, 1000)
    );

    // BƯỚC 4: 12 vạch giờ xuất hiện theo chiều kim đồng hồ (1500ms)
    addTimer(() => {
      for (let hour = 1; hour <= 12; hour++) {
        addTimer(() => {
          const tick = tickEls[hour - 1];
          if (tick) {
            tick.style.opacity = "1";
            tick.style.transform = "translate(-50%, -50%) scale(1)";
          }
        }, (hour - 1) * 55);
      }
    }, 1500);

    // BƯỚC 5: Chấm cam xuất hiện tại vị trí 12h, ĐỨNG YÊN một khoảng thời gian ngắn (300ms) rồi mới chuyển động
    addTimer(() => {
      if (!orbitDotRef.current) return;
      updateCoords();

      const startAngle = (12 * 30 - 90) * (Math.PI / 180);
      const startX = pCenterX + orbitRadius * Math.cos(startAngle);
      const startY = pCenterY + orbitRadius * Math.sin(startAngle);

      orbitDotRef.current.style.transition = "transform 0.2s cubic-bezier(0.34, 1.5, 0.64, 1), opacity 0.2s ease";
      orbitDotRef.current.style.left = `${startX - 4}px`;
      orbitDotRef.current.style.top = `${startY - 4}px`;
      orbitDotRef.current.style.opacity = "1";
      orbitDotRef.current.style.transform = "scale(1)";

      // ĐỨNG YÊN 300ms rồi mới bắt đầu chuyển động quỹ đạo
      addTimer(() => {
        const startTime = performance.now();
        const duration = 850;

        function stepOrbit(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          const ease =
            progress < 0.5
              ? 2 * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentDeg = -90 + 150 * ease; // từ 12h (-90°) đến 5h (60°)
          const currentRad = (currentDeg * Math.PI) / 180;
          const curX = pCenterX + orbitRadius * Math.cos(currentRad);
          const curY = pCenterY + orbitRadius * Math.sin(currentRad);

          if (orbitDotRef.current) {
            orbitDotRef.current.style.left = `${curX - 4}px`;
            orbitDotRef.current.style.top = `${curY - 4}px`;
          }

          if (progress < 1) {
            requestAnimationFrame(stepOrbit);
          } else {
            // Đến mốc 5h: chấm cam tạm thời biến mất
            if (orbitDotRef.current) {
              orbitDotRef.current.style.transition =
                "transform 0.25s ease, opacity 0.25s ease";
              orbitDotRef.current.style.transform = "scale(0)";
              orbitDotRef.current.style.opacity = "0";
            }
          }
        }
        requestAnimationFrame(stepOrbit);
      }, 300);
    }, 2600);

    // BƯỚC 6: Vòng tròn thu nhỏ lại rồi biến mất (4000ms - điều chỉnh tương ứng với 300ms đứng yên)
    addTimer(() => {
      if (clockCircleRef.current) {
        clockCircleRef.current.style.transition =
          "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
        clockCircleRef.current.style.transform = "scale(0)";
        clockCircleRef.current.style.opacity = "0";
      }
    }, 4000);

    // BƯỚC 7: Reveal dòng 1: Pomo - Deep Work (4400ms)
    addTimer(() => {
      // Dấu chấm ban đầu ẩn hoàn toàn và remove khỏi flow để omo dính sát vào P
      if (initialDotRef.current) {
        initialDotRef.current.style.display = "none";
      }

      if (line1WrapRef.current) {
        line1WrapRef.current.style.transition =
          "max-width 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease";
        line1WrapRef.current.style.maxWidth = "360px";
        line1WrapRef.current.style.opacity = "1";
      }

      // Typewriter " - Deep Work"
      const line1 = " - Deep Work";
      let charIdx = 0;
      const tw = setInterval(() => {
        if (charIdx <= line1.length) {
          if (line1TypewriterRef.current) {
            line1TypewriterRef.current.textContent = line1.slice(0, charIdx);
          }
          charIdx++;
        } else {
          clearInterval(tw);

          // BƯỚC 8: Chữ "Tracker" xuất hiện từ TRÁI SANG PHẢI (slide/wipe from left)
          addTimer(() => {
            if (line2RowRef.current) {
              line2RowRef.current.style.opacity = "1";
            }
            if (trackerTextWrapRef.current) {
              // Mở rộng từ trái sang phải mượt mà
              trackerTextWrapRef.current.style.transition =
                "max-width 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease";
              trackerTextWrapRef.current.style.maxWidth = "140px";
              trackerTextWrapRef.current.style.opacity = "1";
            }

            // BƯỚC 9: Dấu chấm cam xuất hiện sau khi chữ Tracker đã mở ra
            addTimer(() => {
              if (trailingDotRef.current) {
                trailingDotRef.current.style.opacity = "1";
                trailingDotRef.current.style.transform = "scale(1)";

                // 1 chu kỳ chớp mắt (2 lần chớp liên tiếp)
                function blinkCycle(onComplete?: () => void) {
                  if (!trailingDotRef.current) return;
                  trailingDotRef.current.style.transition = "opacity 0.08s ease";
                  trailingDotRef.current.style.opacity = "0.05";
                  addTimer(() => {
                    if (!trailingDotRef.current) return;
                    trailingDotRef.current.style.opacity = "1";
                    addTimer(() => {
                      if (!trailingDotRef.current) return;
                      trailingDotRef.current.style.opacity = "0.05";
                      addTimer(() => {
                        if (!trailingDotRef.current) return;
                        trailingDotRef.current.style.opacity = "1";
                        if (onComplete) onComplete();
                      }, 80);
                    }, 120);
                  }, 80);
                }

                // Thực hiện ĐÚNG 2 chu kỳ nhấp nháy
                blinkCycle(() => {
                  addTimer(() => {
                    blinkCycle(() => {
                      // Hoàn tất 2 chu kỳ: Biến đổi thành hình vuông cam sắc nét
                      addTimer(() => {
                        if (trailingDotRef.current) {
                          trailingDotRef.current.style.transition =
                            "border-radius 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease";
                          trailingDotRef.current.style.borderRadius = "1px";
                          trailingDotRef.current.style.transform = "scale(1.05)";
                          addTimer(() => {
                            if (trailingDotRef.current) {
                              trailingDotRef.current.style.transform = "scale(1)";
                            }
                          }, 300);
                        }
                      }, 400);
                    });
                  }, 1200);
                });
              }
            }, 450);
          }, 300);
        }
      }, 50);
      intervals.push(tw);
    }, 4400);

    return () => {
      intervals.forEach(clearInterval);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative select-none overflow-visible min-h-[90px] mt-8"
    >
      <div className="relative z-20 text-3xl font-bold tracking-tight text-ink leading-tight">
        {/* Dòng 1: Pomo - Deep Work */}
        <div className="flex items-baseline">
          {/* Chữ P: đặt absolute cho initialDot để tuyệt đối không tạo khoảng cách giữa P và omo */}
          <span ref={letterPRef} className="relative inline-block">
            P
            <span
              ref={initialDotRef}
              className="absolute left-full bottom-[5px] ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-accent transition-all origin-center"
            />
          </span>

          {/* Wrapper chứa "omo" và typewriter " - Deep Work" liền kề chữ P */}
          <span
            ref={line1WrapRef}
            className="inline-block max-w-0 overflow-hidden opacity-0 whitespace-nowrap"
            style={{ verticalAlign: "baseline" }}
          >
            <span>omo</span>
            <span ref={line1TypewriterRef} className="inline" />
          </span>
        </div>

        {/* Dòng 2: Tracker - đầu dòng thẳng hàng tuyệt đối với chữ P bên trên */}
        <div
          ref={line2RowRef}
          className="flex items-baseline mt-0.5 opacity-0 transition-opacity duration-200"
        >
          {/* Tracker xuất hiện từ trái sang phải bằng container overflow-hidden max-w transition */}
          <span
            ref={trackerTextWrapRef}
            className="inline-block max-w-0 overflow-hidden opacity-0 whitespace-nowrap"
            style={{ verticalAlign: "baseline" }}
          >
            Tracker
          </span>
          {/* Dấu chấm cam xuất hiện sau Tracker, chớp mắt 2 chu kỳ rồi biến thành hình vuông */}
          <span
            ref={trailingDotRef}
            className="inline-block h-2 w-2 rounded-full bg-accent ml-1 opacity-0 transition-all align-baseline"
            style={{ transform: "scale(0)" }}
          />
        </div>
      </div>

      {/* Vòng tròn đồng hồ nổi bật: dùng token surface để đúng cả dark mode */}
      <div
        ref={clockCircleRef}
        className="pointer-events-none absolute z-10 flex h-[56px] w-[56px] items-center justify-center rounded-full opacity-0"
        style={{
          transform: "scale(0)",
          background: "var(--color-surface)",
          border: "1.5px dashed rgba(199, 74, 22, 0.55)",
          boxShadow:
            "0 0 0 3px rgba(199,74,22,0.08), 0 4px 16px rgba(35,32,28,0.12)",
        }}
      >
        <div ref={clockTicksRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Dấu chấm cam chạy ngoài viền đồng hồ */}
      <div
        ref={orbitDotRef}
        className="pointer-events-none absolute z-30 h-2 w-2 rounded-full bg-accent opacity-0"
        style={{ left: 0, top: 0, transform: "scale(0)" }}
      />
    </div>
  );
}
