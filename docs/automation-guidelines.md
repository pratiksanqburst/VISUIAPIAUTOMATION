# Automation Guidelines — VISUIAPIAUTOMATION

Purpose
- Provide concise, repo-specific guardrails for Playwright + Cucumber + TypeScript automation in this repository.

General
- Tests use Cucumber as the runner and Playwright for browser automation.
- Keep tests in `src/features` (feature files) and step definitions in `src/steps`.
- Use TypeScript for Page Objects, steps, hooks and helpers (`.ts`).
- Prefer `chromium` for local/demo runs; configure this in `playwright.config.ts` or in hooks.

Page Object Model (POM)
- Put Page Object classes in `src/pages/`.
- File naming: kebab-case matching the class, e.g. `login-page.ts` for `LoginPage`.
- Each Page Object must contain:
  - Locators as class properties (typed `Locator`).
  - Action methods (e.g., `async enterUsername(value: string)`).
  - No assertions or cucumber logic inside Page Objects.
- Reuse `src/pages/BasePage.ts` for common helpers.

Locator Strategy (priority)
1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByTestId()` (use `data-testid`)
5. `getByText()`
6. CSS selectors (last resort)
- NEVER use XPath. Avoid fragile selectors such as `:nth-child`.

Wait & Sync
- Rely on Playwright auto-waiting for `click`, `fill`, `getBy*` etc.
- Use `await page.waitForURL()` or `await locator.waitFor()` when necessary.
- Use `waitForLoadState('networkidle')` only for heavy network activity.
- Do NOT use `page.waitForTimeout()` anywhere.

Hooks & World
- Initialize Browser/Context/Page in `src/hooks/hooks.ts` (or existing hooks) using `Before` and `After` hooks.
- Store Page Objects in the world object (`src/hooks/world.ts`) so steps can access them.

Security & Data
- Do NOT hardcode credentials or secrets. Use environment variables or `storageState.json`.
- Keep test data under `test-data/` or `src/test-data`.

Assertions & Test Design
- One assertion concept per scenario where reasonable.
- Tests must be independent and idempotent.
- Add concise comments to explain intent for non-trivial scenarios.

Reporting & Running
- Tagged high-ai runs: `npm run test:high_ai` (produces JSON at `reports/high_ai/cucumber-report.json`).
- Generate HTML report: `npm run report:html` → `reports/high_ai/html/index.html`.

Code Style & Naming
- camelCase for functions and variables; PascalCase for Page Object classes.
- Test files can remain under `src/features` and step definitions in `src/steps`.

Do Not
- Never override Playwright native methods.
- Never use XPath or arbitrary timeouts.
- Never write to production environments.

PR Checklist (suggested)
- Page Objects used (no direct page manipulation in steps).
- No hardcoded secrets.
- No `waitForTimeout` usage.
- Locator strategy follows priority order.
- Tests run in `chromium` for demo purposes.

Questions or next steps: run a repository scan to produce a compliance report.
