# USA Freelance Calculator Toolkit Phased Implementation Checklist

## Status
- Saved on: 2026-03-27 UTC
- Purpose: Lock the exact execution order for toolkit brand-alignment and polish work.
- Scope: Deploy-ready toolkit docs mirror

## Locked Order
1. Baseline Freeze
2. Nav System
3. Button System
4. Export System
5. Brand Surface
6. Layout Polish
7. Final QA Lock

## Phase Summary

### Phase 1: Baseline Freeze
- Goal: lock current state before polish
- Files: all 5 tools + toolkit core
- Risk: low
- Testing: smoke test all tools, connected-flow regression, mobile + desktop spot-check

### Phase 2: Nav System
- Goal: unify top nav and Back / Next behavior
- Files: all 5 tools
- Risk: low
- Testing: nav click-through, back/next regression, mobile nav overflow, focus check

### Phase 3: Button System
- Goal: unify CTA hierarchy
- Files: all 5 tools
- Risk: low
- Testing: primary/secondary/reset action sanity pass and mobile tap-target review

### Phase 4: Export System
- Goal: unify export order, naming, and fallback language
- Files: all 5 tools
- Risk: medium
- Testing: PDF/image/copy flows and fallback behavior

### Phase 5: Brand Surface
- Goal: align trust chips, footer tone, and helper language
- Files: all 5 tools
- Risk: medium
- Testing: visual copy review and standalone vs toolkit wording review

### Phase 6: Layout Polish
- Goal: align spacing, padding, radius, and focus polish
- Files: all 5 tools
- Risk: medium
- Testing: desktop/mobile visual pass, overflow check, focus-state review

### Phase 7: Final QA Lock
- Goal: freeze after full regression and premium cohesion review
- Files: all 5 tools + toolkit core
- Risk: verification-heavy
- Testing: full automation rerun, manual desktop/mobile pass, final blocker list

## Working Rule
- One phase at a time.
- No phase overlap unless the previous phase is verified.
- Prefer polish over calculation rewrites.
- Stop on regression and fix before continuing.
