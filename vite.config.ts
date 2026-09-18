
import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@utils": fileURLToPath(new URL("./SPA/utils", import.meta.url)),
      "@components": fileURLToPath(new URL("./SPA/components", import.meta.url)),
    },
  },
  test: {
    environment: "node",
  },
});