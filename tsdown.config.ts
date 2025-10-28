import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/main.ts"],
  outDir: "./dist",
  dts: true,
  sourcemap: true,
  format: ["cjs", "esm"],
  minify: false,
  target: "esnext",
});
