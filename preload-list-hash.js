import { version as viteVersion } from 'vite';

/**
 * Workaround for https://github.com/vitejs/vite/issues/24138: Vite writes the preload dependency
 * lists (`__vite__mapDeps`) into a chunk after hashing it. Feeding what decides the lists into the
 * hash of every chunk with a dynamic import makes a change to them rename the chunk.
 *
 * Covers the lists' inputs from the config and Vite's version, not values captured by a
 * `resolveDependencies` closure.
 */
export function preloadListHash() {
  let fingerprint = '';
  return {
    name: 'preload-list-hash',
    apply: 'build',
    configResolved({ base, build: { modulePreload } }) {
      fingerprint = JSON.stringify([
        viteVersion,
        base,
        modulePreload && {
          polyfill: modulePreload.polyfill,
          resolveDependencies: modulePreload.resolveDependencies?.toString(),
        },
      ]);
    },
    augmentChunkHash(chunk) {
      return chunk.dynamicImports.length > 0 ? fingerprint : undefined;
    },
  };
}
