module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/tests/agents/**/*.test.js'],
  testTimeout: 60000, // 60 seconds for Puppeteer tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'FiveNine Optics Test Report',
        outputPath: 'tests/reports/test-report.html',
        includeFailureMsg: true,
        includeConsoleLog: true,
        theme: 'darkTheme',
        logo: '',
        executionTimeWarningThreshold: 5,
      },
    ],
  ],
  collectCoverageFrom: ['src/**/*.{js,njk}'],
  coverageDirectory: 'tests/reports/coverage',
  globals: {
    TEST_URL: process.env.TEST_URL || 'http://localhost:8080',
  },
};
