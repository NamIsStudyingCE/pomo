# SPEC: Pomo

> Trạng thái: **BẢN NHÁP CHỜ XÁC NHẬN**. Sau khi được xác nhận, file này ĐÓNG BĂNG.
> Mọi thay đổi sau xác nhận phải qua quy trình refine (sdd-refine) và ghi lại trong Revision History.
> Ngày tạo: 2026-10-04 · Người yêu cầu: chủ project · Tác giả bản spec: agent (áp dụng sdd-feature, product-design, grill-me)

---

## 1. Mục tiêu sản phẩm

**Pomo** là ứng dụng web giúp người làm việc trí óc theo dõi, duy trì và cải thiện khả năng tập trung sâu (deep work) một cách **trung thực**, **có dữ liệu**, và **có gợi ý thông minh nhẹ**.

Ba giá trị cốt lõi, đúng thứ tự ưu tiên:

1. **Trung thực tuyệt đối**: thời gian tập trung ghi nhận là thời gian THẬT. Rời tab thì thời gian đó không được tính. Mọi con số trong app đều truy được về dữ liệu thật, không con số ảo, không tự tâng bốc.
2. **Dữ liệu phục vụ nhận thức**: thống kê ngày, streak, review tuần, insight phải giúp người dùng hiểu thói quen của chính mình, không phải để trang trí.
3. **Gợi ý nhẹ, không áp đặt**: app đề xuất task nên làm, nhưng quyền quyết định luôn ở người dùng. Cơ chế học hành vi chạy âm thầm, không khoe rằng mình là "AI".

**Vấn đề giải quyết**: người làm việc trí óc thường (a) không biết hôm nay mình thật sự tập trung bao lâu, (b) có danh sách task nhưng không biết nên bắt đầu từ đâu, (c) tự đánh giá quá cao mức tập trung của mình vì không có số liệu trung thực.

**Định nghĩa thành công**: người dùng quay lại app mỗi ngày (streak tự nhiên tăng), số phút tập trung thực tế trung bình mỗi tuần tăng theo thời gian, và họ trả lời được câu hỏi "tuần này tôi tập trung tốt hơn tuần trước không" bằng dữ liệu.

---

## 2. Đối tượng người dùng

| Nhóm | Bối cảnh | Nhu cầu chính |
|---|---|---|
| Người làm việc trí óc (developer, designer, researcher) | Làm việc nhiều giờ trên máy tính, dễ bị phân tâm bởi tab/trình duyệt | Đo lường trung thực, nhắc nhở khi xao nhãng |
| Sinh viên / học thạc sĩ | Học theo phiên, deadline rõ ràng | Ưu tiên task theo deadline, streak duy trì động lực |
| Lập trình viên freelance | Tự quản thời gian, nhiều task song song | Biết hôm nay làm được gì, tuần này hiệu quả ra sao |

Đặc điểm chung: dùng máy tính làm việc chính (PC là thiết bị primary), quen Pomodoro hoặc từng nghe về nó, cần app nhanh, ít ma sát, không rườm rà.

---

## 3. Phạm vi

### 3.1 Trong phạm vi (In scope)

Đúng 8 nhóm tính năng trong mục 5, không hơn không kém. Kèm các phần nền bắt buộc: đăng nhập/đăng xuất, cài đặt cá nhân (goal, thời lượng session, ngôn ngữ), chuyển đổi ngôn ngữ VI/EN.

### 3.2 Ngoài phạm vi (Out of scope), KHÔNG được tự ý thêm

- Nghỉ giải lao tự động (break timer 5 phút) giữa các session.
- Tạm dừng (pause) trong session đang chạy. Session chỉ kết thúc bằng 2 cách: hoàn thành (hết giờ) hoặc dừng sớm (ghi nhận thời gian thực tế).
- Chặn website/ứng dụng khác (yêu cầu gốc đã nói rõ: chỉ cảnh báo, không chặn).
- Tài khoản nhóm, chia sẻ, leaderboard, social features.
- App mobile native, notification push, đồng bộ lịch (Google Calendar...).
- Tags, subtasks, ghi chú task, đính kèm file, ước lượng thời gian per task.
- Âm thanh/nhạc tập trung, theme tùy biến ngoài light/dark.
- Bất kỳ tính năng nào không nằm trong mục 5.

---

## 4. User stories

### Nhóm Task (F1, F4)

