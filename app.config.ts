import { defineConfig } from "@solidjs/start/config";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  server: {
    preset: "node",
  },
  vite: {
    plugins: [
      svgLoader({
        defaultImport: "url",
      }),
    ],
  },
});
