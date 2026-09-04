// Babel config for Shakapacker 6. Rather than copying Shakapacker's preset, this delegates
// to it and adds the one thing it omits: `@babel/preset-react`, which Shakapacker leaves
// out because its template targets plain JS. Delegating means later hops of the
// Webpacker -> Shakapacker ladder pick up preset changes for free instead of drifting from
// a hand-copied snapshot -- which is exactly how the `browserslist` key went missing at the
// Webpacker 4 hop. See UPGRADE_PLAN.md Phase 2c.
//
// The preset's `isTestEnv` branch is load-bearing for Jest: `@babel/preset-env` with
// `targets: { node: "current" }` leaves `modules` at "auto", i.e. CommonJS. Without it Jest
// fails with "Cannot use import statement outside a module", which reads like a ts-jest
// problem and is not one.
//
// Browser targets come from the `browserslist` key in package.json.
const shakapackerPreset = require("shakapacker/package/babel/preset.js");

module.exports = function (api) {
  const preset = shakapackerPreset(api);
  return {
    ...preset,
    presets: [...preset.presets, "@babel/preset-react"]
  };
};
