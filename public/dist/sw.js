importScripts('workbox-sw.prod.v2.1.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "0.555c5d8bb0011b51bce7.chunk.js",
    "revision": "0b531376d73fec3e942362e6174b3f34"
  },
  {
    "url": "1.82d723c60b529d8eb6ae.chunk.js",
    "revision": "e71f1e30f6fba38b6c412a87c6fd74f5"
  },
  {
    "url": "2.f41ea4b8dc6efe22f4b2.chunk.js",
    "revision": "d73dd16b38a9ae8e07383d46804ad433"
  },
  {
    "url": "3.f617acef81a6e4fd5cc1.chunk.js",
    "revision": "3bc23adf01d4812603e15cdc76101589"
  },
  {
    "url": "4.ce3b5094903b53820f7d.chunk.js",
    "revision": "06bad3cfa6114209192d2b14de8918cc"
  },
  {
    "url": "5.356dd1962dcb20442b48.chunk.js",
    "revision": "f444c8277668532e0273013045257b23"
  },
  {
    "url": "6.269bb597e34b9466d848.chunk.js",
    "revision": "619b8c75c2296e23120fd3a5cd408d9d"
  },
  {
    "url": "index.html",
    "revision": "b197742bf60fe166cb1886d3650a104a"
  },
  {
    "url": "inline.d28c0fdbe93500d3962e.bundle.js",
    "revision": "4cc3407344d3ba278fc1959dba5258a1"
  },
  {
    "url": "main.a4b5fc34d7343f652f71.bundle.js",
    "revision": "48af85e30e9a6c9fd4ac3a32674f1b15"
  },
  {
    "url": "polyfills.8781208f54509d7078ce.bundle.js",
    "revision": "c3fe46e01cef64e596e5a0bdd9c818bf"
  },
  {
    "url": "scripts.2c3165750ceb33a13b88.bundle.js",
    "revision": "5d06ed9ab331f23b1d5ea72c9d1b31bc"
  },
  {
    "url": "styles.12b556f664a775c64e57.bundle.css",
    "revision": "12b556f664a775c64e5769333bfa5f81"
  },
  {
    "url": "vendor.9e8fa6bcc58b14674c50.bundle.js",
    "revision": "6c303ec96939693c8ba2ef1fc906ca71"
  }
];

const workboxSW = new self.WorkboxSW({
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
workboxSW.router.registerNavigationRoute("/index.html");
