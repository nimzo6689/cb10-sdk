/** @type {import('jest').Config} */
const commonConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testPathIgnorePatterns: ['<rootDir>/dist/'],
};

const config = {
  ...commonConfig,
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/__tests__/unit/**/*.spec.ts'],
      ...commonConfig,
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/__tests__/e2e/**/*.spec.ts'],
      ...commonConfig,
    },
  ],
};

module.exports = config;
