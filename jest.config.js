export default {
    testEnvironment: 'node',
    verbose: true,
    clearMocks: true,
    roots: [
        '<rootDir>/modules',
        '<rootDir>/src',
    ],
    testMatch: [
        '**/?(*.)+(test|integration.test).js'
    ],
    collectCoverage: true,
    coverageProvider: 'v8',
    coverageDirectory: '.coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        },
    },
    collectCoverageFrom: [
        'modules/**/*.js',
        'src/**/*.js',
        '!**/routes.js',
        '!**/server.js',
    ],
};
