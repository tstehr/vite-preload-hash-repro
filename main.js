// chart.js is also imported by page.js, so it becomes a chunk of its own and ends up in
// page.js's preload list.
document.querySelector('#page').onclick = () => import('./page.js').then((m) => m.render());
document.querySelector('#chart').onclick = () => import('./chart.js').then((m) => m.chart());
