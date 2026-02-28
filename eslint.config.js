export default [
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-eval": "error",
      "no-new-func": "error"
    }
  }
];
