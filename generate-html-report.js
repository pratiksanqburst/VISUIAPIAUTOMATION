const report = require('multiple-cucumber-html-reporter');
const os = require('os');
const path = require('path');
const fs = require('fs');

const reportDir   = path.join(process.cwd(), 'reports', 'html');
const jsonDir     = path.join(process.cwd(), 'reports', 'current');
const startTimePath = path.join(process.cwd(), 'src', 'start-time.txt');
const endTimePath   = path.join(process.cwd(), 'src', 'end-time.txt');

// ── Timestamps ──────────────────────────────────────────────────────────────

const formatDateTime = (dateStr) => {
    const date = new Date(dateStr.trim());
    return date.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).replace(',', '');
};

let startTime    = 'N/A';
let endTime      = 'N/A';
let totalDuration = 'N/A';

if (fs.existsSync(startTimePath)) startTime = formatDateTime(fs.readFileSync(startTimePath, 'utf-8'));
if (fs.existsSync(endTimePath))   endTime   = formatDateTime(fs.readFileSync(endTimePath,   'utf-8'));

if (fs.existsSync(startTimePath) && fs.existsSync(endTimePath)) {
    const start = new Date(fs.readFileSync(startTimePath, 'utf-8').trim());
    const end   = new Date(fs.readFileSync(endTimePath,   'utf-8').trim());
    const ms    = end.getTime() - start.getTime();
    const s     = Math.floor((ms / 1000) % 60);
    const m     = Math.floor((ms / (1000 * 60)) % 60);
    const h     = Math.floor(ms / (1000 * 60 * 60));
    totalDuration = `${h}h ${m}m ${s}s`;
}

// ── Guard ────────────────────────────────────────────────────────────────────

if (!fs.existsSync(jsonDir) || fs.readdirSync(jsonDir).filter(f => f.endsWith('.json')).length === 0) {
    console.error(`No JSON report found in ${jsonDir}. Run tests first.`);
    process.exit(1);
}

if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });

// ── Generate ─────────────────────────────────────────────────────────────────

report.generate({
    jsonDir,
    reportPath: reportDir,
    reportName: 'High AI Visualization - Test Execution Report',
    pageTitle:  'High AI QE Test Report',
    displayDuration: true,
    metadata: {
        browser:  { name: 'chrome', version: 'latest' },
        device:   os.hostname(),
        platform: { name: os.platform(), version: os.release() },
    },
    customData: {
        title: 'Execution Summary',
        data: [
            { label: 'Project',                  value: 'High AI-Q QE Visualisation' },
            { label: 'Module',                   value: 'Visualisation Dashboard' },
            { label: 'Executed By',              value: os.userInfo().username },
            { label: 'Test Cycle',               value: 'Regression' },
            { label: 'Test Environment',         value: 'DEV' },
            { label: 'Execution Start Time',     value: startTime },
            { label: 'Execution End Time',       value: endTime },
            { label: 'Total Execution Duration', value: totalDuration },
        ],
    },
});

console.log('✅ Report generated at: reports/html/index.html');
console.log('🌐 Open in browser: file://' + path.join(process.cwd(), 'reports', 'html', 'index.html'));
