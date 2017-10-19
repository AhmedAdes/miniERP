const build = require("workbox-build");
const SRC_DIR = "./";
const BUILD_DIR = "dist";

const options = {
  swDest: `${BUILD_DIR}/sw.js`,
  globDirectory: BUILD_DIR,
  navigateFallback: "/index.html",
  clientsClaim: true,
  // runtimeCaching: [
  //   {
  //     urlPattern: "/api/(.*)/", // reg ex
  //     handler: "networkFirst" // caching strategy
  //   }
  // ],
  handleFetch: true
};

build.generateSW(options).then(() => {
  console.log("Generated service worker with static cache");
});
