# USA Freelance Calculator Toolkit Phase 1 Baseline Report

## Status
- Phase: `1 / 7`
- Name: `Baseline Freeze`
- Saved on: `2026-03-27 UTC`
- Scope: deploy/docs mirror for the toolkit project
- Purpose: mirror the current stable toolkit baseline before brand-alignment work continues

## Baseline Outcome
- Phase 1 status: `Complete`
- Regression status: `Pass`
- Total verified scenarios: `37 / 37`
- Console/page/request failures: `0`
- Next recommended phase: `Phase 2: Nav System`

## Source Files Frozen
- `/sdcard/Documents/hourly-rate-calculator-final-12-phases.html`
- `/sdcard/Documents/platform-fee-calculator-smart-tax-final.html`
- `/sdcard/Documents/freelancer-tax-estimator-final.html`
- `/sdcard/Documents/income-goal-planner-final.html`
- `/sdcard/Documents/freelance-budget-planner-fixed.html`
- `/sdcard/Documents/usa-freelance-toolkit/toolkit-core.js`

## SHA-256 Freeze Hashes
- `c6669607fd075595f5f3a63f6722096541837dde3401d71756a0ba0524511344`  Hourly Rate
- `3cb87a88b437c94c7563007d370e7dd911a6a053903b0558cae68d8510d4a0c8`  Platform Fee
- `99740fd11231013fe50953f0c21ec2791c65b6e52909a9093e4300dcb3a6737e`  Tax Estimator
- `6bbc97ee7fae0ca7ee9ce30218028fea8668930d170fec339ad7bede48144048`  Income Goal Planner
- `ebdc48386d7080d08dd23f14cbe5cf187b7bad190c74a8b946d798403bac4088`  Budget Planner
- `98576b11fe7c0d04bf84f5556f762f9bf5cfcb09614cb69db7c8d612b4423b1e`  Toolkit Core

## Regression Pass Summary
- Hourly -> Platform: `7 / 7`
- Platform -> Tax: `9 / 9`
- Tax -> Goal: `6 / 6`
- Goal -> Budget: `6 / 6`
- Final navigation/report suite: `9 / 9`

## Artifact Paths
- `/tmp/usa-toolkit-hourly-platform-qa/report.json`
- `/tmp/usa-toolkit-platform-tax-qa/report.json`
- `/tmp/usa-toolkit-tax-goal-qa/report.json`
- `/tmp/usa-toolkit-goal-budget-qa/report.json`
- `/tmp/usa-toolkit-navigation-final-qa/report.json`

## Lock Notes
- This phase freezes the current stable toolkit state.
- Later polish phases should improve suite cohesion without flattening the tools into one visual style.
- No calculation rewrites should happen unless a real reproduced bug requires them.
