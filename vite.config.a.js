import { preloadListHash } from './preload-list-hash.js';

// Default modulePreload behavior.
export default {
  plugins: [preloadListHash()],
  build: { outDir: 'dist-a', emptyOutDir: true, minify: false },
};
