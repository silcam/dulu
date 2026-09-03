// Node 17+ ships OpenSSL 3, which removed MD4. webpack 4.47 handles that internally, but
// `compression-webpack-plugin` 4.0.1 -- pulled in by Webpacker 4 for the production `.gz`
// and `.br` assets -- calls `crypto.createHash("md4")` directly and unconditionally, so
// `RAILS_ENV=production assets:precompile` dies with
// `error:0308010C:digital envelope routines::unsupported`. Note this only bites in
// production: the plugin is registered in Webpacker's production environment only, which
// is why dev and test builds are unaffected and why the deploy would have been the first
// place to find out.
//
// The hash is used solely as a cache key for already-compressed output, so substituting
// sha256 changes nothing observable. Redirecting only "md4" leaves every other call site
// alone.
//
// This shim exists because of webpack 4, not Node. Delete it at the Shakapacker 6 hop,
// where webpack 5 lands and drops MD4 entirely -- see UPGRADE_PLAN.md Phase 2c step 3.
const crypto = require("crypto");

const createHash = crypto.createHash;
crypto.createHash = function(algorithm, ...rest) {
  return createHash.call(this, algorithm === "md4" ? "sha256" : algorithm, ...rest);
};
