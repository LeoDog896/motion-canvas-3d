import { defineConfig } from "vite";
import path from "node:path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "MotionCanvas3D",
      fileName: "motion-canvas-3d",
    },
    rollupOptions: {
      external: [
        "@motion-canvas/core",
        "@motion-canvas/2d",
        "three",
        "@motion-canvas/2d/lib/components",
        "@motion-canvas/core/lib/signals"
      ],
    },
  },
});
