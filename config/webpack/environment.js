const { environment } = require("@rails/webpacker");
const typescript = require("./loaders/typescript");

environment.loaders.append("styles", {
  test: /\.css$/,
  use: "style-loader"
});

environment.loaders.append("css", {
  test: /\.css$/,
  use: [
    {
      loader: "typings-for-css-modules-loader",
      query: {
        modules: true,
        namedExport: true,
        localIdentName: "[name]__[local]___[hash:base64:5]"
      }
    }
  ]
});

environment.loaders.append("typescript", typescript);
module.exports = environment;
