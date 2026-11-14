#!/usr/bin/env python3
"""Build responsive WebP images for approved recipes.

From the repository root, in PowerShell:
    py -3 -m pip install Pillow
    py -3 scripts/build_images.py
Source images: assets/originals/<recipe-slug>.png (or jpg/webp).
"""
from pathlib import Path
import argparse
from PIL import Image, ImageOps

WIDTHS = (24, 320, 640, 960, 1440)
EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp")

def build_one(source: Path, destination: Path, slug: str):
    if not slug or not all(c.islower() or c.isdigit() or c == "-" for c in slug):
        raise ValueError("Invalid recipe slug")
    destination.mkdir(parents=True, exist_ok=True)
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for width in WIDTHS:
            height = max(1, round(image.height * width / image.width))
            path = destination / f"{slug}-{width}.webp"
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                path, format="WEBP", quality=34 if width == 24 else 77, method=6)
            print(path)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=Path("assets/originals"))
    parser.add_argument("--output", type=Path, default=Path("assets/responsive"))
    args = parser.parse_args()
    if not args.source.is_dir():
        parser.error(f"Source folder missing: {args.source}")
    files = sorted(p for p in args.source.iterdir() if p.suffix.lower() in EXTENSIONS)
    if not files:
        parser.error("No source images found")
    for source in files:
        build_one(source, args.output, source.stem)

if __name__ == "__main__":
    main()
