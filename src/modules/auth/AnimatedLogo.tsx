"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedLogo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const letterPRef = useRef<HTMLSpanElement>(null);
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

    // Vòng tròn nhỏ gọn: đường kính 56px (bán kính 28px), bán kính vạch 21px
    const circleDiameter = 56;
    const circleRadius = circleDiameter / 2; // 28px
    const tickRadius = 21; // px
    const orbitRadius = 31; // px (ngay sát bên ngoài vòng tròn 28px)

    if (clockTicksRef.current) {
      clockTicksRef.current.innerHTML = "";
      for (let hour = 1; hour <= 12; hour++) {
        const angleDeg = hour * 30 - 90;
        const rad = (angleDeg * Math.PI) / 180;
        const x = circleRadius + tickRadius * Math.cos(rad);
        const y = circleRadius + tickRadius * Math.sin(rad);

        const tick = document.createElement("div");
        tick.id = `logo-tick-${hour}`;
        tick.className =
          "absolute rounded-full bg-[#C74A16] transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0";
        tick.style.left = `${x}px`;
        tick.style.top = `${y}px`;
        const size = hour % 3 === 0 ? "3.5px" : "2.5px";
        tick.style.width = size;
        tick.style.height = size;
        clockTicksRef.current.appendChild(tick);
      }
    }

    // Tọa độ tâm chữ P tính chính xác theo relative bounding rect
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

    // BƯỚC 2: Dấu chấm ban đầu của P. thu nhỏ lại rồi biến mất (sau 600ms)
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

    // BƯỚC 3: Vòng tròn giấy ấm nhỏ gọn nở ra từ tâm chữ P ôm lấy P (sau 1000ms)
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

    // BƯỚC 4: 12 vạch giờ xuất hiện theo chiều kim đồng hồ (sau 1550ms)
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
            }, (hour - 1) * 60)
          );
        }
      }, 1550)
    );

    // BƯỚC 5: Chấm cam xuất hiện bên ngoài và chạy đến vị trí số 5 (sau 2450ms)
    timers.push(
      setTimeout(() => {
        if (!orbitDotRef.current) return;
        updateCoords();

        const startHour = 12;
        const startAngle = (startHour * 30 - 90) * (Math.PI / 180);
        const startX = pCenterX + orbitRadius * Math.cos(startAngle);
        const startY = pCenterY + orbitRadius * Math.sin(startAngle);

        orbitDotRef.current.style.transition = "none";
        orbitDotRef.current.style.left = `${startX - 4}px`;
        orbitDotRef.current.style.top = `${startY - 4}px`;
        orbitDotRef.current.style.opacity = "1";
        orbitDotRef.current.style.transform = "scale(1)";

        const startTime = performance.now();
        const duration = 850;

        function stepOrbit(now: number) {
          const elapsed = now - startTime;
          const progress = Math.min(1, elapsed / duration);
          const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

          const currentDeg = -90 + 150 * ease; // từ 12h (-90°) đến 5h (+60°)
          const currentRad = (currentDeg * Math.PI) / 180;
          const curX = pCenterX + orbitRadius * Math.cos(currentRad);
          const curY = pCenterY + orbitRadius * Math.sin(currentRad);

          if (orbitDotRef.current) {
            orbitDotRef.current.style.left = `${curX - 4}px`;
            orbitDotRef.current.style.top = `${curY - 4}px`;
          }

          if (progress < 1) {
            requestAnimationFrame(stepOrbit);
          }
        }
        requestAnimationFrame(stepOrbit);
      }, 2450)
    );

    // BƯỚC 6: Vòng tròn thu nhỏ và biến mất (sau 3500ms)
    timers.push(
      setTimeout(() => {
        if (clockCircleRef.current) {
          clockCircleRef.current.style.transition =
            "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease";
          clockCircleRef.current.style.transform = "scale(0)";
          clockCircleRef.current.style.opacity = "0";
        }
      }, 3500)
    );

    // BƯỚC 7: Chấm cam lướt sang phải và bung tên đầy đủ ra (sau 3950ms)
    timers.push(
      setTimeout(() => {
        // Bung phần chữ còn lại mượt mà
        if (fullTextRef.current) {
          fullTextRef.current.style.transition = "max-width 0.9s cubic-bezier(0.16, 1, 0.3, 1)";
          fullTextRef.current.style.maxWidth = "550px";
        }

        // Tính đích đến chính xác của dấu chấm cam
        if (orbitDotRef.current && letterPRef.current && containerRef.current) {
          const cRect = containerRef.current.getBoundingClientRect();
          orbitDotRef.current.style.transition = "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)";

          // Đợi microtask để lấy vị trí thật của finalTrailingDot nếu có, hoặc tính theo text width
          setTimeout(() => {
            if (finalTrailingDotRef.current && orbitDotRef.current) {
              const dotRect = finalTrailingDotRef.current.getBoundingClientRect();
              orbitDotRef.current.style.left = `${dotRect.left - cRect.left}px`;
              orbitDotRef.current.style.top = `${dotRect.top - cRect.top}px`;
            }
          }, 50);
        }

        // BƯỚC 8: Chấm hạ cánh ngay sát chữ Tracker., blink 1 lần rồi lặp lại sau 5.5s (sau 4900ms)
        timers.push(
          setTimeout(() => {
            if (orbitDotRef.current) orbitDotRef.current.style.opacity = "0";
            if (finalTrailingDotRef.current) {
              finalTrailingDotRef.current.style.opacity = "1";
              finalTrailingDotRef.current.style.transform = "scale(1)";

              // Blink 1 lần
              finalTrailingDotRef.current.style.transition = "opacity 0.2s ease, transform 0.2s ease";
              finalTrailingDotRef.current.style.opacity = "0.15";
              finalTrailingDotRef.current.style.transform = "scale(0.6)";

              setTimeout(() => {
                if (finalTrailingDotRef.current) {
                  finalTrailingDotRef.current.style.opacity = "1";
                  finalTrailingDotRef.current.style.transform = "scale(1)";
                }
              }, 220);

              // Lặp lại mỗi 5.5 giây
              blinkInterval = setInterval(() => {
                if (finalTrailingDotRef.current) {
                  finalTrailingDotRef.current.style.opacity = "0.15";
                  finalTrailingDotRef.current.style.transform = "scale(0.6)";
                  setTimeout(() => {
                    if (finalTrailingDotRef.current) {
                      finalTrailingDotRef.current.style.opacity = "1";
                      finalTrailingDotRef.current.style.transform = "scale(1)";
                    }
                  }, 220);
                }
              }, 5500);
            }
            sessionStorage.setItem("pomo_logo_animated", "true");
          }, 950)
        );
      }, 3950)
    );

    return () => {
      timers.forEach((t) => clearTimeout(t));
      if (blinkInterval) clearInterval(blinkInterval);
    };
  }, []);

  if (hasAnimated) {
    return (
      <div className="relative flex items-baseline select-none">
        <h1 className="text-3xl font-bold tracking-tight text-ink leading-tight">
          Pomo - Deep Work Tracker
          <span className="inline-block h-2 w-2 rounded-full bg-accent ml-0.5 align-baseline" />
        </h1>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex items-baseline select-none overflow-visible min-h-[50px]"
    >
      {/* Cụm chữ chính: P luôn liền mạch tuyệt đối với omo - Deep Work Tracker */}
      <h1 className="relative z-20 flex items-baseline text-3xl font-bold tracking-tight text-ink leading-tight">
        <span ref={letterPRef} className="relative inline-block">
          P
          {/* Dấu chấm ban đầu của P. - nằm sát chân chữ P */}
          <span
            ref={initialDotRef}
            className="absolute left-full bottom-[4px] ml-0.5 inline-block h-2 w-2 rounded-full bg-accent transition-all origin-center"
          />
        </span>

        {/* Phần chữ omo - Deep Work Tracker bung ra liền sát chữ P không có khoảng cách thừa */}
        <span
          ref={fullTextRef}
          className="inline-flex max-w-0 items-baseline overflow-hidden transition-all whitespace-nowrap"
          style={{ whiteSpace: "nowrap" }}
        >
          <span>omo&nbsp;-&nbsp;Deep&nbsp;Work&nbsp;Tracker</span>
          {/* Dấu chấm cuối cùng gắn liền ngay sau Tracker */}
          <span
            ref={finalTrailingDotRef}
            className="inline-block h-2 w-2 rounded-full bg-accent ml-0.5 opacity-0 transition-all shrink-0 align-baseline"
          />
        </span>
      </h1>

      {/* Vòng tròn đồng hồ giấy ấm nhỏ gọn (56px) căn chính xác tâm chữ P */}
      <div
        ref={clockCircleRef}
        className="pointer-events-none absolute z-10 flex h-[56px] w-[56px] scale-0 items-center justify-center rounded-full opacity-0 shadow-xs transition-all"
        style={{
          background: "rgba(250, 247, 241, 0.98)",
          border: "1px dashed rgba(199, 74, 22, 0.45)",
          boxShadow: "0 2px 10px rgba(35, 32, 28, 0.06)",
        }}
      >
        <div ref={clockTicksRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Dấu chấm cam chuyển động quỹ đạo */}
      <div
        ref={orbitDotRef}
        className="pointer-events-none absolute z-30 h-2 w-2 scale-0 rounded-full bg-accent opacity-0 transition-transform shadow-xs"
        style={{ left: 0, top: 0 }}
      />
    </div>
  );
}
