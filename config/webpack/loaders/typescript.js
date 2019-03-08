module.exports = {
  test: /\.(ts|tsx)?(\.erb)?$/,
  use: [
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true
        // configFile: 'tsconfig.build.json'
        // compilerOptions: {
        //   strict: false,
        //   noUnusedLocals: false,
        //   noUnusedParameters: false,
        //   checkJs: false,
        //   noEmit: false
        // }
      }
    }
  ]
};
