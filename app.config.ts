import { defineConfig } from "@solidjs/start/config";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  vite: {
    plugins: [
      svgLoader({
        defaultImport: "url",
      }),
    ],
  },
});