- **US-01**: Là người dùng, tôi muốn thêm task mới với tiêu đề, mức ưu tiên và deadline (tùy chọn) trong tối đa 10 giây, để không bị gián đoạn mạch suy nghĩ.
- **US-02**: Là người dùng, tôi muốn sửa và xóa task, để danh sách luôn phản ánh đúng việc cần làm.
- **US-03**: Là người dùng, tôi muốn đánh dấu task hoàn thành và vẫn xem lại được task đã xong, để có cảm giác tiến bộ.
- **US-04**: Là người dùng, tôi muốn kéo thả để sắp xếp thứ tự task theo ý mình, và thứ tự đó được nhớ, để task quan trọng nhất luôn ở trên cùng.
- **US-05**: Là người dùng dùng bàn phím, tôi muốn sắp xếp lại task mà không cần chuột, để không bị loại trừ khỏi tính năng kéo thả.

### Nhóm Focus (F2, F5)

- **US-06**: Là người dùng, tôi muốn bắt đầu một phiên tập trung bằng cách chọn một task và nhấn bắt đầu, để mọi phút tập trung đều gắn với một việc cụ thể.
- **US-07**: Là người dùng, tôi muốn chỉnh thời lượng session (mặc định 25 phút) trước khi bắt đầu, để phù hợp với việc ngắn hay dài.
- **US-08**: Là người dùng, khi tôi lỡ rời tab giữa session, tôi muốn thấy cảnh báo rõ ràng khi quay lại, và thời gian rời tab KHÔNG được tính vào thời gian tập trung, để số liệu của tôi trung thực.
- **US-09**: Là người dùng, tôi muốn dừng session giữa chừng và vẫn được ghi nhận phần thời gian đã tập trung thật, để không mất công sức đã bỏ ra.
- **US-10**: Là người dùng, tôi muốn khi session hoàn thành, task được gợi ý đánh dấu xong (nếu tôi đồng ý), để khỏi phải thao tác thừa.

### Nhóm Mục tiêu & Thống kê (F3, F6, F7)

- **US-11**: Là người dùng, tôi muốn đặt mục tiêu số phút tập trung mỗi ngày và thấy thanh tiến độ trực quan cập nhật ngay sau mỗi session, để biết mình đang ở đâu trong ngày.
- **US-12**: Là người dùng, tôi muốn thấy hôm nay đã tập trung bao nhiêu phút, bao nhiêu session, và streak bao nhiêu ngày liên tiếp, để duy trì động lực.
- **US-13**: Là người dùng, tôi muốn cuối tuần xem lại biểu đồ thời gian tập trung theo ngày và đọc 1 đến 2 câu nhận xét dựa trên dữ liệu thật của mình (ví dụ "Bạn tập trung tốt nhất vào buổi sáng"), để điều chỉnh thói quen tuần sau.

### Nhóm Gợi ý (F8)

- **US-14**: Là người dùng, tôi muốn một nút "Gợi ý task ưu tiên hôm nay" cho ra task phù hợp nhất lúc này, kèm lý do ngắn gọn dễ hiểu, để không mất thời gian phân vân.
- **US-15**: Là người dùng lâu năm, tôi muốn gợi ý ngày càng khớp với thói quen của tôi (giờ hay tập trung, loại task hay chọn), mà không cần cấu hình gì thêm.

### Nhóm Nền tảng

- **US-16**: Là người dùng, tôi muốn đăng nhập bằng email (không cần mật khẩu) và dữ liệu của tôi đồng bộ trên mọi thiết bị, để đổi máy vẫn tiếp tục được.
- **US-17**: Là người dùng Việt Nam, tôi muốn chuyển giao diện giữa Tiếng Việt và English, để dùng ngôn ngữ mình thấy thoải mái nhất.

---

## 5. Danh sách tính năng đầy đủ + tiêu chí chấp nhận

### F1. Quản lý task hàng ngày

- Thêm, sửa (inline), xóa (có xác nhận vì không hoàn tác được), đánh dấu hoàn thành / bỏ hoàn thành task.
- Thuộc tính task: tiêu đề (bắt buộc, tối đa 200 ký tự), mức ưu tiên (High / Medium / Low), deadline (tùy chọn, dạng ngày).
- Task hoàn thành chuyển xuống nhóm riêng "Đã xong", giữ lại để thống kê, không xóa khỏi DB.
- **AC-F1-1**: Tạo task chỉ với tiêu đề là đủ; priority mặc định Medium, deadline rỗng.
- **AC-F1-2**: Sửa tiêu đề/priority/deadline phản ánh ngay trên UI và lưu vào DB.
- **AC-F1-3**: Xóa task hỏi xác nhận, nêu rõ hệ quả (lịch sử session vẫn giữ tên task).
- **AC-F1-4**: Danh sách có 3 trạng thái hiển thị đầy đủ: rỗng (hướng dẫn tạo task đầu tiên), đang tải, lỗi (có nút thử lại).

