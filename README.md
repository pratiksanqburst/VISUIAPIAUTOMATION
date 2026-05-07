# UI & API Automation Framework

This project is a robust test automation framework built using **TypeScript** on top of **Playwright**, integrated with **Cucumber BDD** (Behavior-Driven Development). We use the `playwright-bdd` wrapper to seamlessly bring Playwright's powerful execution engine together with Cucumber. This allows us to write human-readable test scenarios in feature files while taking advantage of Playwright's blazing-fast execution, reliable auto-waiting, and rich tracing capabilities.

##  Framework Architecture & Design

### 1. Technology Stack
- **Playwright-BDD**: Core automation and BDD execution engine.
- **TypeScript**: Ensures type safety and on-the-fly compilation (via `ts-node`).
- **Chai Assertions**: Utilized for fluent and robust validations.

### 2. Page Object Model (POM) Design
To make the codebase highly maintainable and scalable, we use a hierarchical **Page Object Model**:

- **The `BasePage` Concept**: 
  Our `BasePage` initializes the Playwright `page` instance. Every specific page class (e.g., `LoginPage`, `OrganizationsPage`) extends `BasePage` to inherit browser context and shared utilities.
- **Encapsulated Locators**: 
  All UI element selectors are intentionally declared as `private` properties within their respective page classes. If a UI element changes, developers only need to update the selector in **one place**, rather than hunting through hundreds of test files.
- **Action Methods**: 
  Each class contains async methods (like `searchOrganization()`) that handle the heavy lifting: interacting with locators and managing dynamic synchronization.
- **Clean Step Definitions**: 
  Our step definitions (the code behind the Gherkin steps) contain absolutely no Playwright locators or complex waits. They simply instantiate the required Page Object and call its readable methods. The BDD steps dictate **WHAT** the test is doing, and the POM dictates **HOW** it executes it.

## 📁 Project Structure

```text
.
├── src
│   ├── api          # API specific utilities and clients
│   ├── features     # Gherkin feature files (.feature)
│   │   ├── ui       # UI related BDD scenarios
│   │   └── api      # API related BDD scenarios
│   ├── pages        # Page Object Models (POM) classes extending BasePage
│   ├── steps        # Cucumber step definitions
│   └── utils        # Shared utilities (e.g., manual login scripts)
├── reports          # Test execution reports (JSON and HTML)
├── cucumber.js      # Cucumber configuration (ts-node setup, formats, etc.)
├── generate-report.js # Custom script to generate HTML dashboard
├── package.json     # Project dependencies and execution scripts
```

## Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

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

## ⚙️ Test Execution 

We have configured simple NPM scripts in `package.json` to make execution straightforward for anyone on the team or in a CI/CD pipeline.

### Running the Test Suite
To execute the tests, simply run:
```bash
npm run test
```
**Under the hood:** This triggers `npx cucumber-js`. Using our `cucumber.js` config, it compiles TypeScript on the fly with `ts-node` and executes all `.feature` files, providing a real-time progress bar in the console.

*(Optional Utility)*: To quickly generate pre-requisite auth tokens manually, you can use:
```bash
npm run login
```

## 📊 Reporting

Once test execution completes, the framework automatically generates a raw JSON file of the results. To convert this into a beautiful, interactive HTML dashboard, run:

```bash
npm run report
```

**What this does:**
- Runs our custom `generate-report.js` script using the `cucumber-html-reporter` library.
- It parses the raw JSON and generates a clean 'Bootstrap' themed HTML report.
- The report launches automatically in your browser, visually breaking down results (Passed/Failed/Skipped) by Scenarios and Features.
- Submits valuable custom metadata to the dashboard (e.g., Test Environment, Browser, App Version) so stakeholders have full visibility at a glance.
