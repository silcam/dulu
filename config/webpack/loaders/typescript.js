module.exports = {
  test: /\.(ts|tsx)?(\.erb)?$/,
  use: [
    {
      loader: "ts-loader",
      options: {
        compilerOptions: {
          strict: false,
          noUnusedLocals: false,
          noUnusedParameters: false,
          checkJs: false,
          noEmit: false
        }
      }
    }
  ]
};
