# Recipe

A personal recipe library published as a static, mobile-first website. Recipes are written as structured JSON and rendered with an interactive ingredient/serving scaler.

Website (after GitHub Pages is enabled): https://budhi-halim.github.io/recipe/

## Publication rule
New recipes and changes to existing recipes **must not be committed until explicitly approved by the owner**. The initial historical collection was authorized for publication.

## Data
- `data/index.json`: ordered recipe manifest.
- `data/recipes/*.json`: one recipe per file; baseline approximately six servings.
- `data/rounding.json`: global serving and ingredient policies; existing ingredient policies are preserved when new ingredients are added.
- Recipe-level `rounding` overrides are applied only for that recipe.
- Ingredients use stable canonical IDs and positive baseline amounts. Scaling starts from the unrounded baseline, never from already rounded numbers.

## Development
The site is plain HTML, CSS and modern JavaScript, with no build or runtime dependencies. Serve the root directory over HTTP for local preview. The GitHub Pages workflow deploys on updates to `master`.

## Recipe contribution protocol
1. Discuss and refine recipe quantities, steps and servings in chat.
2. Keep all changes as drafts until explicit approval.
3. On approval, create/update the individual recipe JSON, append only *new* canonical ingredient IDs to `data/rounding.json` without rewriting existing policies, and update `data/index.json`.
4. Validate data, scaling, UI and deployment before publishing.
