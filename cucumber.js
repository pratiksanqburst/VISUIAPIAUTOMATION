module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/steps/*.ts', 'src/hooks/*.ts'],
        format: ['summary', 'json:reports/cucumber-report.json', 'html:reports/cucumber-report.html'],
        paths: ['src/features/**/*.feature'],
        publishQuiet: true,
        ...(process.env.TAG ? { tags: process.env.TAG } : {})
    }
}
