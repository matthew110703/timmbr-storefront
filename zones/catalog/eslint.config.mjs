import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "dist/**",
      "out/**",
      ".yalc/**",
      "**/.yalc/**",
    ],
  },
];

export default eslintConfig;
