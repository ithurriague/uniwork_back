export default {
    testEnvironment: 'node',
    verbose: true,
    clearMocks: true,
    roots: ['<rootDir>/modules'],
    testMatch: [
        '**/__tests__/**/*.test.js',
        '**/?(*.)+(test).js',
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
    coveragePathIgnorePatterns: [
        '/node_modules/',
        '/.coverage/',
        '/__mocks__/',
        '.*route.*\\.js',
    ]
};
