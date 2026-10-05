import math
from PIL import Image, ImageDraw

def create_circular_pomo_icon(size=1024):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    scale = size / 512.0
    cx, cy = size / 2.0, size / 2.0

    # 1. Background Circular Warm Paper (#FAF7F1)
    paper = (250, 247, 241, 255)
    border_color = (232, 224, 212, 255) # #E8E0D4
    r_outer = 248 * scale
    draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], fill=paper, outline=border_color, width=int(12 * scale))

    # 2. Ring Motif (dashed circular dial in Terracotta #C74A16, 25% opacity)
    r_ring = 204 * scale
    num_dashes = 36
    stroke_w = int(14 * scale)
    dash_color = (199, 74, 22, 64)  # ~25% opacity

    for i in range(num_dashes):
        if i % 2 == 0:
            angle_start = (i / num_dashes) * 360
            angle_end = ((i + 0.65) / num_dashes) * 360
            draw.arc([cx - r_ring, cy - r_ring, cx + r_ring, cy + r_ring], start=angle_start, end=angle_end, fill=dash_color, width=stroke_w)

    # 3. Letter P in Ink (#23201C)
    ink = (35, 32, 28, 255)

    # Stem: x: 168 to 228 (width 60), y: 132 to 380 (height 248)
    draw.rectangle([int(168 * scale), int(132 * scale), int(228 * scale), int(380 * scale)], fill=ink)

    # Top Bar: x: 228 to 284, y: 132 to 186
    draw.rectangle([int(228 * scale), int(132 * scale), int(284 * scale), int(186 * scale)], fill=ink)

    # Middle Bar: x: 228 to 284, y: 266 to 320
    draw.rectangle([int(228 * scale), int(266 * scale), int(284 * scale), int(320 * scale)], fill=ink)

    # Outer Bowl Curve of P: center at (284, 226), radius 94
    bowl_cx = int(284 * scale)
    bowl_cy = int(226 * scale)
    bowl_r = int(94 * scale)
    draw.pieslice([bowl_cx - bowl_r, bowl_cy - bowl_r, bowl_cx + bowl_r, bowl_cy + bowl_r], start=-90, end=90, fill=ink)

    # Inner Hole (counter) of P in paper color (#FAF7F1)
    inner_r = int(40 * scale)
    draw.rectangle([int(228 * scale), int(186 * scale), int(284 * scale), int(266 * scale)], fill=paper)
    draw.pieslice([bowl_cx - inner_r, bowl_cy - inner_r, bowl_cx + inner_r, bowl_cy + inner_r], start=-90, end=90, fill=paper)

    # 4. Accent Dot . in Terracotta Pomodoro (#C74A16)
    terracotta = (199, 74, 22, 255)
    dot_cx = int(360 * scale)
    dot_cy = int(360 * scale)
    dot_r = int(26 * scale)
    draw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=terracotta)

    return img

def main():
    hi_res = create_circular_pomo_icon(1024)

    # Save 512x512 PNG
    img_512 = hi_res.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save("D:/pomo/public/pomo.png", "PNG")
    print("Saved D:/pomo/public/pomo.png")

    # Save multi-size ICO for Windows
    ico_sizes = [(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    hi_res.save("D:/pomo/public/pomo.ico", format="ICO", sizes=ico_sizes)
    print("Saved D:/pomo/public/pomo.ico")

if __name__ == "__main__":
    main()
