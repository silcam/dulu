const { webpackConfig, merge } = require("shakapacker");
const typescript = require("./loaders/typescript");

// Shakapacker 6 replaced Webpacker's `environment.loaders.append(...)` API and its four
// per-environment entry files with a single plain webpack config object. See
// UPGRADE_PLAN.md Phase 2c.
//
// Two of Shakapacker's defaults have to be overridden, both for reasons that predate this
// upgrade:
//
//   1. CSS. Shakapacker treats plain `.css` as global stylesheets, extracts them with
//      mini-css-extract-plugin, and reserves CSS Modules for `*.module.css`. This app has
//      36 `.css` files, all of them CSS Modules, imported for their class map
//      (`import styles from "./X.css"`) and never linked as stylesheets -- which is why
//      app/views/web/index.html.erb has a `javascript_pack_tag` and no
//      `stylesheet_pack_tag`. So the default rule is dropped in favour of
//      style-loader + css-loader with `modules` on, and MiniCssExtractPlugin with it.
//      Renaming 36 files to `*.module.css` and adding a stylesheet tag would be the
//      idiomatic fix; it is a behaviour change and does not belong in a migration commit.
//
//   2. TypeScript. Shakapacker's babel rule matches `.ts`/`.tsx`, but this project
//      type-checks during the build via ts-loader rather than stripping types with Babel
//      (see Phase 2e). Babel must not also process them, so its rule is narrowed and
//      ts-loader is appended.

const isCssRule = rule => String(rule.test).includes("css");
const isBabelRule = rule =>
  Array.isArray(rule.use) &&
  rule.use.some(u => String(u.loader || u).includes("babel-loader"));

const rules = webpackConfig.module.rules
  .filter(rule => !isCssRule(rule))
  .map(rule =>
    isBabelRule(rule)
      ? { ...rule, test: /\.(js|jsx|mjs|coffee)$/ }
      : rule
  );

const plugins = webpackConfig.plugins.filter(
  plugin => plugin.constructor.name !== "MiniCssExtractPlugin"
);

module.exports = merge(
  { ...webpackConfig, module: { ...webpackConfig.module, rules }, plugins },
  {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                // CSS Modules, configured explicitly. `namedExport` must stay false:
                // every one of the 64 CSS imports in app/javascript uses the default-import
                // form, and css-loader 6 defaults `exportLocalsConvention` to camelCase
                // only when namedExport is on. `spec/cypress/integration/cssModules.spec.js`
                // asserts the generated class names, so a regression here fails the gate.
                modules: {
                  localIdentName: "[name]__[local]___[hash:base64:5]",
                  namedExport: false,
                  exportLocalsConvention: "asIs"
                },
                importLoaders: 0,
                esModule: false
              }
            }
          ]
        },
        typescript
      ]
    },
    resolve: {
      extensions: [".css"]
    }
  }
);
