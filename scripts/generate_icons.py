import math
import os
from PIL import Image, ImageDraw

def create_crisp_p_dot_icon(size=1024):
    """
    Tạo biểu tượng 'P.' sắc nét, dấu chấm là hình vuông cam #C74A16.
    Nền trong suốt hoàn toàn (transparent), chữ P to đậm và dấu vuông cam rõ ràng,
    căn giữa khung hình để hiển thị cực kỳ sắc nét trên Windows Taskbar, PWA và Favicon.
    """
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 512.0

    # Màu mực đen mộc #23201C
    ink = (35, 32, 28, 255)
    # Màu cam accent #C74A16
    orange = (199, 74, 22, 255)

    # Shift nhẹ sang trái 14px để bù trừ cho dấu chấm vuông bên phải
    dx = -14 * scale

    # Kích thước chữ P lớn chiếm khoảng 75% chiều cao canvas
    # Stem: x: 120 to 196 (width 76), y: 70 to 442 (height 372)
    x0 = int(120 * scale + dx)
    x1 = int(196 * scale + dx)
    y0 = int(70 * scale)
    y1 = int(442 * scale)
    draw.rectangle([x0, y0, x1, y1], fill=ink)

    # Top Bar: x: 196 to 296, y: 70 to 146
    x2 = int(296 * scale + dx)
    y_mid_top = int(146 * scale)
    draw.rectangle([x1, y0, x2, y_mid_top], fill=ink)

    # Middle Bar: x: 196 to 296, y: 236 to 312
    y_mid_bot = int(236 * scale)
    y_bowl_bot = int(312 * scale)
    draw.rectangle([x1, y_mid_bot, x2, y_bowl_bot], fill=ink)

    # Outer Bowl Curve of P: center at (296, 191), radius 121
    bowl_cx = int(296 * scale + dx)
    bowl_cy = int(191 * scale)
    bowl_r = int(121 * scale)
    draw.pieslice([bowl_cx - bowl_r, bowl_cy - bowl_r, bowl_cx + bowl_r, bowl_cy + bowl_r], start=-90, end=90, fill=ink)

    # Inner Hole (counter) of P (transparent cutout using RGBA 0)
    inner_r = int(45 * scale)
    mask = Image.new("L", (size, size), 255)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rectangle([x1, y_mid_top, x2, y_mid_bot], fill=0)
    mask_draw.pieslice([bowl_cx - inner_r, bowl_cy - inner_r, bowl_cx + inner_r, bowl_cy + inner_r], start=-90, end=90, fill=0)

    # Áp mask cắt thủng lỗ chữ P
    img.putalpha(Image.composite(img.getchannel("A"), mask, mask))

    # Vẽ dấu chấm hình vuông cam #C74A16 (size 60x60 scale, bo nhẹ góc)
    sq_x0 = int(362 * scale + dx)
    sq_y0 = int(380 * scale)
    sq_size = int(60 * scale)
    draw = ImageDraw.Draw(img)
    # rounded rectangle with small radius
    draw.rounded_rectangle([sq_x0, sq_y0, sq_x0 + sq_size, sq_y0 + sq_size], radius=int(4 * scale), fill=orange)

    return img

def main():
    hi_res = create_crisp_p_dot_icon(1024)

    # 1. Lưu D:/pomo/public/pomo.png
    hi_res.resize((512, 512), Image.Resampling.LANCZOS).save("D:/pomo/public/pomo.png", "PNG")
    print("Updated D:/pomo/public/pomo.png")

    # Lưu thêm icon-192.png và icon-512.png cho PWA
    hi_res.resize((192, 192), Image.Resampling.LANCZOS).save("D:/pomo/public/icon-192.png", "PNG")
    hi_res.resize((512, 512), Image.Resampling.LANCZOS).save("D:/pomo/public/icon-512.png", "PNG")
    print("Updated icon-192.png and icon-512.png")

    # 2. Lưu D:/pomo/public/pomo.ico với đầy đủ kích thước từ siêu nhỏ tới siêu nét (16, 24, 32, 48, 64, 128, 256)
    ico_sizes = [(16, 16), (20, 20), (24, 24), (32, 32), (40, 40), (48, 48), (64, 64), (128, 128), (256, 256)]
    hi_res.save("D:/pomo/public/pomo.ico", format="ICO", sizes=ico_sizes)
    print("Updated D:/pomo/public/pomo.ico")

    # 3. Cập nhật shortcut ngoài desktop nếu có
    try:
        import win32com.client
        shell = win32com.client.Dispatch("WScript.Shell")
        desktop = shell.SpecialFolders("Desktop")
        shortcut_path = os.path.join(desktop, "Pomo.lnk")
        if os.path.exists(shortcut_path):
            shortcut = shell.CreateShortcut(shortcut_path)
            shortcut.IconLocation = "D:\\pomo\\public\\pomo.ico,0"
            shortcut.Save()
            print("Desktop shortcut icon updated!")
    except Exception as e:
        print("Note on shortcut:", e)

if __name__ == "__main__":
    main()
