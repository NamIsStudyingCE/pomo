# DESIGN: Pomo

> Design direction bắt buộc theo antislop R-37. Mọi quyết định visual phải truy về file này.
> antislop là filter, file này là direction. Dials: **ENERGY 1 / RHYTHM 2 / MOTION 1** (antislop) · **VARIANCE 5 / MOTION 3 / DENSITY 6** (taste-skill).

## Design Read

Product app (công cụ tập trung cá nhân) cho người làm việc trí óc Việt Nam, ngôn ngữ "calm productivity": trầm, ấm, tập trung vào một việc duy nhất. Cảm hứng ở mức triết lý (Linear về kỷ luật, Things 3 về sự thân thiện), KHÔNG sao chép bố cục hay nhận diện của ai (R-30).

## Identity

- **Tính cách**: một người bạn làm việc trầm lặng. Không hô hào, không game-hóa ồn ào, không màu mè.
- **Motif nhận diện (lặp lại có chủ đích)**: vòng cung tròn (ring) của Pomodoro. Dùng ở: timer chính, goal progress vòng (nếu phù hợp), logo dạng wordmark "Pomo" kèm chấm tròn accent. Ring là dấu hiệu nhận diện duy nhất, không thêm motif thứ hai.
- **Lý do accent (R-31)**: terracotta/cà chua gợi quả cà chua Pomodoro, gốc tên của phương pháp. Ấm, đất, không neon.

## Palette (CSS variables trong globals.css)

Light (mặc định theo system, light-first vì làm việc ban ngày):

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-paper` | `#FAF7F1` | nền trang (giấy ấm, không trắng tinh) |
| `--color-surface` | `#FFFFFF` | bề mặt card/dialog nổi trên nền |
| `--color-ink` | `#23201C` | chữ chính (nâu mực, không đen tuyền) |
| `--color-muted` | `#6F655B` | chữ phụ (contrast trên paper >= 4.5:1) |
| `--color-line` | `#E8E0D4` | viền, divider |
| `--color-accent` | `#C74A16` | CTA chính, ring, trạng thái đang focus |
| `--color-accent-strong` | `#A63B10` | hover/active của accent |
| `--color-accent-soft` | `#F6E3D8` | nền nhẹ cho badge/progress track |
| `--color-danger` | `#B3261E` | xóa, lỗi |

Dark (`.dark`):

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--color-paper` | `#1B1815` | nền (than ấm, không đen tuyền) |
| `--color-surface` | `#262119` | card/dialog |
| `--color-ink` | `#F2EDE4` | chữ chính |
| `--color-muted` | `#A79C8E` | chữ phụ |
| `--color-line` | `#3A332B` | viền |
| `--color-accent` | `#C74A16` | fill/đồ họa: chữ trắng trên nền này đạt 4.75:1, ranh giới trên paper đạt 3.72:1 |
| `--color-accent-strong` | `#F0763F` | chữ accent trên nền tối (6.2:1). Hover nút dùng `brightness-90`, không đổi màu |
| `--color-accent-soft` | `#3A2418` | nền nhẹ |
| `--color-danger` | `#E0655D` | xóa, lỗi |

- **Kim loại huy chương Streak** (ngoại lệ duy nhất được mở rộng): gold / silver / bronze
  trầm ấm (`--color-*-soft` fill + `--color-*-strong` viền/sao, trong `globals.css`, dùng được
  cả 2 theme). Chỉ dùng cho khiên huy chương và cung tiến độ vàng, không lan sang chỗ khác.
  Ngưỡng tuyệt đối theo phút tích lũy trong ngày: Đồng 30 · Bạc 90 · Vàng 120, bất kể goal.

Quy tắc: tối đa 2 màu lõi (ink + accent) + neutral, đúng R-29. Accent chỉ xuất hiện ở hành động chính và trạng thái focus (one deliberate accent). Chữ in trên nút accent luôn trắng và đã kiểm contrast (light 4.75:1, dark 4.75:1); chữ accent trên nền giấy luôn dùng `accent-strong` (light 6.03:1, dark 6.2:1). Priority KHÔNG dùng thêm màu rời: High = chấm accent đậm + chữ, Medium = chấm muted, Low = chấm line (khác biệt bằng độ đậm và nhãn chữ, không cầu vồng).

## Typography

- **Font duy nhất**: Be Vietnam Pro (next/font, subsets `vietnamese` + `latin`). Lý do: thiết kế cho tiếng Việt, dấu hiển thị đúng; geometric nhưng ấm; không nằm trong nhóm default bị cấm (Inter/Geist/Space Grotesk).
- **Scale**: `12 / 14 / 16 / 20 / 28 / 40`. Body 16, phụ 14, meta 12, tiêu đề section 20, màn hình 28, số timer 56+.
- **Số timer và mọi con số thống kê**: `font-variant-numeric: tabular-nums` để không giật khi đếm.
- Không uppercase wide-tracking, không mono làm aesthetic, không italic trang trí.

