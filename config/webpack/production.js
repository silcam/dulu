const environment = require("./environment");

environment.config.set("devtool", "source-map");

module.exports = environment.toWebpackConfig();
