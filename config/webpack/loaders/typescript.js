// ts-loader, not Babel: this is the only thing enforcing `"strict": true` on application
// code during the build. See UPGRADE_PLAN.md Phase 2e, which also explains why
// `yarn typecheck` exists alongside it.
//
// `noEmit: false` is the only override left. The original config also relaxed
// `noUnusedLocals`, `noUnusedParameters` and `noImplicitAny`, which is why 12 `TS6133`
// errors had accumulated unseen; those are cleared and the relaxations removed, so the
// build now enforces tsconfig.json as written and `yarn typecheck` is a plain
// `tsc --noEmit`.
module.exports = {
  test: /\.(ts|tsx)$/,
  use: [
    {
      loader: "ts-loader",
      options: {
        configFile: "tsconfig.json",
        compilerOptions: {
          noEmit: false
        }
      }
    }
  ]
};