## Spacing / Radius / Elevation

- Spacing scale theo bước 4: 4, 8, 12, 16, 24, 32, 48. Section cách nhau 32-48, trong card 16-24.
- Radius: `8` cho input/badge nhỏ, `12` cho card, `16` cho dialog, `999` chỉ cho nút tròn icon và ring. Một hệ radius duy nhất, áp dụng đều (Shape Consistency Lock).
- Elevation: mặc định phẳng, phân tách bằng `--color-line`. Chỉ dialog/popover có shadow (warm-tinted, không đen): `0 8px 30px rgb(35 32 28 / 0.12)`.

## Motion (MOTION 1)

- Chỉ: hover/focus transition 150ms, dialog xuất hiện 120ms fade+scale 0.98, ring timer chuyển động đều theo thời gian thật, skeleton shimmer nhẹ khi loading.
- Không loop vô hạn, không parallax, không scroll-hijack. Tôn trọng `prefers-reduced-motion`.

## Quy tắc cứng (kế thừa antislop + taste-skill)

- CẤM em dash (`—`) và en dash dạng ngắt trong mọi chuỗi UI (dùng dấu phẩy, chấm, hai chấm, hoặc gạch ngang thường).
- CẤM Inter, gradient tím/xanh-tím, mesh/radial orbs, glassmorphism, glow, 3 card giống hệt nhau, eyebrow lạm dụng, badge "AI", icon sparkle, emoji trang trí, Lucide.
- CẤM số liệu/testimonial/logo giả (R-17/R-18/R-36/R-38): app này vốn không cần các thứ đó.
- Mọi màn hình đủ 3 trạng thái: empty (nói lý do + hành động đầu tiên), loading (skeleton đúng hình dạng), error (nói chuyện gì xảy ra + nút thử lại).
- Nút chính một dòng, nhãn động từ cụ thể ("Bắt đầu 25 phút", không "Get Started").
- Mọi điều khiển >= 44px, focus ring accent 2px rõ ràng, dùng được bằng bàn phím hoàn toàn.

## Hallmark · App pages (locked family)

> Bổ sung bởi `hallmark redesign` (multi-page flow). Họ này khóa nhịp cho mọi trang app.
> Không catalog macro nào khớp dashboard đã xác thực, nên họ riêng được định nghĩa tại đây.

- **Genre**: modern-minimal (giọng Linear: sans duy nhất, whitespace kỷ luật, hairline, một accent).
- **Họ App-Dashboard**: header-rule (H1 trái + meta phải + một hairline) · status dock number-led
  (con số là hero, nhãn gọn) · một action row một primary duy nhất (gợi ý nằm trong picker,
  start nhanh nằm trên từng dòng task) · work list (composer dính trên, hàng task phẳng) ·
  nội dung trong `max-w-2xl`.
- **Luồng start một đường**: Today → picker (gợi ý preselect sẵn, sửa phút nếu muốn) → /focus;
  hoặc 1-click từ nút Play trên dòng task. Không hai dialog chồng nhau tới cùng một đích.
- **Luồng dừng về thẳng /today** như luồng hết giờ (dialog completed global đi theo sang đó).
- **App pages CẤM enrichment** (minh họa CSS/SVG trang trí, demo video, background art).
  Chức năng gánh trang, không trang trí.
- **Phím tắt vô hình**: Space (mở picker), Enter (thêm việc), 1/2/3 (đổi trang) vẫn hoạt
  động nhưng không hiện chip gợi ý trên mặt trang. Nút và nav giữ nhãn sạch một dòng.
- **Chia sẻ**: wordmark Pomo + chấm accent · accent terracotta duy nhất · Be Vietnam Pro ·
  CTA voice (primary fill chữ trắng + kbd hint mờ, secondary ghost) · nhịp header-rule.
- **Được khác nhau**: nhịp trong họ (dock 2 tầng hay 1 khối, list phẳng hay nhóm) và voice component.
- **Stamp**: project dùng Tailwind utilities trong TSX nên stamp Hallmark nằm ở dòng đầu file
  trang dạng `// Hallmark · ...` thay vì trong CSS. Project memory: `.hallmark/log.json`.

## Copy voice

- VI trước: câu ngắn, động từ đứng đầu cho hành động ("Thêm việc", "Bắt đầu tập trung"). Không sáo rỗng ("Nâng cao hiệu suất"), không từ "AI", "thông minh", "mô hình". Gợi ý nói lý do thật ("Ưu tiên cao, còn 1 ngày tới hạn").
- EN: tương đương, giữ nguyên giọng.
