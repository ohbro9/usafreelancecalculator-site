# Toolkit Tooling Baseline

## Environment Snapshot
- Node.js available
- npm available
- Python available
- Existing HTML tools are stored in `/sdcard/Documents`

## Package Policy
- Install only packages that materially help implementation or regression testing.
- Prefer a small stable toolkit over a large dependency set.

## Baseline Packages To Keep Available
- `@playwright/test`
  - desktop + mobile UI regression
  - cross-page flow verification
- `serve`
  - local static server for multi-page navigation tests

## Optional Later Packages
- `eslint`
  - only if JS shared core grows enough to justify linting
- `prettier`
  - only if we standardize formatting across extracted shared JS/CSS files

## Immediate Rule
- Do not add framework packages unless the toolkit is being rewritten into a bundled app.
- Current architecture is multi-page static HTML with shared JS utilities.
