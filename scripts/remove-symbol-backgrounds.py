#!/usr/bin/env python3
"""Remove backgrounds from onboarding symbol PNGs."""

from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
SYMBOL_DIRS = [
    ROOT / "public" / "onboarding" / "symbols",
    ROOT / "assets",
]

def process_image(path: Path) -> None:
    data = path.read_bytes()
    result = remove(data)
    img = Image.open(__import__("io").BytesIO(result)).convert("RGBA")
    img.save(path, format="PNG", optimize=True)
    print(f"OK  {path.relative_to(ROOT)}")

def main() -> None:
    seen: set[Path] = set()
    for directory in SYMBOL_DIRS:
        if not directory.exists():
            continue
        for path in sorted(directory.glob("onboarding-symbol-*.png")):
            resolved = path.resolve()
            if resolved in seen:
                continue
            seen.add(resolved)
            process_image(path)

if __name__ == "__main__":
    main()
