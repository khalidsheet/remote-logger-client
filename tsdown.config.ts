import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/main.ts"],
  outDir: "./dist",
  dts: true,
  sourcemap: true,
  format: ["esm"],
  minify: true,
  target: "es2022",
  clean: true,
});
