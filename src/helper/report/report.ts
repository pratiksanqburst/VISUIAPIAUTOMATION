// Import necessary modules
import * as report from "multiple-cucumber-html-reporter";
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

// Define the path for the report directory and JSON file
const reportDir = path.join(process.cwd(), 'reports', 'high_ai', 'html');
const jsonFilePath = path.join(process.cwd(), 'reports', 'high_ai');
const startTimePath = path.join(process.cwd(), 'src', 'start-time.txt');
const endTimePath = path.join(process.cwd(), 'src', 'end-time.txt');

// Read start and end times
let startTime = 'N/A';
let endTime = 'N/A';
let totalDuration = 'N/A';

const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).replace(',', '');
};

if (fs.existsSync(startTimePath)) {
    startTime = formatDateTime(fs.readFileSync(startTimePath, 'utf-8').trim());
}

if (fs.existsSync(endTimePath)) {
    endTime = formatDateTime(fs.readFileSync(endTimePath, 'utf-8').trim());
}

if (fs.existsSync(startTimePath) && fs.existsSync(endTimePath)) {
    const start = new Date(fs.readFileSync(startTimePath, 'utf-8').trim());
    const end = new Date(fs.readFileSync(endTimePath, 'utf-8').trim());
    const durationMs = end.getTime() - start.getTime();

    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)));

    totalDuration = `${hours}h ${minutes}m ${seconds}s`;
}

// Ensure reports directory exists
if (!fs.existsSync(reportDir)) {
    console.log("Reports directory does not exist. Creating directory...");
    fs.mkdirSync(reportDir, { recursive: true });
    console.log(`Directory created at: ${reportDir}`);
} else {
    console.log(`Reports directory already exists at: ${reportDir}`);
}

// Check if the JSON file exists before generating the report
if (!fs.existsSync(jsonFilePath)) {
    console.error(`JSON directory not found at: ${jsonFilePath}. Please ensure that the tests have run and the JSON file is generated.`);
} else {
    console.log("Generating the test automation report...");

    // Generate the report
    report.generate({
        jsonDir: jsonFilePath,
        reportPath: reportDir,
        reportName: "High AI Visualization - Test Execution Report",
        pageTitle: "High AI QE Test Report",
        displayDuration: true,
        metadata: {
            browser: {
                name: "chrome",
                version: "latest",
            },
            device: `${os.hostname()}`,
            platform: {
                name: os.platform(),
                version: os.release(),
            },
        },
        customData: {
            title: "Execution Summary",
            data: [
                { label: "Project", value: "High AI-Q QE Visualisation" },
                { label: "Module", value: "Visualisation Dashboard" },
                { label: "Executed By", value: os.userInfo().username },
                { label: "Test Cycle", value: "Regression" },
                { label: "Test Environment", value: "DEV" },
                { label: "Execution Start Time", value: startTime },
                { label: "Execution End Time", value: endTime },
                { label: "Total Execution Duration", value: totalDuration }
            ],
        },
    });

    console.log("✅ Report generation completed. You can find it at:", reportDir);
}
