module.exports = {
    testEnvironment: 'jsdom',
    coverageProvider: 'v8', // Optimization for Jest 30
    clearMocks: true, // Cleanup mocks automatically between tests
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    setupFiles: ['jest-webextension-mock'],
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    setupFilesAfterEnv: ['./jest.setup.js'],
};
