export default [
  {
      files: [
          "**/*.ts",
          "**/*.cts",
          "**.*.mts"
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "off"
      }
  },
  // ...other config
];