### F2. Focus Session (Pomodoro)

- Đồng hồ đếm ngược hiển thị dạng mm:ss, cập nhật mượt, chính xác theo thời gian thực (tính từ timestamp, không đếm setInterval).
- Bắt buộc chọn task trước khi bắt đầu. Danh sách chọn task ưu tiên task High trước (liên kết F4).
- Thời lượng session: mặc định 25 phút, chỉnh được trong khoảng 5 đến 120 phút, nhớ cho lần sau.
- Ghi nhận chính xác: `started_at`, `ended_at`, `actual_focus_seconds` (đã trừ thời gian rời tab, xem F5), `planned_minutes`, lý do kết thúc (`completed` / `stopped_early`).
- Khi hết giờ: âm thanh báo nhẹ + tiêu đề tab nhấp nháy + đề xuất đánh dấu task hoàn thành.
- Session đang chạy phải sống sót qua refresh trang (khôi phục từ DB + timestamp).
- **AC-F2-1**: Không chọn task thì không bắt đầu được session.
- **AC-F2-2**: Refresh trang giữa session, đồng hồ quay lại đúng thời điểm còn lại (sai số dưới 2 giây).
- **AC-F2-3**: Kết thúc session ghi đúng `actual_focus_seconds` = thời gian chạy trừ thời gian rời tab.
- **AC-F2-4**: Hai session không bao giờ chạy chồng nhau.

### F3. Daily Goal

- Người dùng đặt mục tiêu phút tập trung/ngày (mặc định 120, chỉnh được trong cài đặt, khoảng 15 đến 960).
- Thanh progress bar trực quan trên màn hình chính: phút hiện tại / mục tiêu, % và trạng thái đạt (đổi diện mạo khi đạt 100%).
- **AC-F3-1**: Progress cập nhật ngay sau khi một session kết thúc, không cần reload.
- **AC-F3-2**: Đổi mục tiêu trong cài đặt phản ánh ngay lên progress bar.

### F4. Task Prioritization (kéo thả + đề xuất High trước)

- Kéo thả sắp xếp thứ tự task trong danh sách; thứ tự lưu bền vững (fractional position).
- Có phương án bàn phím tương đương kéo thả (di chuyển lên/xuống bằng phím), theo chuẩn WCAG 2.5.1/2.5.7.
- Khi mở màn chọn task cho Focus Session: task High hiển thị trước, sau đó theo thứ tự kéo thả của người dùng.
- **AC-F4-1**: Kéo thả đổi thứ tự, reload trang vẫn giữ nguyên thứ tự.
- **AC-F4-2**: Toàn bộ thao tác sắp xếp làm được bằng bàn phím.
- **AC-F4-3**: Màn chọn task luôn xếp task High (chưa xong) lên đầu.

### F5. Focus Mode nâng cao (cảnh báo rời tab)

- Trong session đang chạy: dùng Page Visibility API phát hiện rời tab (`visibilitychange`).
- Khi quay lại tab: hiện cảnh báo rõ ràng (modal/banner) nêu số thời gian vừa rời, thông báo rằng khoảng đó không tính vào thời gian tập trung.
- Chỉ cảnh báo, không chặn website, không khoá tab, không phán xét ngoài thông báo trung thực.
- Tiêu đề tab luôn hiển thị đồng hồ đếm ngược để người dùng thấy khi lướt tab bar.
- **AC-F5-1**: Rời tab 30 giây giữa session, quay lại thấy cảnh báo nêu đúng khoảng thời gian (sai số dưới 2 giây).
- **AC-F5-2**: `actual_focus_seconds` trừ đúng tổng thời gian tab ẩn.
- **AC-F5-3**: Không có session đang chạy thì không có cảnh báo nào xuất hiện.

### F6. Thống kê hôm nay + Streak

