require("./md4-shim");

const { environment } = require("@rails/webpacker");
const typescript = require("./loaders/typescript");

// Note on how these three interact with Webpacker's own rules: `loaders.append(key, ...)`
// deletes any existing entry with the same key first, so appending "css" *replaces*
// Webpacker's built-in `.css` rule (style-loader + css-loader + postcss + ExtractText)
// rather than adding to it. That is why "styles" is appended separately and why CSS is
// inlined by style-loader in production instead of extracted to its own file -- hence no
// `stylesheet_pack_tag` in app/views/web/index.html.erb.

environment.loaders.append("styles", {
  test: /\.css$/,
  use: "style-loader"
});

environment.loaders.append("css", {
  test: /\.css$/,
  use: [
    {
      loader: "css-loader",
      options: {
        // CSS Modules, configured explicitly rather than inherited. All 64 CSS imports in
        // app/javascript use the default-import form (`import styles from "./X.css"`),
        // which works because style-loader re-exports css-loader's `locals` object as the
        // default export. Do not add `namedExport` here: the previous loader set it to
        // true, which disagreed with every call site.
        modules: true,
        localIdentName: "[name]__[local]___[hash:base64:5]",
        importLoaders: 0
      }
    }
  ]
});

environment.loaders.append("typescript", typescript);
module.exports = environment;
