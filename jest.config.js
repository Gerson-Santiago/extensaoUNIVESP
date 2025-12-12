module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
    },
    testMatch: ['**/tests/**/*.test.js'],
    verbose: true,
    setupFilesAfterEnv: ['./jest.setup.js'],
};