- Hiển thị: tổng phút tập trung hôm nay, số session hoàn thành hôm nay, streak (số ngày liên tiếp có ít nhất 1 session `completed`).
- Streak tính theo ngày local của người dùng; qua ngày mới chưa có session thì streak hiển thị của chuỗi trước đó (không bị reset về 0 ngay trong ngày).
- **AC-F6-1**: Số liệu hôm nay khớp với tổng các session trong ngày (theo timezone trình duyệt).
- **AC-F6-2**: Streak chỉ tăng khi có session `completed`; session `stopped_early` không tính streak.
- **AC-F6-3**: Ngày mới bắt đầu (chưa focus), streak vẫn hiển thị số ngày liên tiếp tính đến hôm qua.

### F7. Weekly Review

- Màn hình review tuần: tổng phút, tổng session, trung bình phút/ngày, so sánh với tuần trước (tăng/giảm %).
- Biểu đồ cột (bar chart) thời gian tập trung 7 ngày của tuần đang xem; xem được tuần trước đó (điều hướng tuần).
- 1 đến 2 câu insight tự động sinh từ dữ liệu thật: buổi tập trung tốt nhất (sáng/chiều/tối/đêm theo tổng phút 4 tuần gần nhất), ngày trong tuần tốt nhất, xu hướng so với tuần trước. Không có đủ dữ liệu thì nói thẳng, không bịa.
- **AC-F7-1**: Biểu đồ khớp dữ liệu session từng ngày; ngày không có session hiển thị 0 rõ ràng.
- **AC-F7-2**: Mọi câu insight đều truy được về dữ liệu thật; dưới 3 session trong 4 tuần thì hiển thị trạng thái "chưa đủ dữ liệu".
- **AC-F7-3**: Điều hướng về tuần trước và quay lại tuần hiện tại hoạt động đúng.

### F8. Gợi ý task thông minh

- Nút "Gợi ý task ưu tiên hôm nay" trên màn hình chính. Kết quả: tối đa 3 task gợi ý, mỗi task kèm 1 câu lý do ngắn bằng ngôn ngữ tự nhiên (không thuật ngữ kỹ thuật), nút "Bắt đầu focus" ngay trên từng gợi ý.
- Cơ chế 2 lớp:
  - **Lớp luật tĩnh (cold start, luôn có)**: điểm từ priority (High > Medium > Low), độ gần deadline (quá hạn, hôm nay, 1 đến 2 ngày tới), tuổi task.
  - **Lớp học hành vi nhẹ (tự tăng dần theo dữ liệu)**: từ lịch sử session 28 ngày gần nhất, học (a) khung giờ trong ngày người dùng hay tập trung nhất, (b) task nào có momentum (được focus gần đây, tỉ lệ hoàn thành session cao), (c) task nào hay bị bỏ dở. Trọng số lớp học tăng dần từ 0 theo số session tích lũy (dưới 10 session thì gần như chỉ dùng luật tĩnh).
- Người dùng KHÔNG cần biết cơ chế là gì; không dùng chữ "AI", "mô hình", "machine learning" trong UI.
- **AC-F8-1**: Chưa có session nào thì gợi ý thuần theo luật tĩnh, vẫn hoạt động đúng.
- **AC-F8-2**: Mỗi gợi ý có lý do tham chiếu dữ liệu thật (priority, deadline, hoặc thói quen đã học).
- **AC-F8-3**: Không gợi ý task đã hoàn thành; khi không còn task nào, hiển thị trạng thái rỗng phù hợp.

### F9 (nền tảng, bắt buộc để F1-F8 chạy được)

- Đăng nhập email magic link qua Supabase Auth; đăng xuất; route bảo vệ (chưa đăng nhập chuyển về trang login).
- Cài đặt cá nhân: daily goal, thời lượng session mặc định, ngôn ngữ (VI/EN).
- Song ngữ toàn bộ UI: mọi chuỗi hiển thị (kể cả empty/loading/error states, insight, lý do gợi ý) có bản VI và EN.
- **AC-F9-1**: Email hợp lệ nhận được magic link; click link đăng nhập thành công và vào app.
- **AC-F9-2**: Chuyển ngôn ngữ đổi toàn bộ chuỗi UI ngay lập tức, nhớ lựa chọn cho phiên sau.

---

## 6. Luồng người dùng chính

### 6.1 Lần đầu sử dụng

```
Trang login -> nhập email -> nhận magic link -> click link -> vào app
  -> Màn hình chính (trạng thái rỗng: chưa có task, goal mặc định 120 phút)
  -> Tạo task đầu tiên (ưu tiên + deadline tùy chọn)
  -> (tùy chọn) vào Cài đặt chỉnh goal, thời lượng session, ngôn ngữ
```

