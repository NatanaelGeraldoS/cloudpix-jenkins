module.exports = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/tests/**/*.test.js"],
    reporters: [
        "default",
        [
            "jest-junit",
            {
                outputDirectory: "<rootDir>",
                outputName: "junit.xml",
            },
        ],
    ],
    collectCoverage: true,
    coverageReporters: ["text", "lcov", "json"],
    coverageDirectory: "<rootDir>/coverage",
};
