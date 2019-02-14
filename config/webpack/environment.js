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
      loader: "css-loader",
      query: {
        modules: true,
        localIdentName: "[name]__[local]___[hash:base64:5]"
      }
    }
  ]
});

environment.loaders.append("typescript", typescript);
module.exports = environment;
