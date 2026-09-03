// Babel 7 config, replacing the Babel 6 `.babelrc`. Taken from Webpacker 5's template
// (`lib/install/config/babel.config.js`) with one addition: `@babel/preset-react`, which
// the template omits because it targets plain JS. See UPGRADE_PLAN.md Phase 2c.
//
// The `isTestEnv` branch is load-bearing for Jest. `@babel/preset-env` with
// `targets: { node: 'current' }` leaves `modules` at its "auto" default, which compiles
// ESM to CommonJS -- exactly what the old `.babelrc`'s `env.test` block did by omitting
// `modules: false`. Remove that branch and Jest fails with "Cannot use import statement
// outside a module", which reads like a ts-jest problem and is not one.
//
// Browser targets come from the `browserslist` key in package.json. Without it
// `@babel/preset-env` has no targets and `useBuiltIns: 'entry'` pulls in nearly all of
// core-js; see Phase 2c.
module.exports = function(api) {
  var validEnv = ['development', 'test', 'production']
  var currentEnv = api.env()
  var isDevelopmentEnv = api.env('development')
  var isProductionEnv = api.env('production')
  var isTestEnv = api.env('test')

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(currentEnv) +
        '.'
    )
  }

  return {
    presets: [
      isTestEnv && [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      (isProductionEnv || isDevelopmentEnv) && [
        '@babel/preset-env',
        {
          forceAllTransforms: true,
          useBuiltIns: 'entry',
          corejs: 3,
          modules: false,
          exclude: ['transform-typeof-symbol']
        }
      ],
      '@babel/preset-react'
    ].filter(Boolean),
    plugins: [
      'babel-plugin-macros',
      '@babel/plugin-syntax-dynamic-import',
      isTestEnv && 'babel-plugin-dynamic-import-node',
      '@babel/plugin-transform-destructuring',
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true
        }
      ],
      [
        '@babel/plugin-proposal-object-rest-spread',
        {
          useBuiltIns: true
        }
      ],
      [
        '@babel/plugin-proposal-private-methods',
        {
          loose: true
        }
      ],
      [
        '@babel/plugin-proposal-private-property-in-object',
        {
          loose: true
        }
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false
        }
      ],
      [
        '@babel/plugin-transform-regenerator',
        {
          async: false
        }
      ]
    ].filter(Boolean)
  }
}
