module.exports = {
    env: { browser: true, es2022: true, jest: true },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    settings: { react: { version: "detect" } },
    rules: { "react/prop-types": "off" },
};
