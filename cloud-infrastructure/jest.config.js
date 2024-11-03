module.exports = {
  modulePathIgnorePatterns: ["cdk.out"],
  testMatch: ["**/*.unit.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
