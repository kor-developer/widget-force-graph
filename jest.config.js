/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.spec.json',
    },
  },
  setupFilesAfterEnv: [
    './jest.setup.ts',
    '@testing-library/jest-dom/extend-expect',
  ],
};
