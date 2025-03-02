/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: "node",
  verbose: true,
  silent: false,
  transform: {
    "^.+\\.ts$": ["ts-jest",{isolatedModules: true}],
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1", // Supprime le .js des imports
  },
};