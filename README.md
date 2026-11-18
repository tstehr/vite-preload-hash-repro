# Vite: chunk content changes without its hashed name changing

`build.modulePreload.resolveDependencies` changes the preload dependency list
Vite writes into a chunk, but not the chunk's hashed file name. The same name
thus ends up with different content across two builds, which breaks caches that
treat hashed assets as immutable.

```sh
npm install
npm run build
diff -ru dist-a dist-b
```

`npm run build` builds the app twice, unminified: with `vite.config.a.js`
(default) into `dist-a`, and with `vite.config.b.js` into `dist-b`. Config B
uses `resolveDependencies` to stop preloading a large chunk (`chart.js`) along
with the page that imports it. Vite's build output already lists the same
`index-*.js` name in both, with different sizes.

The diff, with Vite 8.3.8: the preload list of `page.js` loses `chart.js`, but
the importing chunk keeps its name.

```diff
diff -ru dist-a/assets/index-II3NhJ1J.js dist-b/assets/index-II3NhJ1J.js
--- dist-a/assets/index-II3NhJ1J.js
+++ dist-b/assets/index-II3NhJ1J.js
@@ -1,4 +1,4 @@
-const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-Md2Z0oH3.js","assets/chart-BPQW5lp1.js"])))=>i.map(i=>d[i]);
+const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/page-Md2Z0oH3.js"])))=>i.map(i=>d[i]);
 // \0vite/modulepreload-polyfill.js
 (function polyfill() {
 	const relList = document.createElement("link").relList;
@@ -130,5 +130,5 @@
 	});
 };
 // main.js
-document.querySelector("#page").onclick = () => __vitePreload(() => import("./page-Md2Z0oH3.js").then((m) => m.render()), __vite__mapDeps([0,1]));
+document.querySelector("#page").onclick = () => __vitePreload(() => import("./page-Md2Z0oH3.js").then((m) => m.render()), __vite__mapDeps([0]));
 document.querySelector("#chart").onclick = () => __vitePreload(() => import("./chart-BPQW5lp1.js").then((m) => m.chart()), []);
```

Had the name followed the content, `diff` would report `Only in` lines for the
two differently named files instead.
