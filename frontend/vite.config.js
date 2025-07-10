import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import Sitemap from "vite-plugin-sitemap";
import { getPostIds } from './sitemap-data-fetcher.js';
import process from 'node:process';

export default defineConfig(async ({ mode }) => {

  const env = loadEnv(mode, process.cwd(), '');

  const backendUrl =
    env.VITE_BACKEND_URL || 'https://project-app-back.vercel.app/';

  const postIds = await getPostIds(backendUrl);

  const postRoutes = postIds.map(id => `/post/${id}`);

  console.log(`Sitemap will include ${postRoutes.length} post routes`);

  const hostname = env.VITE_FRONTEND_URL || 'https://faxrn.vercel.app/';

  return {
    plugins: [
      react(),
      tailwindcss(),
      Sitemap({
        hostname,
        dynamicRoutes: [...postRoutes],
        exclude: ['/admin', '/login', '/register', '/create-post', '/edit-profile', '/verify-email', '/resend-verification', '/forgot-password', '/reset-password']
      }),
    ],
    build: {
      sourcemap: true, // Enable source maps for production
      rollupOptions: {
        output: {
          // Separate source maps from main bundles for security
          sourcemapExcludeSources: false,
        }
      }
    },
  };
});
