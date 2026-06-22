// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

import db from "@astrojs/db";

export default defineConfig({
  output: "server",
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    db(),
  ],

  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    maxDuration: 60,
  }),
});