### 6.2 Vòng lặp ngày làm việc (luồng cốt lõi)

```
Mở app -> Màn hình chính:
  - Thấy: goal progress hôm nay, streak, số session hôm nay
  - (tùy chọn) Nhấn "Gợi ý task ưu tiên hôm nay" -> chọn 1 trong 3 gợi ý
  -> Bắt đầu Focus Session -> chọn task (High lên đầu) -> chỉnh phút nếu cần -> Start
  -> Màn hình focus tối giản: đồng hồ vòng cung + tên task
  -> [Hết giờ] -> âm thanh + đề xuất đánh dấu task xong -> progress/stats cập nhật
  -> Lặp lại session tiếp theo
```

### 6.3 Luồng xao nhãng (F5)

```
Đang trong session -> chuyển sang tab khác
  -> (tab ẩn: đồng hồ vẫn chạy, nhưng thời gian ẩn được đánh dấu riêng)
  -> Quay lại tab -> Cảnh báo: "Bạn vừa rời tab X phút Y giây. Khoảng này không tính vào thời gian tập trung."
  -> Xác nhận "Tiếp tục tập trung" -> session chạy tiếp
  -> Kết thúc session -> actual_focus_seconds đã trừ thời gian rời tab
```

### 6.4 Luồng cuối tuần

```
Mở app -> tab "Tuần này"
  -> Biểu đồ 7 ngày + tổng quan + so với tuần trước
  -> Đọc 1-2 câu insight (ví dụ: "Bạn tập trung tốt nhất vào buổi sáng")
  -> (tùy chọn) xem lại tuần trước nữa
```

### 6.5 Luồng dọn dẹp task

```
Danh sách task -> kéo thả sắp xếp lại ưu tiên hiển thị
  -> Sửa task lỗi nhập -> Xóa task không còn liên quan (xác nhận)
  -> Đánh dấu xong task đã làm (từ danh sách hoặc sau session)
```

---

## 7. Quyết định thiết kế quan trọng + trade-off

| # | Quyết định | Lựa chọn | Trade-off chấp nhận |
|---|---|---|---|
| D1 | Gọi Supabase trực tiếp từ client, bảo mật bằng Row Level Security | Không viết backend/API layer riêng | Logic phức tạp nằm ở SQL views + client. Đổi lại: ít code hơn, deploy đơn giản, realtime dễ thêm sau này. RLS buộc mọi query đều scoped theo user. |
| D2 | Timer tính từ timestamp (`started_at` + Date.now diff), KHÔNG đếm bằng setInterval | Chính xác, sống sót qua throttle timer khi tab nền | Phức tạp hơn chút ở render loop; bù lại đúng chuẩn "trung thực" của sản phẩm. |
| D3 | Session đang chạy lưu ngay 1 row DB (trạng thái in_progress) khi bắt đầu | Refresh/crash không mất session; actual time tính lại từ timestamps | Mỗi session tốn 1 write sớm; bù lại không bao giờ mất dữ liệu focus. |
| D4 | Thời gian rời tab được TRỪ khỏi focus time, hiển thị riêng | Đây là giá trị cốt lõi "trung thực", không thương lượng | Người dùng có thể thấy số thấp hơn kỳ vọng; chấp nhận vì đó là sự thật. |
| D5 | Không có nút pause trong session | Đúng yêu cầu gốc, giữ session nhịp ngắn gọn | Ai muốn nghỉ thì dừng sớm (vẫn ghi nhận thời gian thật). |
| D6 | Task xóa là xóa hẳn; session lịch sử giữ snapshot `task_title` | Đơn giản hóa quan hệ dữ liệu, lịch sử không vỡ | Không khôi phục được task đã xóa; UI phải xác nhận rõ trước khi xóa. |
| D7 | Thứ tự task dùng fractional position (số thực), không renumber toàn bộ | Kéo thả 1 item chỉ tốn 1 write | Cần chu kỳ reindex khi độ chính xác cạn (ghi chú trong ARCHITECTURE, không làm ngay). |
| D8 | Gợi ý thông minh chạy client-side, dữ liệu 28 ngày, trọng số học tăng dần | Không cần server compute, minh bạch, test được bằng unit test | Không phải "AI thật"; đúng yêu cầu "cực nhẹ, âm thầm". |
| D9 | i18n tự viết (dictionary type-safe + context), không dùng thư viện i18n nặng | 2 ngôn ngữ, vài trăm chuỗi, thư viện lớn là thừa | Khi thêm ngôn ngữ thứ 3 sẽ phải xem lại; chấp nhận. |
| D10 | Streak và stats tính on-demand từ sessions (query có index), không bảng tổng hợp sẵn | Một nguồn sự thật duy nhất, không drift | Quy mô cá nhân (vài nghìn session/năm) query vẫn tức thì; nếu vượt quy mô sẽ thêm view vật lý sau. |
| D11 | Biểu đồ tuần dùng Recharts | Component sẵn, đủ đẹp khi tùy chỉnh theo design system, a11y ổn | Bundle nặng hơn tự vẽ SVG; chấp nhận vì tốc độ phát triển. |
| D12 | Kéo thả dùng dnd-kit | Hỗ trợ bàn phím + touch sẵn, đúng yêu cầu a11y | Nặng hơn HTML5 DnD thuần; chấp nhận. |
| D13 | localStorage CHỈ là cache phụ (locale mirror, nháp input), KHÔNG là nguồn dữ liệu | Đúng yêu cầu cứng của chủ project | Mọi dữ liệu nghiệp vụ đọc/ghi Supabase. |

