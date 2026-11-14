# Image pipeline

Each recipe uses five independent WebP sizes (24, 320, 640, 960 and 1440 px wide) in assets/responsive/. The 24 px preview appears immediately; the JavaScript loader measures displayed dimensions, DPR and viewport zoom, loads the smallest sufficient tier and decodes it before swapping. Displayed resolution never decreases.

This pipeline is required for all future recipe imagery. Implementation: progressive-images.mjs.

## Generator

Place original photos in assets/originals/ using recipe slugs as filenames. In PowerShell, working directory: repository root, run:

    py -3 -m pip install Pillow
    py -3 scripts/build_images.py

Commit all five resulting WebP files only after recipe approval. Run npm test before publishing.

## Historical package

The earlier package could not be identified in the accessible repositories or prior conversation search. This self-contained implementation follows the requested Python generation and JavaScript zoom-responsive loading architecture.
