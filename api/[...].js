import('./../.output/server/index.mjs').then(mod => {
  module.exports = mod.default || mod;
}).catch(err => {
  console.error('Failed to load Nitro server:', err);
  throw err;
});
