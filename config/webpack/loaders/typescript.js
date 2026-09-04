// ts-loader, not Babel: this is the only thing enforcing `"strict": true` on application
// code during the build. See UPGRADE_PLAN.md Phase 2e, which also explains why
// `yarn typecheck` exists alongside it.
//
// The `noUnusedLocals`/`noUnusedParameters`/`noImplicitAny` overrides below are inherited
// from the original config and are why 12 `TS6133` errors sit in the codebase; clearing
// those is a Phase 2f item, after which these three lines can go.
module.exports = {
  test: /\.(ts|tsx)$/,
  use: [
    {
      loader: "ts-loader",
      options: {
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