---

## 8. Tech stack đề xuất (kèm lý do)

| Tầng | Chọn | Lý do chọn |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript strict** | Deploy Vercel 1 bước ra link public (yêu cầu cứng); RSC giảm JS phía client; `next/font` tối ưu font tự host (chuẩn taste-skill); TypeScript strict bắt lỗi sớm, hỗ trợ bàn giao. |
| Styling | **Tailwind CSS v4** (design tokens qua CSS variables) | Nhanh, nhất quán theo design tokens; dark mode bằng `dark:` variant một chiến lược duy nhất (chuẩn ui-design). |
| Database + Auth | **Supabase** (Postgres + Auth magic link + RLS) | Đáp ứng yêu cầu "database thật"; Postgres quan hệ chuẩn, SQL views cho stats; magic link không cần password; free tier đủ cho app cá nhân; RLS = bảo mật khai báo, test được. |
| Server state | **TanStack Query** | Cache, invalidate sau mutation, retry, trạng thái loading/error thống nhất (phục vụ R-27: đủ 3 trạng thái UI). |
| Client state | **React state + 1 Zustand store nhỏ cho timer** | Timer là state toàn cục duy nhất thật sự; mọi thứ khác ở component state (chuẩn codebase-architecture: mỗi data một owner). |
| Kéo thả | **dnd-kit** | Keyboard + touch + screen reader announcements sẵn có (WCAG 2.5.x). |
| Biểu đồ | **Recharts** | Bar chart tuần đủ dùng, tùy biến theo tokens, SSR-friendly. |
| Icons | **@phosphor-icons/react** | taste-skill ưu tiên; KHÔNG dùng Lucide (dấu hiệu AI-slop R-04). |
| Font | **Be Vietnam Pro** (next/font, subset vietnamese + latin) | Được thiết kế riêng cho tiếng Việt, hiển thị dấu hoàn hảo cho UI song ngữ; KHÔNG phải Inter (bị cấm); timer dùng `font-variant-numeric: tabular-nums` để số không nhảy. |
| Test | **Vitest + Testing Library** | Unit test domain logic: streak, gợi ý, insight, time math. |
| Deploy | **Vercel** (link GitHub repo, auto-deploy) | Ra link public ổn định, miễn phí, HTTPS, preview mỗi commit. |

Lý do tổng thể: stack này có đường deploy ngắn nhất từ code tới link public ổn định trên PC, đồng thời giữ ranh giới UI / business logic / data rõ ràng để bàn giao sạch.

---

## 9. Cách lưu trữ dữ liệu

### 9.1 Nguồn dữ liệu chính: Supabase Postgres (cloud)

Sơ đồ quan hệ (chi tiết SQL nằm ở ARCHITECTURE.md):

```
auth.users (Supabase quản lý)
    |
profiles            - id (PK, = auth.users.id), display_name, daily_goal_minutes (default 120),
                      preferred_session_minutes (default 25), locale ('vi'|'en', default 'vi'), created_at
    |
tasks               - id uuid PK, user_id FK, title text, priority ('high'|'medium'|'low'),
                      deadline date NULL, completed_at timestamptz NULL, position double precision,
                      created_at, updated_at
    |
focus_sessions      - id uuid PK, user_id FK, task_id FK NULL ON DELETE SET NULL,
                      task_title text (snapshot), planned_minutes int, started_at timestamptz,
                      ended_at timestamptz NULL, actual_focus_seconds int NULL,
                      distraction_seconds int default 0, ended_reason
                      ('in_progress'|'completed'|'stopped_early'), created_at
```

