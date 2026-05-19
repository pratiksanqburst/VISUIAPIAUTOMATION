module.exports = {
    default: {
        requireModule: ['ts-node/register'],
        require: ['src/steps/*.ts', 'src/hooks/*.ts'],
        format: ['summary', 'json:reports/current/cucumber-report.json', 'html:reports/current/cucumber-report.html'],
        paths: ['src/features/**/*.feature'],
        publishQuiet: true,
        exit: true,
        ...(process.env.TAG ? { tags: process.env.TAG } : {})
    }
}
