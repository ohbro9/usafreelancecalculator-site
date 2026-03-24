# USA Freelance Calculator Toolkit Implementation Roadmap

## Immediate Next Work
1. Create deploy-ready GitHub Pages repo structure.
2. Normalize tool filenames and navigation paths.
3. Add baseline SEO/meta foundation.
4. Add root deployment files like `robots.txt`, `sitemap.xml`, and `.nojekyll`.
5. Initialize git repo and connect GitHub remote.

## toolkit-core.js Responsibilities
- `readToolkit()`
- `writeToolkit()`
- `resetToolkit()`
- `migrateLegacyToolkitData()`
- `setToolkitStep(step)`
- `setToolkitHandoff(sourceTool, payload)`
- `getToolkitImportFor(toolName)`
- `clearToolkitImportFor(toolName)`
- `goToolkitNext(currentTool)`
- `goToolkitBack(currentTool)`

## Step Map
```js
const TOOLKIT_STEPS = [
  { id: 'hourly_rate', file: 'index.html' },
  { id: 'platform_fee', file: 'platform-fee-calculator.html' },
  { id: 'tax_estimator', file: 'tax-estimator.html' },
  { id: 'income_goal', file: 'income-goal-planner.html' },
  { id: 'budget_planner', file: 'budget-planner.html' }
];
```

## Per-Tool Handoff Contract

### Hourly
- Emits:
  - selected period amount
  - normalized annual gross
  - work assumptions

### Platform
- Consumes:
  - gross value + basis
- Emits:
  - client pays
  - pre-tax after fees
  - same basis
  - normalized annual gross when safely known

### Tax
- Consumes:
  - gross/pre-tax values
  - basis
- Emits:
  - annual gross
  - monthly gross
  - annual tax estimate
  - annual take-home estimate

### Income Goal
- Consumes:
  - annual or monthly gross context
  - goal baseline if available
- Emits:
  - target monthly
  - target annual
  - required gross
  - required hourly rate

### Budget
- Consumes:
  - income baseline
  - tax estimate
  - goal context
- Emits:
  - final toolkit summary only

## QA Gates
- Each page works with no toolkit session.
- Each page accepts a valid toolkit session.
- Back/Next preserves local state.
- Latest Next overwrites shared handoff.
- No stale auto-import loop on reload.
- Mobile layout has no overflow.
- Desktop layout has no broken sticky bars.
- Final step report exports correctly.

## Suggested Order of Edits
1. Shared core file
2. Hourly
3. Platform
4. Tax
5. Income Goal
6. Budget
7. Unified toolkit polish
