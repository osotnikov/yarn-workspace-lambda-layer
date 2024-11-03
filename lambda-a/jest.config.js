module.exports = {

  moduleDirectories: ['node_modules', '../node_modules'],
  moduleNameMapper: {
    "/opt/nodejs/util-logger": "../../util-logger"
  },
  testMatch: ["**/*.unit.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
