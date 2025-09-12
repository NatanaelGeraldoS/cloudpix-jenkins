module.exports = {
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.js"],
    reporters: [["jest-junit", { outputName: "jest-results.xml" }]],
};
