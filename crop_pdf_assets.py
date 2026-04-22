"""Crop photo assets from LUXUS training PDF pages.

Source images are 3000x1688. Crops are defined below with
(page_number, output_filename, (left, top, right, bottom)) in ORIGINAL 3000x1688 coords.

Long edge is resized down to 1600px for each output.
"""
from pathlib import Path
from PIL import Image

SRC = Path(r"G:/我的雲端硬碟/secondbrain/專案/附件/AI選材教學駕駛艙/pages")
DST = Path(r"C:/projects/ai-material-cockpit/public/pdf-assets")
DST.mkdir(parents=True, exist_ok=True)

MAX_LONG = 1600

# All boxes in the ORIGINAL 3000x1688 space.
# Derived from thumbnail inspection (thumb 1800x1013, scale factor = 3000/1800 = 1.6667).
CROPS = [
    # page 01 — Hero cover: left living room (behind title), avoid title block bottom-left.
    # Living room portion roughly x: 0..1700, y: 0..1000 (avoid title at bottom-left).
    (1, "hero-living-room.png", (0, 0, 1800, 1000)),
    # page 01 — iPhone with orange wall preview held by hand (right portion)
    # Exclude bottom footer (company info) by ending above y=1460.
    (1, "hero-phone-orange-wall.png", (1650, 0, 3000, 1460)),

    # page 03 — bedroom night scene (left side); tighten to avoid right product thumbnail strip
    (3, "space-bedroom-lamp.png", (0, 0, 1280, 1688)),

    # page 05 — left: traditional swatches scattered (pain point)
    # Crop lower half to exclude "傳統模式 / 依賴想像" text overlay at top-left.
    (5, "pain-traditional-swatches.png", (0, 720, 1500, 1688)),
    # page 05 — right: iPad showing interior w/ color palette (AI mode)
    # Shift down to avoid the "AI 智慧選材" title text at top of this half.
    (5, "compare-ipad-ai-palette.png", (1550, 420, 3000, 1688)),

    # page 06 — iPhone floating over living room w/ sofa + floor swap UI (center it)
    (6, "phone-ui-floor-swap.png", (800, 120, 2200, 1688)),

    # page 09 — "OK" example living room (the photo only, avoid checkmarks & right column text)
    # The photo is on the left portion, checkmark overlays on its right edge.
    (9, "photo-guide-ok-living-room.png", (200, 320, 1550, 1620)),

    # page 10 — three OK empty-room photos (keep all three, they sit in a horizontal strip)
    # The strip occupies roughly y: 180..1500. Keep checkmark badges out of safe area
    (10, "photo-guide-ok-trio.png", (80, 280, 2920, 1550)),

    # page 11 — four NG photos grid (2x2). Crop tight around photos only, shift down to clear title.
    (11, "photo-guide-ng-grid.png", (700, 420, 2350, 1620)),

    # page 14 — LUXUS color palette UI + entryway render (mid + right columns)
    (14, "ui-luxus-palette-entryway.png", (880, 80, 3000, 1688)),

    # page 15 — iPhone + iPad dual mockup with product list UI
    (15, "ui-phone-ipad-product-list.png", (200, 120, 2800, 1400)),

    # page 20 — hand holding iPad with orange wall living room (business visit scene)
    # Crop right-side room area to avoid left speech-bubble overlay and right text card.
    (20, "scene-ipad-orange-living.png", (1100, 0, 2550, 1250)),

    # page 21 — hand holding iPad in "compare mode" split view (Color A/B)
    # Shift down past title and crop before right speech bubble.
    (21, "compare-split-view-ab.png", (300, 260, 2200, 1600)),

    # page 24 — right side: warm modern living room "preset" reference photo
    (24, "space-warm-living-preset.png", (1550, 180, 3000, 1450)),

    # page 25 — iPhone held in hand showing bedroom preview (remote/delayed client scenario)
    (25, "scene-phone-bedroom-remote.png", (250, 250, 1250, 1620)),

    # page 28 — iPad (left) and iPhone (right) dual device scene (colors + Line inquiry)
    (28, "scene-ipad-phone-inquiry.png", (120, 200, 2880, 1500)),

    # page 30 — concrete corridor atmospheric shot (avoid title text at center)
    # title sits roughly mid-screen; grab a clean strip along the top.
    (30, "mood-concrete-corridor.png", (0, 0, 3000, 700)),
]


def resize_long_edge(img: Image.Image, max_long: int) -> Image.Image:
    w, h = img.size
    long_edge = max(w, h)
    if long_edge <= max_long:
        return img
    scale = max_long / long_edge
    new_size = (int(round(w * scale)), int(round(h * scale)))
    return img.resize(new_size, Image.LANCZOS)


def main() -> None:
    print(f"Source: {SRC}")
    print(f"Dest:   {DST}")
    print()
    results = []
    for page_num, fname, box in CROPS:
        src_path = SRC / f"page_{page_num:02d}.png"
        if not src_path.exists():
            print(f"[MISSING] {src_path}")
            continue
        im = Image.open(src_path).convert("RGB")
        cropped = im.crop(box)
        resized = resize_long_edge(cropped, MAX_LONG)
        out_path = DST / fname
        resized.save(out_path, "PNG", optimize=True)
        print(f"page_{page_num:02d} -> {fname:45s}  box={box}  -> {resized.size}")
        results.append((page_num, fname, box, resized.size))
    print()
    print(f"Done. {len(results)} files written to {DST}")


if __name__ == "__main__":
    main()
