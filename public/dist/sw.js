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
    "url": "0.371e4faeb7161ab97ca8.chunk.js",
    "revision": "a4a5fce14b7a10e0015fc347fe6cb5c7"
  },
  {
    "url": "1.c014dc99ef87fd50091b.chunk.js",
    "revision": "d6002230e59346233cbc52770a381e8c"
  },
  {
    "url": "2.0eaac7d82c4f01b9e330.chunk.js",
    "revision": "f50e34adc0b1573540eb1e6e11ba18ea"
  },
  {
    "url": "3.4ac205d13d67317c2a32.chunk.js",
    "revision": "bfdb1fe30bb099a145719288ae752414"
  },
  {
    "url": "4.62186752de63f48c6d0d.chunk.js",
    "revision": "abc1229e6c77284e94ad2d71f8395c16"
  },
  {
    "url": "5.da7bc290e42b17ce56d4.chunk.js",
    "revision": "8774129ed73cb2d8509d0625a2223137"
  },
  {
    "url": "6.38c9cff9f87325820245.chunk.js",
    "revision": "0250127c390f2ba206d37b1d532567ee"
  },
  {
    "url": "index.html",
    "revision": "33cc222fc997ff46a900a3199127ccaf"
  },
  {
    "url": "inline.0004ba89a3b044f804eb.bundle.js",
    "revision": "9f04db867fbeca26f23320d5c8cce94b"
  },
  {
    "url": "main.ff243bc1e1320d6a486e.bundle.js",
    "revision": "bd44a30aa3c4adcc2609e9e802d88bf2"
  },
  {
    "url": "polyfills.010b58c8bcc161c389fb.bundle.js",
    "revision": "233c31c8780348db9116e1f0adafac48"
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
    "url": "vendor.c278e44dbce917450047.bundle.js",
    "revision": "7995917f322b659e74d69450d369ee48"
  }
];

const workboxSW = new self.WorkboxSW({
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
workboxSW.router.registerNavigationRoute("/index.html");
