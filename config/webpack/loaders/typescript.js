module.exports = {
  test: /\.(ts|tsx)?(\.erb)?$/,
  use: [
    {
      loader: "ts-loader",
      options: {
        // transpileOnly: true
        configFile: "tsconfig.json",
        compilerOptions: {
          noEmit: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
          noImplicitAny: false
        }
      }
    }
  ]
};
