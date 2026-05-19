# UI & API Automation Framework

This project is a robust test automation framework built using **TypeScript** on top of **Playwright**, integrated with **Cucumber BDD** (Behavior-Driven Development). We use the `playwright-bdd` wrapper to seamlessly bring Playwright's powerful execution engine together with Cucumber. This allows us to write human-readable test scenarios in feature files while taking advantage of Playwright's blazing-fast execution, reliable auto-waiting, and rich tracing capabilities.

## Framework Architecture & Design

### 1. Technology Stack

- **Playwright** `^1.58.1` — Core browser automation engine
- **Cucumber BDD** `^12.6.0` — Gherkin-based BDD test runner
- **TypeScript** `^5.9.3` — Type safety and on-the-fly compilation via `ts-node`
- **Chai** `^6.2.2` — Fluent assertion library
- **multiple-cucumber-html-reporter** — Rich HTML reporting dashboard

### 2. Page Object Model (POM) Design

To make the codebase highly maintainable and scalable, we use a hierarchical **Page Object Model**:

- **`BasePage`**: Initializes the Playwright `page` instance. Every specific page class (e.g., `LoginPage`, `VisualizationDashboardPage`) extends `BasePage` to inherit browser context and shared utilities.
- **Encapsulated Locators**: All UI element selectors are declared within their respective page classes. If a UI element changes, developers only need to update the selector in **one place**.
- **Action Methods**: Each class contains async methods that handle interactions and dynamic synchronization.
- **Clean Step Definitions**: Step definitions contain no Playwright locators. They instantiate the required Page Object and call its readable methods. BDD steps dictate **WHAT** the test is doing; POM dictates **HOW** it executes it.

## 📁 Project Structure

```text
.
├── src
│   ├── api                         # API utility classes (e.g., SuperAdminApi.ts)
│   ├── features
│   │   ├── ui                      # Super Admin UI BDD scenarios
│   │   │   ├── superadmin_login.feature
│   │   │   ├── superadmin_organizations.feature
│   │   │   ├── superadmin_users.feature
│   │   │   ├── superadmin_create_edit_user.feature
│   │   │   └── superadmin_list_verification.feature
│   │   ├── api                     # API BDD scenarios
│   │   │   ├── superadmin_org_api.feature
│   │   │   └── superadmin_users_roles_api.feature
│   │   └── high_ai                 # High AI / Visualization platform scenarios
│   │       ├── login.feature
│   │       ├── Dashboard.feature
│   │       └── visualization_nonfunctional.feature
│   ├── pages                       # Page Object Model classes
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── DashboardPage.ts
│   │   ├── OrganizationsPage.ts
│   │   ├── UsersPage.ts
│   │   ├── VisualizationPage.ts
│   │   ├── VisualizationDashboardPage.ts
│   │   └── high_ai/
│   │       └── HighAIPage.ts
│   ├── steps                       # Cucumber step definitions
│   │   ├── apiSteps.ts
│   │   ├── highAiSteps.ts
│   │   ├── visualizationSteps.ts
│   │   └── superadminCreateEditSteps.ts
│   ├── hooks
│   │   ├── hooks.ts                # Before/After hooks (screenshot, video, trace)
│   │   └── world.ts                # CustomWorld definition
│   └── utils                       # Shared utilities (auth setup, login scripts)
├── reports                         # Test execution output (JSON, HTML, traces, videos)
├── cucumber.js                     # Cucumber configuration
├── generate-report.js              # Custom HTML report generation script
├── playwright.config.ts            # Playwright configuration
└── package.json                    # Dependencies and NPM scripts
```

## Getting Started

### Prerequisites

- **Node.js** v14 or higher
- **npm**

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd visualisation_UI_API_Automation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```
4. Create a `.env` file in the root with the required credentials (see `.env.example` if provided).

## ⚙️ Test Execution

### Run all tests

```bash
npm run test
```

### Run only High AI / Visualization tests

```bash
npm run test:high_ai
```

Clears previous reports, records start/end timestamps, and outputs a JSON report to `reports/high_ai/`.

### Run tests by tag

```bash
npm run test:tag -- @T-048
npm run test:tag -- @dashboard
npm run test:tag -- @high_ai
```

### Generate auth storage state (one-time login)

```bash
npm run login
```

### Launch Playwright Codegen

For the Super Admin portal:

```bash
npm run codegen
```

For the High AI / Visualization portal:

```bash
npm run codegen:high_ai
```

## 📊 Reporting

### Quick JSON → HTML report

```bash
npm run report
```

Runs `generate-report.js` using `cucumber-html-reporter` to produce a Bootstrap-themed HTML dashboard with pass/fail/skip breakdowns.

### Rich multi-feature HTML report

```bash
npm run report:html
```

Runs `src/helper/report/report.ts` using `multiple-cucumber-html-reporter` for a more detailed breakdown by feature and scenario.

Reports are saved to the `reports/` directory and include:

- **HTML dashboards** — visual pass/fail/skip summaries
- **Trace files** — `reports/traces/` (Playwright trace archives, openable via `npx playwright show-trace`)
- **Videos** — `reports/videos/` (per-scenario recordings)

## 🧪 Test Coverage

### High AI / Visualization Platform (`@high_ai1`)

| Tag    | Scenario                                                                             |
| ------ | ------------------------------------------------------------------------------------ |
| @T-048 | Verify AI Summary button is visible and clickable                                    |
| @T-049 | Verify Project Health Overview KPI data matches AI Summary                           |
| @T-050 | Verify Functional Testing KPIs are visible                                           |
| @T-051 | Verify Admin Panel is accessible and displays correct fields                         |
| @T-052 | Verify Threshold Settings page displays correct fields                               |
| @T-053 | Verify RRI Analysis page displays correct fields                                     |
| @T-054 | Verify Accessibility KPI components on Non-Functional Testing dashboard              |
| @T-055 | Verify Client Side Performance KPI components on Non-Functional Testing dashboard    |
| @T-056 | Verify Link Validation KPI components on Non-Functional Testing dashboard            |
| @T-057 | Verify Search Engine Optimization KPI components on Non-Functional Testing dashboard |
| @T-058 | Verify Visual Integrity KPI components on Non-Functional Testing dashboard           |
| @T-059 | Verify Download Report button is available on Non-Functional Testing dashboard       |
| @T-060 | Verify Share Link button is available on Non-Functional Testing dashboard            |
| @T-061 | Verify action buttons are available on the Functional Testing dashboard              |
| @T-062 | Verify LLM Configuration page displays correct fields                                |
| @T-063 | Verify Project Management page displays correct configurations                       |
| @T-064 | Verify Visualization dashboard overview metrics are visible                          |
| @T-065 | Verify build filter dropdown options on Functional Testing dashboard                 |
| @T-066 | Verify AI Summary panel content on Non-Functional Testing dashboard                  |
| @T-067 | Verify filter fields are visible on Non-Functional Testing dashboard                 |
| @T-068 | Verify KPI project info tooltip descriptions on the dashboard                        |

### Login (`@high_ai1`)

- Navigate to High AI Login Page
- Verify Visualisation Dashboard Redirection
- Verify login with invalid credentials
- Verify login with empty fields
- Verify Forgot Password page is accessible from login
- Verify Logout option is visible after successful login

### Super Admin UI (`src/features/ui/`)

- Login, organization management (create, edit, suspend, filter, search)
- User management (create, edit, deactivate, search)
- List verification scenarios

### API (`src/features/api/`)

- Validate organizations list API
- Validate users list API
- Validate roles list API