Nguyên tắc:

- **RLS bật trên mọi bảng**: policy `user_id = auth.uid()` cho select/insert/update/delete. Không có service key ở client.
- **Một nguồn sự thật**: stats ngày, streak, weekly review đều tính từ `focus_sessions` + `tasks` (query có index trên `(user_id, started_at)`), không bảng tổng hợp trùng lặp (D10).
- **Snapshot tên task** trong session để lịch sử không vỡ khi task bị xóa (D6).
- **Không gì ngoài các bảng trên**: không bảng streak, không bảng cache gợi ý.

### 9.2 Lưu trữ phía client (chỉ cache phụ, KHÔNG phải nguồn)

| Dữ liệu | Nơi | Lý do được phép |
|---|---|---|
| Locale đang chọn (mirror của profiles.locale) | localStorage | Hiển thị đúng ngôn ngữ ngay frame đầu, tránh flash |
| Nháp input tạo task | sessionStorage | Không mất chữ đang gõ khi điều hướng nhầm |

---

## 10. Cấu trúc thư mục đề xuất (feature-based)

```
D:\pomo\
  SPEC.md                  # file này (đóng băng sau xác nhận)
  ARCHITECTURE.md          # viết sau khi SPEC được duyệt
  PROGRESS.md              # cập nhật sau mỗi slice
  HANDOFF.md               # bàn giao cuối
  DESIGN.md                # design direction cho UI (theo antislop R-37)
  docs/
    project.md             # context cho SDD (theo sdd-init)
  supabase/
    migrations/            # SQL migrations, source of truth của schema
  src/
    app/                   # Next.js routes ONLY (page, layout, route handlers)
      (app)/               # nhóm route cần auth: today, focus, review, settings
      login/
    modules/               # business logic theo feature, mỗi module:
      auth/                #   api.ts (data access), hooks, components, types.ts
      tasks/
      focus/               # timer engine, visibility tracking, session lifecycle
      goal/
      stats/               # today stats, streak
      review/              # weekly report + insights
      suggest/             # scoring engine (rules + behavior)
      settings/
      i18n/                # dictionaries vi.ts, en.ts, context
    design-system/         # tokens.css, primitives (Button, Card, Dialog, ...)
    lib/                   # supabase client, time/format utils (pure functions)
  tests/                   # vitest unit tests theo module
```

Ranh giới bắt buộc: `app/` chỉ routing; `modules/` chứa logic; `lib/` chỉ pure functions; `design-system/` chỉ UI primitives không biết business. Không import ngược từ `lib`/`design-system` lên `modules`.

---

## 11. Cách triển khai để app chạy trên PC (link public, không localhost)

1. **Supabase**: tạo project trên supabase.com (region gần VN nhất có thể, Singapore). Chạy migrations trong `supabase/migrations/` qua SQL Editor hoặc Supabase CLI. Bật Email provider (magic link); cấu hình Site URL + Redirect URLs trỏ về domain Vercel.
2. **GitHub**: push repo `pomo` lên GitHub.
3. **Vercel**: import repo, thêm env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`), deploy. Kết quả: `https://<app>.vercel.app` public, mở được trên mọi PC có trình duyệt, HTTPS mặc định.
4. **Vận hành**: mọi commit lên `main` auto-deploy. Rollback = redeploy bản trước trong Vercel dashboard.
5. **Giới hạn đã biết**: SMTP mặc định của Supabase giới hạn số email magic link/giờ (đủ cho dùng cá nhân; nếu vượt thì gắn custom SMTP, ghi trong HANDOFF).
6. **Tuỳ chọn (không bắt buộc, phục vụ "chạy trên PC")**: PWA manifest tối thiểu để "Install app" lên taskbar/desktop từ Chrome/Edge. Không thêm service worker/offline sync ở giai đoạn này.

---

## 12. Yêu cầu phi chức năng (NFR)

