// jest.config.ts
import { pathsToModuleNameMapper } from 'ts-jest'
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from './tsconfig'

module.exports = {
  moduleDirectories: ['node_modules', '../node_modules'],
  moduleNameMapper: {
    "/opt/nodejs/lambda-common": "../lambda-common/bin"
  },
  testMatch: ["**/*.test.ts"],
  testPathIgnorePatterns: [".*infrastructure\.test\.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
