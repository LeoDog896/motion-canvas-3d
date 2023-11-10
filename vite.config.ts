import { defineConfig } from "vite";
import motionCanvas from "@motion-canvas/vite-plugin";
import ffmpeg from "@motion-canvas/ffmpeg";
import path from "node:path";

export default defineConfig({
  plugins: [
    motionCanvas.default({
      project: ["./example/project.ts"],
    }),
    ffmpeg.default(),
  ],
  resolve: {
    alias: {
      "@motion-canvas/core": path.resolve("./node_modules/@motion-canvas/core"),
      "@motion-canvas/2d": path.resolve("./node_modules/@motion-canvas/2d"),
    },
  },
});
