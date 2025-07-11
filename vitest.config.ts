import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "eta-extended",
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    environment: "node",
    include: ["**/*.test.ts"],
  },
});
