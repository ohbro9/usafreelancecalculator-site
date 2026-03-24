# USA Freelance Calculator Toolkit Product Plan

## Status
- Saved on: 2026-03-23 UTC
- Deploy-ready site folder prepared on: 2026-03-24 UTC
- Goal: Convert 5 standalone calculator tools into one premium interconnected toolkit
- Original source files:
  - `/sdcard/Documents/hourly-rate-calculator-final-12-phases.html`
  - `/sdcard/Documents/platform-fee-calculator-smart-tax-final.html`
  - `/sdcard/Documents/freelancer-tax-estimator-final.html`
  - `/sdcard/Documents/income-goal-planner-final.html`
  - `/sdcard/Documents/freelance-budget-planner-fixed.html`
- Deploy-ready site files:
  - `/root/usafreelancecalculator-site/index.html`
  - `/root/usafreelancecalculator-site/platform-fee-calculator.html`
  - `/root/usafreelancecalculator-site/tax-estimator.html`
  - `/root/usafreelancecalculator-site/income-goal-planner.html`
  - `/root/usafreelancecalculator-site/budget-planner.html`

## Product Goal
- Build one premium USA freelancer financial toolkit.
- Keep every tool fully usable as a standalone page.
- Add a connected flow so values, assumptions, and context move cleanly between tools.
- Make the product feel like one system, not 5 unrelated HTML files.

## Locked Tool Order
1. Hourly Rate Calculator
2. Platform Fee Calculator
3. Tax Estimator
4. Income Goal Planner
5. Budget Planner

## Core Product Principles
- Standalone mode must always work.
- Toolkit mode must feel guided and connected.
- `Next` overwrites the shared toolkit handoff with the latest valid result.
- `Back` never wipes tool state or shared toolkit state.
- Silent destructive imports are not allowed.
- Shared data must include both amount and meaning.

## Biggest Engineering Decision
- Use one shared toolkit session key:
  - `usaFreelanceToolkit_v2`
- Keep tool-local persistence separate from toolkit-shared persistence.
- Do not pass bare values like `selected_value` without semantic type.

## Shared Toolkit Session Shape
```json
{
  "version": 2,
  "sessionId": "tk_001",
  "updatedAt": 1760000000000,
  "currentStep": "platform_fee",
  "sourceTool": "hourly_rate",
  "handoff": {
    "amount": 67200,
    "period": "year",
    "kind": "gross",
    "basis": "annual",
    "label": "Yearly Gross"
  },
  "normalized": {
    "hourlyGross": 35,
    "dailyGross": 280,
    "weeklyGross": 1400,
    "monthlyGross": 5600,
    "annualGross": 67200,
    "preTaxAfterFees": 60480,
    "annualTaxEstimate": 15400,
    "annualTakeHome": 45080
  },
  "assumptions": {
    "state": "TX",
    "filingStatus": "single",
    "hoursPerWeek": 40,
    "weeksPerYear": 48,
    "utilizationPct": 70,
    "selfEmploymentTax": true
  }
}
```

## Required Shared Data Rules
- Every handoff must define:
  - `amount`
  - `period`
  - `kind`
  - `basis`
  - `label`
- Every tool should update normalized fields when possible.
- Assumptions should be shared only when the current tool owns or confirms them.
- Old ad-hoc keys like `UFC_SHARED` should be migrated through a compatibility layer, then phased out.

## Navigation Rules
- Top sticky toolkit nav with real links on all 5 tools.
- Bottom action bar with:
  - left: `Back: <Previous Tool>`
  - right: `Next: <Next Tool>`
- Tool 1 has no Back button.
- Final tool replaces Next with:
  - `Export Toolkit Report`
  - `Back: Income Goal Planner`
  - optional `Start Over`

## Import UX Rules
- If toolkit data exists, show one consistent import banner.
- Banner actions:
  - `Use Imported`
  - `Keep Current`
  - `Compare`
- Do not auto-overwrite meaningful user input without a clear choice.
- Show source tool name and the semantic label of the incoming amount.

## Reset Rules
- `Reset This Tool` clears only the current page state.
- `Reset Entire Toolkit` clears the shared toolkit session and optionally tool-local states.
- Reset should never be required for normal forward progress.
- New `Next` actions should overwrite the shared handoff by default.

## Tool-by-Tool Interconnection Plan

### 1. Hourly Rate Calculator
- Keep day/week/month/year outgoing chips.
- Default outgoing value: `Yearly Gross`.
- Share work assumptions:
  - hours per week
  - weeks per year
  - utilization
- Replace placeholder next button with a real toolkit handoff and redirect to Platform Fee Calculator.

### 2. Platform Fee Calculator
- Accept imported amount with explicit basis.
- Add a visible basis selector if needed:
  - `Project`
  - `Monthly`
  - `Yearly`
- Preserve both:
  - `Client Pays`
  - `You Receive (pre-tax)`
- Default next handoff: `You Receive (pre-tax)`.
- Pass basis and semantic meaning forward.

### 3. Tax Estimator
- Convert incoming data into a clean annual tax model.
- If incoming basis is not annual, normalize it explicitly.
- Do not pass after-tax values to the next tool as the default.
- Forward gross/pre-tax reference values to Income Goal Planner.

### 4. Income Goal Planner
- Treat imported value as context, not an unconditional overwrite.
- Offer import choices:
  - `Use as current baseline`
  - `Use as target goal`
- Update normalized values for:
  - monthly target
  - annual target
  - required gross
  - required hourly rate
- Forward goal-related gross context to Budget Planner.

### 5. Budget Planner
- Final sink in the connected flow.
- Accept toolkit baseline values for income and planning context.
- Show a final toolkit snapshot:
  - gross income
  - fee drag
  - tax reserve
  - take-home estimate
  - budget left
- Become the final export/report surface.

## Shared Global Assumptions
- State
- Filing status
- Self-employment tax on/off
- Hours per week
- Weeks per year
- Utilization
- Default reserve target
- Default business expense behavior

## Premium Product Features
- One consistent design system across all 5 tools.
- One shared import banner pattern.
- One shared Back/Next action pattern.
- One toolkit snapshot drawer or sticky summary.
- One cross-tool report export from the final step.
- Smooth mobile and desktop behavior.
- Clear error handling for stale or incompatible shared data.

## Engineering Plan

### Phase 1
- Lock the `usaFreelanceToolkit_v2` schema.
- Build `toolkit-core.js`.
- Add migration support for existing legacy handoff keys.

### Phase 2
- Add real top nav links to all 5 tools.
- Add shared bottom Back/Next action shell.
- Add import banner component contract.

### Phase 3
- Wire `Hourly -> Platform`.
- Wire `Platform -> Tax`.
- Fix amount semantics so platform outputs cannot be misread as annual tax input.

### Phase 4
- Wire `Tax -> Income Goal`.
- Wire `Income Goal -> Budget`.
- Add baseline-vs-goal import choices.

### Phase 5
- Add toolkit snapshot summary.
- Add final full-toolkit export/report.
- Run full desktop/mobile QA across the whole flow.

## Current Observed Reality
- Hourly currently has a Next UI but not a real handoff.
- Platform and Tax already have partial bridging logic.
- Income Goal and Budget still behave mostly like standalone tools.
- Shared storage contracts are inconsistent today.
- Amount semantics are the highest-risk integration issue.

## Non-Negotiable Product Rule
- Do not ship a connected toolkit until all handoffs are typed and normalized.
- Premium feel depends more on semantic correctness than on extra buttons or visuals.
