# Image pipeline

Each recipe image must be available at 24, 320, 640, 960 and 1440 px in assets/responsive/. The progressive loader shows the 24 px preview immediately and upgrades based on displayed size and zoom without downgrading.

## Original photos

Place originals in assets/originals/<recipe-slug>.png (or JPG/WebP). In PowerShell, working directory repository root, run:

    py -3 -m pip install Pillow
    py -3 scripts/build_images.py

Commit all five resulting WebP files after approval.

## Sushi collection

Each approved sushi entry has an individual deterministic illustrated image with a unique composition derived from its visual data. These are illustrations, not photographs. The source generator scripts/build_sushi_images.py uses Pillow only, without external image hosts or keys. GitHub Actions produces and commits all five responsive WebP tiers. When a photograph replaces an illustration, remove the recipe's visual metadata to stop automatic illustration regeneration.
