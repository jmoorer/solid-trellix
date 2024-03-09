import { defineConfig } from "@solidjs/start/config";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  server: {
    logLevel: 0,
  },
  vite: {
    plugins: [
      svgLoader({
        defaultImport: "url",
      }),
    ],
  },
});
