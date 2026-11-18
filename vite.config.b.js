// Only difference to vite.config.a.js: the large chart chunk is no longer preloaded along with
// the chunks that import it.
export default {
  build: {
    outDir: 'dist-b',
    emptyOutDir: true,
    minify: false,
    modulePreload: {
      resolveDependencies: (filename, deps) => deps.filter((dep) => !dep.includes('chart')),
    },
  },
};
