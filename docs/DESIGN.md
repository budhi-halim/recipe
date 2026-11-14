# Material-led UI

The design integrates the original **Frontend Toolkit 1.0.0** from `budhi-halim/frontend-toolkit` (source blob `d6b7ef04573f22464632064ea5e91b8af241f3b7`).

The toolkit's actual `ft-surface` elements own the visual materials, with ordinary CSS supplying accessible fallbacks:

- **Header:** linen
- **Homepage masthead:** walnut; a second botanical linen panel
- **Recipe cards:** parchment paper
- **Recipe detail title panel:** cotton paper
- **Cooking-time summary:** slate
- **Ingredient workspace:** linen
- **Scaling controls:** walnut
- **Method:** parchment paper

Do not replace these materials with photos of wood, fabric or paper. Those are materially different from the renderer. Retain visual depth, hierarchy and responsive layout. The existing dish images use `progressive-images.mjs` and the responsive WebP tiers. Future recipe images must use the same system.

## Theming

`app.js` updates each `ft-surface[data-mat]` color attribute after page render and whenever the light/dark preference changes. Both themes are required to remain readable. The toolkit is served locally at `assets/vendor/frontend-toolkit.js`, so the site doesn't rely on another GitHub Pages site for material rendering.

## Validation

Run `npm test` to validate recipes, scaling and the progressive-image files. Verify small and large screen layouts and both color schemes after changes. Never publish recipes that have not been explicitly approved by the owner.
