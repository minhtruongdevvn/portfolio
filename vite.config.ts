import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, cpSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  // Source directory
  root: '.',

  // Disable publicDir since we have multiple asset directories
  publicDir: false,

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Disable sourcemaps in production to save storage/bandwidth
    sourcemap: false,
  },

  // Dev server configuration
  server: {
    port: 8080,
    open: true,
  },

  // Asset handling
  assetsInclude: ['**/*.svg', '**/*.jpg', '**/*.webp', '**/*.png'],

  // Plugins for copying assets
  plugins: [
    {
      name: 'copy-static-assets',
      writeBundle() {
        const staticDirs = ['assets', 'tabs', 'pics_optimized'];
        const staticFiles = ['rate-limit-error.html'];

        // Copy directories using Node.js fs.cpSync
        staticDirs.forEach(dir => {
          if (existsSync(dir)) {
            const targetDir = resolve(__dirname, 'dist', dir);
            cpSync(dir, targetDir, { recursive: true });
          }
        });

        // Copy individual files
        staticFiles.forEach(file => {
          if (existsSync(file)) {
            copyFileSync(file, resolve(__dirname, 'dist', file));
          }
        });
      },
    },
  ],
});
