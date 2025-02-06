/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest',
  testEnvironment: "node",
  verbose: true,
  silent: false,
  transform: {
    "^.+\\.ts$": ["ts-jest",{}],
  },
  globals: {
    'ts-jest': {
        isolatedModules: true,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};