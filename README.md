# USA Freelance Calculator Toolkit

Static multi-page toolkit for US freelancers, prepared for GitHub Pages deployment.

## Live Structure

- `/` -> Hourly Rate Calculator
- `/platform-fee-calculator.html` -> Platform Fee Calculator
- `/tax-estimator.html` -> Tax Estimator
- `/income-goal-planner.html` -> Income Goal Planner
- `/budget-planner.html` -> Budget Planner

## Project Layout

- `index.html`
- `platform-fee-calculator.html`
- `tax-estimator.html`
- `income-goal-planner.html`
- `budget-planner.html`
- `assets/js/toolkit-core.js`
- `docs/`
- `robots.txt`
- `sitemap.xml`

## Deployment

This repo is designed for GitHub Pages with no build step.

1. Push the repository to GitHub.
2. Enable GitHub Pages from the default branch root.
3. When the custom domain is ready, add a `CNAME` file with `usafreelancecalculator.com`.
4. Update any future OG image assets if social share images are added later.

## Local Preview

Serve the folder with any static server, for example:

```bash
python3 -m http.server 4173 --directory /root/usafreelancecalculator-site
```