- **Hiệu năng**: LCP < 2.5s trên mạng phổ thông; tương tác (thêm task, bắt đầu session) phản hồi dưới 100ms phía client.
- **Truy cập (a11y)**: WCAG 2.2 AA. Contrast text >= 4.5:1, target chạm >= 44px, toàn bộ flow dùng được bằng bàn phím (kể cả sắp xếp task), focus indicator rõ ràng cả 2 theme.
- **Responsive**: mobile-first, bố cục có trạng thái riêng cho mobile/tablet/desktop, không overflow ngang ở 320px.
- **Bảo mật**: RLS mọi bảng; không secret ở client; validate mọi input (độ dài tiêu đề, khoảng phút hợp lệ).
- **Độ tin cậy dữ liệu**: mọi con số hiển thị truy được về rows thật; không số liệu mẫu, không placeholder giả dạng thật.
- **Theme**: light/dark đầy đủ, cả hai đều phải hoàn chỉnh (R-34), theo `prefers-color-scheme` + toggle thủ công.

---

## 13. Định hướng thiết kế (tóm tắt, chi tiết ở DESIGN.md)

- **Design Read**: product app (công cụ tập trung) cho người làm việc trí óc, ngôn ngữ "calm productivity" (tham chiếu Linear/Things 3 ở mức cảm hứng, không sao chép), dials antislop **ENERGY 1 / RHYTHM 2 / MOTION 1**; taste dials **VARIANCE 5 / MOTION 3 / DENSITY 5**.
- **Identity motif**: vòng cung Pomodoro (ring tiến độ), xuất hiện nhất quán ở timer, goal progress, và logo dạng text.
- **Palette**: nền "giấy ấm" (off-white ấm, không trắng tinh), chữ mực nâu đậm, MỘT accent duy nhất màu cà chua/terracotta (gợi gốc Pomodoro = cà chua; đây là lý do của accent, R-31). Dark mode: than ấm, accent giữ nguyên nhận diện.
- **Type**: Be Vietnam Pro (lý do ở mục 8), scale khiêm tốn, số timer dùng tabular-nums.
- **Không**: Inter, gradient tím, 3 card giống nhau, eyebrow lạm dụng, glassmorphism tràn lan, emoji trang trí, em dash trong UI.

---

## 14. Quy trình thực thi & bàn giao

1. SPEC.md (file này) → chờ xác nhận.
2. ARCHITECTURE.md → schema SQL chi tiết, module boundaries, data flow, quyết định kỹ thuật.
3. Implement theo **vertical slices** (mỗi slice chạy end-to-end được):

| Slice | Nội dung | Kết quả kiểm chứng |
|---|---|---|
| S0 | Scaffold Next.js + Tailwind + Supabase + migration + auth magic link + shell layout + i18n khung | Đăng nhập được, thấy màn hình rỗng có thiết kế |
| S1 | Tasks CRUD + priority + kéo thả | F1 + F4 hoàn chỉnh |
| S2 | Focus session engine + honest timing + cảnh báo rời tab | F2 + F5 hoàn chỉnh |
| S3 | Daily goal + stats hôm nay + streak | F3 + F6 hoàn chỉnh |
| S4 | Weekly review + chart + insights | F7 hoàn chỉnh |
| S5 | Gợi ý task thông minh | F8 hoàn chỉnh |
| S6 | Deploy Vercel + verification (ui-verification probes, click-through R-35, Delivery Gate) | Link public chạy ổn định |

4. Sau mỗi slice: cập nhật PROGRESS.md ngay (xong/dang dở/còn lại/quyết định/hướng dẫn tiếp tục).
5. Hết context hoặc hết quota: hoàn thiện HANDOFF.md TRƯỚC mọi việc khác.
6. Trước khi bàn giao cuối: chạy Delivery Gate của antislop + review theo sdd-review.

---

## 15. Câu hỏi mở (không chặn, quyết định khi implement nếu không có ý kiến)

| # | Câu hỏi | Hướng mặc định nếu không có ý kiến |
|---|---|---|
| OQ-1 | Âm thanh báo hết giờ: có cho phép tắt không? | Có toggle trong Cài đặt, mặc định bật. |
| OQ-2 | Màn hình chính mặc định sau login là gì? | Màn "Hôm nay" (goal + tasks + nút bắt đầu focus). |
| OQ-3 | Giới hạn số task hiển thị? | Không giới hạn cứng; danh sách ảo hóa khi > 100 task. |
| OQ-4 | Múi giờ tính "hôm nay"/streak? | Theo timezone của trình duyệt tại thời điểm query. |

---

## Revision History

| Ngày | Thay đổi |
|---|---|
| 2026-10-04 | Bản nháp đầu tiên, chờ xác nhận |
