# Dulu Upgrade Plan

**Target:** Rails 8.0 + Ruby 3.4, React 18 + React Router 6, Node 20, Shakapacker
**From:** Rails 5.1.6.2 + Ruby 2.5.0, React 16.8, Node 12.22.6, Webpacker 3.3.1
**Live deploy target:** `config/deploy/production.rb` (Capistrano + Passenger)

### Deploy reality — settled by Brian, 2026-09-03

Two questions were open here. Both are now closed and this plan does not re-raise them:

1. **Which host actually serves production is Brian's to determine**, and is out of scope
   for this plan. The tracked configs are `deploy/production.rb`, `deploy/testing.rb`, and
   an untracked `deploy/amazon.rb`; the plan assumes `production.rb` and touches no deploy
   config except where a phase requires it (`Capfile`'s `rbenv_ruby` in Phases 1, 5a, 6;
   `linked_files` in Phase 5b).
2. **No staging environment will be stood up.** `deploy/testing.rb` sets
   `branch: "testing"` and no such branch exists, so it is dead as written — and that is
   accepted rather than fixed. The consequence, carried deliberately through the rest of
   this plan: every phase gate ends at *tests green + local production-env boot*, and the
   two phases whose correctness cannot be fully proven that way (4 and 5) carry explicit
   rollback notes instead of "rehearse on staging". Phase 4's OmniAuth change in
   particular has **no automated gate at all** — see that phase.

---

## Baseline (verified 2026-09-03, before any changes)

| Check | Result |
|---|---|
| `bin/rails test` | **396 tests, 1285 assertions, 0 failures, 0 errors, 1 skip** |
| `npx jest --ci` | **24 suites passed, 125 tests passed, 1 skipped** |
| `bundle check` | dependencies satisfied |
| `yarn test:cypress:run` | **18 specs, 92 tests, 92 passing** (after the two spec fixes in Phase 0) |

**The baseline is green.** That is the single most important fact in this plan: every
subsequent phase has a trustworthy pass/fail signal, so breakage is always attributable
to the hop that caused it.

### Codebase size

- Ruby: 162 files, ~9,900 LOC (`app` + `test`)
- TypeScript/React: 324 files, ~17,300 LOC (211 `.tsx`, 109 `.ts`, 36 `.css`, 3 `.js`)
- Only **1** non-TS entrypoint (`app/javascript/application/index.js`), **1** webpack pack

### Risk is in config and toolchain, not application code

Greps for the usual upgrade landmines came back essentially empty:

- `update_attributes`: **0**  ·  `before_filter`/`skip_before_filter`: **0**  ·  `render text:`: **0**
- `Fixnum`/`Bignum`: **0**
- `componentWillMount`/`componentWillReceiveProps`/`componentWillUpdate`: **0**
- Class components: **2** files (63 files already use hooks)
- Enzyme: configured but **called by zero tests**

This codebase was kept modern internally. Budget accordingly — the work is in
framework config, the JS build chain, and three specific breaking library changes
(OmniAuth 2 in Phase 4, the Webpacker retirement in Phase 2, and React Router 6 in
Phase 7), not in a long tail of application rewrites.

---

## Verification recipe (run at the end of every phase)

Defined once here; each phase says "run the gate" rather than repeating it.

```shell
nvm use                            # Phase 2 onward: .nvmrc pins Node 20.11.1
bin/rails test                     # must stay at 396 tests / 1285 assertions, 0 failures
npx jest --ci                      # must stay at 125 passed
yarn test:cypress:gate             # 19 specs / 93 tests -- see notes below
yarn typecheck                     # Phase 2 onward -- see "Where type-checking lives"
bundle exec brakeman               # compare against the 7 known warnings (below)
bin/rails runner -e development 'puts Rails.version'
bin/rails zeitwerk:check           # Phase 3 onward only

# Production-config boot. Needs both env vars: config/database.yml's production block
# has no credentials (it would try to connect as the local OS user), and the local
# config/secrets.yml has no production section, which Rails 5.2+ treats as fatal.
DATABASE_URL=postgres://dulu:dulu@localhost/dulu_test \
SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'print SecureRandom.hex(64)') \
  bin/rails runner -e production 'puts Rails.version'

# From Phase 2 onward, also confirm what deploy actually runs:
RAILS_ENV=production bin/rails assets:precompile
yarn install --check-files         # MANDATORY after the line above -- see below
```

**`assets:precompile` prunes your node_modules.** Rails enhances that task with
`yarn:install`, which under `RAILS_ENV=production` runs
`yarn install --production --frozen-lockfile` and deletes every devDependency from the
local tree. Jest and ts-jest are gone until you reinstall, and the *next* precompile then
fails on whatever the build itself needed but was not a real dependency — which is how
`@babel/preset-react` and the `@types/*` packages were found to be misfiled. Two
consequences, both permanent: every package the build touches belongs in `dependencies`,
not `devDependencies`; and `yarn install --check-files` follows every precompile. Plain
`yarn install` is not enough — after a partial install yarn considers the tree done and
skips relinking.

**`yarn testPacks` before Cypress, not the webpack binstub.** `yarn test:cypress:gate`
runs `RAILS_ENV=test bin/rails webpacker:compile` first. It has to be the rake task: the
binstub compiles but does not record the compilation digest, so Rails still considers the
packs stale and recompiles on the first request. A cold
`public/packs-test` otherwise makes the first `cy.visit` of a run sit through a ~60s
webpack build and fail as `ESOCKETTIMEDOUT` — in whichever spec happens to run first,
which reads like a random failure and is not one.

**`spec/cypress/integration/cssModules.spec.js` is load-bearing.** Nothing else in any
suite can see CSS Modules break. Jest maps `*.css` to `styleMock.js`, and every other
Cypress assertion selects by text, so the entire app can ship with each
`className={styles.x}` evaluating to `undefined` while all 125 Jest tests and all 92
pre-existing E2E tests still pass; `assets:precompile` only proves the build ran. That
spec checks the two halves of the interop separately, because they fail separately: that
`styles.foo` produced a real scoped name, and that a rule for that exact generated name
reached the browser and applied. Only the second catches correctly-hashed CSS paired with
a JS side that got nothing. It was committed and confirmed green *before* the first
version bump in Phase 2, so a failure identifies the hop that caused it. If a migration
step deliberately changes `localIdentName`, update the regex in that file -- do not loosen
it to where `undefined` would pass.

**Use `test:cypress:gate`, not `test:cypress:run`.** The pre-existing
`test:cypress:run` passes `--browser chrome`. This machine has Chrome 152 while Cypress
is pinned at 4.1.0 (early 2020, contemporary with Chrome 80), and that pairing kills the
browser mid-run: the suite hangs indefinitely with the Rails server still answering in
20ms and no database contention. `test:cypress:gate` uses Cypress' bundled Electron,
which is version-matched and completed the suite reliably every time. Revisit once
Cypress itself is upgraded in Phase 6.

**Read a single Cypress failure as noise until it repeats.** During Phase 2c the suite
settled into roughly one failure per two runs — a *different* spec every time, always a
`Timed out retrying:`, on a development machine sitting at load ~11 on 8 cores with under
1 GB of RAM free and browser renderers pegged at 90% CPU. No test on that tree ever failed
twice in a row, and warm runs went 93/93 repeatedly. A broken bundle does not behave that
way: it fails the *same* test every run. `defaultCommandTimeout` is now 30s (from 10s) to
widen the retry window, which hides nothing — a genuinely broken build never resolves and
still fails, just later. The rule for the remaining phases: a failure that moves between
runs is environmental; a failure that repeats is real. Re-run before investigating, and
check `/proc/loadavg` before blaming the migration.

**`git diff db/schema.rb` after every gate run.** `test/test_helper.rb` line 3 executes
`` `rails db:migrate` `` at load time, so *every* `bin/rails test` can silently rewrite a
tracked file. In Phase 1 this produced a harmless reformat (Rails 5.2 writes the version
as `2020_03_12_075605` instead of `20200312075605`, same value). From Phase 3 onward a
schema diff appearing mid-phase will look like "the upgrade changed my schema" when it is
just this line. Expect the diff to be empty, and explain it when it is not.

**Confirm the lockfile stays deployable.** `config/deploy.rb` sets
`bundle_flags '--deployment'`, which refuses to re-resolve: if `Gemfile.lock` does not
satisfy `Gemfile` exactly, the deploy fails at `bundle install` and no local test catches
it. After any dependency change, run `BUNDLE_FROZEN=true bundle install` and confirm it
succeeds *and* leaves `Gemfile.lock` unmodified.

**Watch for orphaned test servers.** `concurrently -k` does not always reap the Puma
child. A leftover process on port 3002 makes the *next* run bind-fail and silently test
stale code. Confirm the port is free before each gate run:
`ss -ltnp | grep :3002`.

**Turn deprecations into failures.** Before the first hop, add to
`config/environments/test.rb`:

```ruby
config.active_support.deprecation = :raise
```

This is what makes a multi-hop Rails upgrade tractable. Without it, each version's
deprecation warnings scroll past in the test output and become hard errors two hops
later, at which point you can no longer tell which change caused them.

**Two commits per hop, always:**

1. Gem/package bump + `rails app:update` (accept the generated files, change nothing else)
2. Adopt the new framework defaults one at a time, then **delete** the
   `new_framework_defaults_X_Y.rb` file

Skipping step 2 is why `config/initializers/new_framework_defaults.rb` *and*
`new_framework_defaults_5_1.rb` both still sit in this repo while
`config/application.rb` says `config.load_defaults 5.1`. Left undone, you arrive at
Rails 8 with six of these files and no idea which defaults are actually live.

---

## Phase 0 — Hygiene and a readable working tree

No version changes. This phase exists because per-hop `git diff` is the primary
verification instrument for everything that follows, and right now it is unreadable.

1. **Resolve the untracked files.** Current state:
   - `LIVE_DUMP/`, `yarn-error.log` → gitignore (or delete)
   - `notes.txt`, `rick-meeting.txt` → unrelated feature scratch notes from 2020.
     Archive or delete; they are not upgrade material (checked — they describe event/docket
     work, not a prior upgrade attempt).
   - `old--jest--config--js` → superseded by the `jest` key in `package.json`. Delete.
   - `config/.ruby-version` (pinned `2.7.4`, while root `.ruby-version` says `2.5.0`) →
     delete the stray file. Root `.ruby-version` is the real one and Phase 1 updates it.
   - `config/deploy/amazon.rb` → not the live target (production.rb is). Delete, or commit
     it clearly marked as unused. Do not leave it untracked and ambiguous.

2. **Delete the stray Cypress scaffolding.** Root `cypress.json` is literally `{}` and
   root `cypress/` contains only Cypress's own `integration/examples/*` boilerplate. The
   real suite is `spec/` (`spec/cypress.json` sets `baseUrl: localhost:3002`, and
   `package.json` runs `cypress --project ./spec`). Removing the root copies eliminates a
   trap where someone runs Cypress from the wrong project root and sees example tests pass.

3. **Establish the Cypress baseline.** DONE. First run was 90/92, with two failures,
   both since fixed (test-only changes — the application renders correctly in both cases,
   verified against the DOM):

   - `spec/cypress/support/commands.js` — `searchFill` stored one `cy.wrap()` chainable
     and reused it for three commands. A wrapped subject is consumed by the command it is
     passed to, so the final `.type("{Enter}")` ran against the leftover subject from
     `.parent().within()` — the dropdown `<li>`, which React detaches as soon as search
     results re-render. Intermittent "element is detached from the DOM". Fixed by
     re-wrapping per command. Affects 4 call sites across 3 specs.
   - `spec/cypress/integration/translationActivities.spec.js` — `cy.contains("tr",
     "Genesis")` was ambiguous. The Events table loads asynchronously and renders a
     "Genesis Checking" row with only two `<td>`s, so which row matched depended on load
     timing and `td:nth-child(3)` was sometimes absent. Fixed by matching the name cell
     exactly (`/^Genesis$/`).

   Suite is now **92/92 green** and is a trustworthy gate.

4. **Triage the branch backlog.** 15 local feature branches and 21 unmerged remote
   dependabot branches. Merge or close what matters *before* upgrading; after Ruby and
   Rails move, every one of those branches becomes significantly harder to rebase.

5. **Confirm gems are still resolvable.** Note the environment warning:
   `RubyGems 3.1.4 has a bug that prevents required_ruby_version from working for Bundler`.
   Run `gem update --system` before Phase 1 or bundler will mis-resolve during the hops.

**Gate:** full recipe green, `git status` clean.

---

## Phase 1 — Ruby 2.5.0 → 2.7.4, Rails 5.1 → 5.2

Ruby moves first and moves once. Verified against the real gemspecs:

| Rails | `required_ruby_version` |
|---|---|
| 5.2.8.1 | >= 2.2.2 |
| 6.0.6.1 | >= 2.5.0 |
| 6.1.7.10 | >= 2.5.0 |
| 7.0.8.7 | >= 2.7.0 |
| 7.1.5.1 | >= 2.7.0 |

Ruby 2.7 therefore covers **Rails 5.2 through 7.1** — four hops with no further Ruby
change. `rbenv` already has 2.7.4 installed locally.

1. `rbenv local 2.7.4`, update root `.ruby-version`, and update `Capfile`'s
   `set :rbenv_ruby` (capistrano-rbenv pins the Ruby version for deploys — this must
   match or production breaks). The pin is in `Capfile`, not `config/deploy.rb`.
2. Expect **keyword-argument deprecation warnings** — this is Ruby 2.7's signature noise.
   With `deprecation = :raise` set, these surface as failures. Fix them; they are real
   Ruby 3.0 blockers you would otherwise hit in Phase 5.
3. Bump `rails` to `~> 5.2.8`, then `rails app:update`.
4. `config.load_defaults 5.2`, adopt defaults, delete
   `new_framework_defaults_5_2.rb` — **and** clean up the two stale files from earlier
   upgrades (`new_framework_defaults.rb`, `new_framework_defaults_5_1.rb`).
5. Rails 5.2 brings `config/credentials.yml.enc`. Do **not** migrate secrets yet
   (that is Phase 5b) — just note the mechanism now exists.
6. Bump `pg` (1.0.0 → 1.5.x) and `sprockets` while here.

**Gate:** full recipe green.

---

## Pre-existing security findings (surfaced in Phase 1, fixed in Phase 8)

`brakeman 4.2.0` **crashed silently on Ruby 2.7** — its vendored
`unicode-display_width` calls the removed `Gem.gunzip`, so it exited 0 printing nothing
and was a useless gate. Raised to 5.4.1 (the ceiling on Ruby 2.7; brakeman 6+ needs Ruby
3.0) in Phase 1, which made these visible. **These are pre-existing application issues,
not upgrade regressions**, and were deliberately not fixed as part of an upgrade commit:

| Confidence | Type | Location |
|---|---|---|
| High | Remote Code Execution | `app/controllers/api/permissions_controller.rb:3` — `params[:type].constantize` |
| Medium | Mass Assignment | `app/controllers/api/people_controller.rb:46` — `params.permit!` |
| Medium | SQL Injection | `app/models/event.rb:120` |
| Medium | SQL Injection | `app/models/concerns/multi_word_search.rb:13` |
| Weak | SQL Injection | `app/models/domain_report.rb:64` — interpolated `@period.finish` |

The unsafe `constantize` on user-supplied input is worth looking at first. **Brian's
decision (2026-09-03): these are folded into a post-upgrade pass — Phase 8 below.** They
stay out of every upgrade commit so that a security change is never entangled with a
version bump.

Two further brakeman warnings are **expected** mid-upgrade and resolve on their own by
Phase 6: "Support for Rails 5.2.8.1 ended" and "Support for Ruby 2.7.4 ended".

Also note `config/brakeman.ignore` holds 5 entries that no longer match anything — they
reference `app/views/dashboard/dashboard.html.erb`, `app/views/languages/show.html.erb`
and `app/views/clusters/index.html.erb`, ERB views deleted during the React migration.
The file can be regenerated or emptied.

---

## Deferred pins to unwind later

Phase 1 added three constraints that exist only to hold the dependency graph on Ruby 2.7.
Each should be revisited at the phase named:

| Pin | Reason | Unwind at |
|---|---|---|
| `nokogiri "~> 1.15.7"` | nokogiri >= 1.16 requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) |
| `delayed_job "~> 4.1.11"` | 4.2 needs `ActiveJob::QueueAdapters::AbstractAdapter`, Rails 7.1+ only | Phase 5 (Rails 7.1) |
| `brakeman "~> 5.4"` | brakeman 6+ requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) |

Two more known blockers, not yet actionable:

- **`rb-inotify` 0.9.10** warns `rb_safe_level will be removed in Ruby 3.0`. Dev-group
  only (the `listen` file watcher). Bundler will not move it while `listen` is held at
  3.1.5; expect this to free up when `sass-rails` moves in Phase 3/4. **Must be resolved
  before Phase 5.**
- **`capybara` 2.18.0** is now a direct dependency (see Phase 1 notes) and is ancient.
  It only backs `test/system`, which `bin/rails test` does not run by default, so a bump
  would be unverified by the gate. Bump it in Phase 3 alongside the Rails 6 work, and be
  aware capybara 3 changed text-matching semantics.
- **`debase`** will not build on Ruby 3.4; replace with the `debug` gem in Phase 6.

---

## Phase 2 — Webpacker 3 → Shakapacker, and Node 12 → 20 (joint frontend/backend step)

This is the phase most upgrade plans get wrong by splitting it. It cannot be split:

- **Webpacker is dead.** The gem tops out at 5.4.4 and is retired in Rails 7. Its
  maintained continuation is `shakapacker` (currently 10.3.2). The gem and the npm
  package are version-locked to each other, so `webpacker (3.3.1)` +
  `@rails/webpacker (^3.3.1)` must move together.
- **Modern Node breaks jest 23 / ts-jest 23** regardless of anything Rails does.
- Rails 7 (Phase 5) *forces* the bundler decision. Doing it here, on the stable Rails 5.2
  footing from Phase 1, means one variable at a time — and Shakapacker only requires
  `railties >= 5.2` and Ruby >= 2.7 (verified against rubygems), both of which Phase 1
  delivers. So this does not need to wait for Rails 6.1.

**Recommendation: Shakapacker**, not `jsbundling-rails`+esbuild or Vite. Reason: the
webpack config is genuinely small — one pack (`app/javascript/packs/application.js`) and
three appended loaders in `config/webpack/environment.js` (style-loader, CSS modules,
TypeScript). Shakapacker is the continuation of what is already here, so this becomes a
config migration rather than a build-system rewrite. Revisit Vite only if faster dev
rebuilds later become a goal in their own right.

### 2a. The CSS Modules gate comes first (done)

Before any version changes: `spec/cypress/integration/cssModules.spec.js`, described in
the verification recipe above. The ladder below walks through several css-loader and
style-loader majors that each touched the CSS-Modules-to-JS interop, and no other test in
any suite can see that break. Committed green on webpacker 3.3.1 so that a later failure
names the hop that caused it.

Two facts checked while writing it, both of which shape the migration:

- **All 64 CSS imports use the default-import form** (`import styles from "./X.css"`),
  while `config/webpack/environment.js` configures the loader with
  `namedExport: true`. Those disagree; the default import works today only because
  something in the current loader chain re-exports the locals object. css-loader's
  `modules.namedExport` default has since flipped, which would break all 64 call sites at
  once — so set it explicitly rather than inheriting a default.
- **Zero CSS class names are kebab-case**, so `exportLocalsConvention` is not
  load-bearing. This matters because four components use bracket access
  (`styles[styleClass]` in `AlertBox`, `StyledTable`, `StyledText`, `icons/Icon`), which
  is exactly where a camelCasing convention change would bite. It cannot here.

### 2b. Node 12 → 20 first, not last (revised — the original plan was wrong)

This section originally said the opposite: stay on a contemporaneous Node through the
webpacker 4 and 5.4.4 hops, and move Node up only at the Shakapacker 6 boundary where
webpack 5 lands, so as not to fight MD4-on-OpenSSL-3. The reasoning was sound and the
conclusion was wrong. **Node 12 cannot resolve this dependency tree at all in 2026**, and
neither can Node 18:

| Package | Engine floor | Reached via |
|---|---|---|
| `node-releases` 2.0.54 | `>=18` | `browserslist` ← `@babel/preset-env` |
| `minimatch` 10.2.6 | `18 \|\| 20 \|\| >=22` | (many) |
| `brace-expansion` 5.0.9 | `20 \|\| >=22` | `minimatch` |

These are 2026 publishes of packages that old `^` ranges still resolve to. Pinning them
one at a time is whack-a-mole with no end. So: **Node 20.11.1**, pinned in `.nvmrc`, at
the very first hop. The gate now starts with `nvm use`.

Three consequences that came with it:

- **MD4 is a real problem, but a small and localised one.** webpack 4.47 handles it
  internally. `compression-webpack-plugin` 4.0.1 does not — it calls
  `crypto.createHash("md4")` directly and unconditionally (`cache: false` does not avoid
  it), and Webpacker registers that plugin **only in its production environment**. So dev
  and test builds are unaffected and `RAILS_ENV=production assets:precompile` is the only
  thing that fails — meaning without that check in the gate, the deploy would have been
  the first place to find out. `config/webpack/md4-shim.js`, required at the top of
  `config/webpack/environment.js`, redirects that one algorithm to sha256. The hash is a
  cache key, so nothing observable changes. **Delete the shim at the webpack 5 hop.**
- **yarn must be pinned.** Corepack on Node 20 resolves a bare `yarn` to Yarn 4, which
  would rewrite the v1 lockfile into a Yarn Berry migration nobody asked for.
  `"packageManager": "yarn@1.22.22"` in `package.json` holds Yarn Classic.
- **`node-sass` is resolution-pinned to 9.0.0.** Webpacker 4 depends on it; this app has
  zero `.sass`/`.scss` files, so it only has to *install*, and 9.0.0 is the first release
  that builds on Node 20. It disappears with Webpacker.

The worry that Cypress 4.1.0 would not run on Node 20 **did not materialise** — it drives
its own bundled Electron 78 and completed the suite normally. No need to pull the Cypress
upgrade forward from Phase 6.

### 2c. The ladder

**Do not jump 3.3.1 → 10 in one move.** Shakapacker's migration guides assume you are
coming from Webpacker 5/6, and webpack itself goes 3 → 5 underneath you (loader API,
`resolve`, and plugin changes at each major). A direct leap has no guide for either half,
and you would debug webpack 5 breakage and Shakapacker config breakage simultaneously.

Four real hops, each gated:

1. **`webpacker 3.3.1 → 4.3.0` — done.** Really a **Babel 6 → 7 migration**: `.babelrc`
   was Babel 6 syntax throughout, and webpacker 4 expects `babel.config.js` with
   `@babel/*` packages. Both `babel.config.js` and `postcss.config.js` come from the
   gem's own install templates (`lib/install/config/`), with one addition —
   `@babel/preset-react`, which the template omits because it targets plain JS. The
   `isTestEnv` branch is load-bearing: `@babel/preset-env` with `targets: { node:
   'current' }` leaves `modules` at "auto" (commonjs), which is what `.babelrc`'s
   `env.test` block did by omitting `modules: false`. Drop it and Jest dies with "Cannot
   use import statement outside a module" — and the obvious-but-wrong reading of that
   error is that `ts-jest` needs attention.

   **Copying the templates by hand skips the installer, which also writes a
   `browserslist` key.** Without it `@babel/preset-env` has no targets, compiles for the
   oldest conceivable browser, and `useBuiltIns: "entry"` expands `import "core-js/stable"`
   to nearly the whole core-js surface. Adding `browserslist: ["defaults"]` cut the test
   bundle from 709,425 to 575,540 bytes. If a later hop regenerates config from a
   template, check for this again — nothing fails, the bundle just quietly grows.

   Landed alongside, because Babel 7 forces them: `jest` 23 → 26, `ts-jest` 23 → 26,
   `babel-jest` 23 → 26 (`babel-jest` 23 is Babel 6 only), `setupTestFrameworkScriptFile`
   → `setupFilesAfterEnv`, `ts-loader` 3 → 8 (webpack 4), `webpack-dev-server` 2 → 3, and
   `babel-polyfill` → `core-js/stable` + `regenerator-runtime/runtime`. Jest stops at 26
   rather than 29 on purpose: 27 changes the default `testEnvironment` from jsdom to node,
   which this suite's Enzyme tests need. Do 26 → 29 with the React 18 work in Phase 7,
   where Enzyme has to be reconsidered anyway.

   **TypeScript 3.8 cannot *parse* the modern `@types/babel__traverse`** that Jest 26
   pulls in — `TS1005`/`TS1160`, which `skipLibCheck` cannot suppress because they are
   parse errors, not type errors. The fix is to stop auto-loading every package under
   `node_modules/@types`: `tsconfig.json` now names `"types": ["node"]` (for the
   `require()` in `NavBar.tsx`) and `tsconfig.test.json` names `["jest"]`. Explicit module
   imports still resolve through `@types` regardless — that field only controls *global*
   inclusion. `@types/node` is held at 14.x for the same parse reason. Both unwind with
   the TypeScript 5 bump.

2. **`webpacker 4.3.0 → 5.4.4` — done.** Webpacker's final release; still supports
   Rails 5.2 (`railties >= 5.2`, `activesupport >= 5.2`). A small hop: `webpacker.yml`
   loses `check_yarn_integrity` and renames `resolved_paths` → `additional_paths`;
   `babel.config.js` is re-taken from the v5 template, which already carries the
   `loose`-mode alignment that had to be added by hand at v4 and drops
   `regenerator`/`corejs` from `plugin-transform-runtime`. The binstubs and
   `postcss.config.js` are byte-identical between v4 and v5.

   **Both `resolutions` pins came out here.** Webpacker 5 swapped `node-sass` for `sass`
   (dart-sass), so the `node-sass` pin is simply gone — no native build, nothing to
   compile. Dropping the `node-releases` pin needed one more thing: `sass` requires
   Node `>=20.19.0`, so Node moved 20.11.1 → **20.20.2** (`.nvmrc`). Note nvm's 20.20.2
   installs corepack but no `yarn` shim until `corepack enable` is run once. Prefer moving
   Node to the newest 20.x over pinning a package: these engine floors cluster around
   `20 || >=22`, and the next one costs another pin.
3. **`shakapacker 6.6.0` — done.** webpack 5 lands here, and the config surface changes
   shape completely. Shakapacker 6 still uses the `Webpacker` Ruby constant,
   `config/webpacker.yml` and `javascript_pack_tag`, so the Rails side is unchanged; it is
   the JavaScript side that is rewritten.

   - **Four files become one.** `config/webpack/{environment,development,production,test}.js`
     and the `environment.loaders.append(...)` API are gone, replaced by a single
     `config/webpack/webpack.config.js` exporting a plain webpack config object, composed
     with `webpack-merge`. `config/webpack/md4-shim.js` is deleted — webpack 5 does not use
     MD4.
   - **Everything moves to peerDependencies.** Shakapacker 6 declares `webpack`,
     `webpack-cli`, `webpack-merge`, `babel-loader`, `@babel/*`, `terser-webpack-plugin`,
     `compression-webpack-plugin`, `webpack-assets-manifest` and `webpack-dev-server` as
     peers, so the app must depend on them directly. `mini-css-extract-plugin` and
     `css-minimizer-webpack-plugin` are additionally required at *require* time even
     though they are not listed — Shakapacker's style rule imports them unconditionally,
     and without them `require('shakapacker')` throws `MODULE_NOT_FOUND` before webpack
     runs.
   - **Two Shakapacker defaults are overridden, both documented in the config file.**
     Shakapacker treats plain `.css` as global stylesheets and reserves CSS Modules for
     `*.module.css`; this app's 36 `.css` files are all CSS Modules, imported for their
     class map and never linked. So its `.css` rule and `MiniCssExtractPlugin` are dropped
     for style-loader + css-loader with `modules` on. And its babel rule matches
     `.ts`/`.tsx`, which would fight ts-loader, so that rule is narrowed to
     `.js`/`.jsx`/`.mjs`/`.coffee`. Renaming 36 files to `*.module.css` and adding a
     `stylesheet_pack_tag` is the idiomatic fix and a behaviour change; not in a migration
     commit.
   - **css-loader 1 → 6 needs its options spelled out.** `modules: true` becomes an object,
     and `namedExport` / `exportLocalsConvention` must be set explicitly rather than
     inherited — css-loader 6 camelCases locals when `namedExport` is on, which would break
     all 64 default-form imports at once. `cssModules.spec.js` is what proves this landed.
   - **webpack 5 rejects named imports from JSON.** `app/javascript/i18n/i18n.ts` did
     `import { en } from "en.json"`. Neither a named nor a namespace import survives — only
     the default export exists. Switching to a default import then breaks Jest, where
     ts-jest emits CommonJS and a plain JSON require has no `default` property, so
     `esModuleInterop: true` is set in `tsconfig.test.json` **only**. Scoping it to the test
     compile avoids changing emit for every module in the app.
   - `(\.erb)?` dropped from the TypeScript loader `test` pattern: Shakapacker moved ERB
     support out of core and there are **zero** `.erb`-suffixed JS/TS files.
   - Binstubs are renamed `bin/webpack` → `bin/webpacker` (and `-dev-server` likewise);
     `Procfile` references the old name and must be updated. `bin/yarn` is replaced by
     Shakapacker's version, which looks for `yarn` as well as `yarnpkg` — necessary now
     that corepack provides `yarn`.
   - `ensure_consistent_versioning: true` is set in `webpacker.yml`, so a gem/npm version
     mismatch fails loudly. That mismatch is the exact hazard this ladder walks through:
     the repo was already running gem 3.3.1 against npm 3.6.0 before it started.
   - **webpack 5 splits the bundle** into `runtime`, a vendor chunk and `application`.
     `javascript_pack_tag` reads the manifest's `entrypoints` and emits all three, so no
     view change is needed — but a deploy that copies only `application-*.js` would ship a
     broken page.
4. **`shakapacker 6 → current (10.x)`** — mostly config renames on a now-stable
   webpack 5, so the 7 → 8 → 10 steps collapse into one hop. Read each release's guide,
   but expect no webpack-level work here.

### 2d. Replace `typings-for-css-modules-loader` (done)

Unmaintained, and the blocker for modern webpack. Since all 64 imports are default-form,
per-file generated typings are unnecessary. Replace the loader with `css-loader`'s
built-in `modules` option plus a single ambient declaration:

```ts
// app/javascript/types/css.d.ts
declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}
```

Then delete the 34 checked-in `*.css.d.ts` files. A net simplification, not just a swap.
Note this trades per-class type safety for an index signature: a typo in `styles.contaner`
stops being a compile error. Given the four bracket-access call sites already defeat
per-class checking, that is an acceptable trade — but it is a trade, not a free win.

Done ahead of the version ladder, because it can be: `css-loader` was already a declared
dependency at `^1.0.0`, and 1.0.1 still takes flat `modules` / `localIdentName` options, so
the swap lands on webpacker 3.3.1 with the CSS gate proving the interop unchanged. Doing it
here rather than at the webpacker 4 hop matters: webpacker 4 pulls in `css-loader ^3.2.0`,
which `typings-for-css-modules-loader` 1.7 (a wrapper around css-loader 0.28/1.x, still
using webpack-1-era `query` syntax) would not survive — so it had to go either way, and
going first means it is not tangled up with the Babel 6 → 7 work.

Two things found while doing it, both worth knowing:

- **`loaders.append(key, …)` replaces rather than adds.** Webpacker's `ConfigList.add`
  deletes any existing entry with the same key first, so the repo's
  `environment.loaders.append("css", …)` has always been *replacing* Webpacker's built-in
  `.css` rule, not supplementing it. Consequence: `postcss-loader` and `ExtractTextPlugin`
  never applied to `.css` in this app, which is why CSS is inlined by style-loader even in
  production and why `app/views/web/index.html.erb` has no `stylesheet_pack_tag`. Do not
  "restore" extraction during the migration — that is a behaviour change, and a
  `stylesheet_pack_tag` would have to be added in the same breath. `.postcssrc.yml`
  (`postcss-import`, `postcss-cssnext`) is therefore dead config for `.css`; it still needs
  translating to `postcss.config.js` at the webpacker 4 hop, but nothing depends on it.
- **`AlertBox.tsx` was the one outlier import** — `import * as styles from "./AlertBox.css"`
  rather than the default form used by the other 63. That typed fine against generated
  named-export declarations and fails against the ambient default export, so it is now a
  default import. Runtime behaviour is unchanged (style-loader assigns the locals object to
  `module.exports`, so both forms resolve to the same object).

### 2e. Where type-checking lives (decide explicitly)

`ts-loader` currently type-checks as part of the build, which is the only thing enforcing
`"strict": true` on application code. Two paths:

- **Keep `ts-loader`** — requires 9.x for webpack 5.
- **Take Shakapacker's babel-TypeScript path** — faster, but type-checking silently
  leaves the build entirely, surviving only in `tsconfig.test.json` via ts-jest.

**Decision: keep `ts-loader`, and add a standalone type-check to the gate recipe in the
same commit** (done — `yarn typecheck` in `package.json`). Left implicit, this degrades
quietly across every remaining phase; the explicit gate means it cannot.

Bare `tsc --noEmit` is **not** the right gate command, and would have been red from day
one — 16 errors on unchanged code. The script mirrors what the build actually enforces:

- `--noUnusedLocals false --noUnusedParameters false`, because
  `config/webpack/loaders/typescript.js` already overrides both to `false` (along with
  `noImplicitAny`). Twelve `TS6133 declared but never read` errors sit in the codebase
  today precisely because the build has never enforced them. **They are worth cleaning up
  in this phase** — 12 unused imports and locals across 11 files, a mechanical change —
  after which these two flags can be dropped from the script. Until then, gating on them
  would mean a red gate that says nothing about the migration.
- `--skipLibCheck`, because `@types/react-router-dom` 5.x declares re-exports
  (`useHistory`, `useLocation`, `useParams`, `useRouteMatch`) that the pinned
  `@types/react-router` does not provide — 4 errors inside `node_modules`, not fixable
  from here. This resolves in **Phase 7** with the React Router 6 work; drop the flag then.

Confirmed the script still catches real type errors (verified against a deliberately
introduced `TS2322`) rather than passing vacuously — the same failure mode that made
brakeman useless for years.

**Keeping `ts-loader` has a packaging consequence.** Because the production build
type-checks, everything it type-checks against must survive
`yarn install --production`, which `assets:precompile` runs. `@types/node`,
`@types/react`, `@types/react-dom`, `@types/react-redux` and `@types/react-router-dom`
are therefore `dependencies`, not `devDependencies` — as are `@babel/preset-react`,
`css-loader` and `style-loader`, which the build needs and which had been misfiled since
before this upgrade. If the type-checking decision is ever revisited in favour of
`transpileOnly`, these can move back.

### 2f. Remaining work items

- **Clear the 12 `TS6133` unused-import/local errors** so `yarn typecheck` can drop its
  `--noUnusedLocals`/`--noUnusedParameters` escape hatches (see above). Mechanical.
- **`typescript` 3.8 → 5.x.** This is the unlock for three separate pins: `@types/node`
  can leave 14.x, `tsconfig`'s `"types"` allow-lists can go away, and `--skipLibCheck` can
  come out of `tsconfig.json`. Note `ts-loader` 8 handles TypeScript 5 but `ts-loader` 9
  is the supported pairing, and 9 requires webpack 5 — so this may want to follow the
  Shakapacker 6 hop rather than precede it.
- **`jest` 26 → 29 and `ts-jest` 26 → 29.** Deliberately *not* done in hop 1: Jest 27
  changes the default `testEnvironment` from jsdom to node, which breaks the Enzyme
  tests. Do this in Phase 7 alongside React 18, where Enzyme has to be replaced anyway
  (`enzyme-adapter-react-16` has no React 18 equivalent).
- **Fix `tsconfig.json`: `"target": "es3"` → `"es2020"`** (and the same in
  `tsconfig.test.json`, which duplicates it). ES3 will fight modern TypeScript and
  library typings. Cheap, do it with the TypeScript bump.
- Drop the `node-sass` resolution pin once Webpacker is gone; if a `.sass`/`.scss` file is
  ever added, use `sass` (dart-sass), never node-sass.
- `app/javascript/packs/application.js` does a bare `import "application"`, which depends
  on `source_path` staying in webpack's `resolve.modules`. Low risk — it fails loudly with
  "module not found" rather than silently — but know it is there.
- `yarn` stays on Classic, now pinned by `"packageManager": "yarn@1.22.22"`. Shakapacker
  supports it. Do not add a Yarn 2+ migration to this phase.
- `eslint` 4 and its plugins are installed but **there is no eslint config anywhere** in
  the repo, so nothing lints. Either configure it or drop the four packages; do not leave
  it looking like a lint gate exists.
- `cypress` sits in `dependencies` rather than `devDependencies`, so
  `yarn install --production` on the server pulls the whole browser download. Pre-existing;
  worth moving, but it is a deploy-shaped change — see below.

### 2g. Deploy will break unless someone changes it — needs Brian

This is not the deploy-*destination* question that was closed above; it is deploy
mechanics, and it is a direct consequence of Phase 2. Two lines in the Capistrano config:

```ruby
# config/deploy.rb
append :linked_dirs, "tmp/pids", "node_modules"   # shared across releases
# Capfile
require "capistrano/rails/assets"                 # runs assets:precompile on the server
# require "capistrano/yarn"                       # commented out -- yarn install never runs
```

So the server's `node_modules` is a hand-maintained shared directory that no deploy step
ever updates, while `assets:precompile` *does* run on every deploy. After this phase the
checked-out code needs Webpacker 4, Babel 7 and Node 20; the server's `node_modules` still
holds the Webpacker 3 / Babel 6 tree. **Precompile will fail on the server** even though
it passes locally.

Whoever owns the server has to do at least: install Node 20 there, and either enable
`capistrano/yarn` (so `yarn install` runs as part of deploy) or update the shared
`node_modules` by hand before the first Phase 2 deploy. Enabling `capistrano/yarn` is the
right long-term answer, but it changes deploy behaviour and is not something to slip into
an upgrade commit unannounced. **Left unchanged deliberately; raise before deploying.**

**Gate:** full recipe green, including the CSS Modules spec and `yarn typecheck`. Also
verify `RAILS_ENV=production bin/rails assets:precompile` succeeds, since that is what
deploy runs — and re-run `yarn install --check-files` immediately afterwards.

**Trap on that precompile check:** it loads `config/environments/production.rb`, which
until Phase 5b still reads `Rails.application.secrets.smtp_username` and
`.smtp_password` (lines 77–78). So precompile needs a locally populated,
production-shaped `config/secrets.yml` or it fails for reasons that have nothing to do
with assets. Populate it with dummy values first — otherwise you will spend an hour
chasing a phantom Shakapacker bug.

---

## Phase 3 — Rails 5.2 → 6.0 → 6.1

Two hops, same recipe each time, still on Ruby 2.7. The main event is **Zeitwerk**
autoloading (Rails 6.0's default).

1. **Rails 6.0:** `rails app:update`, `load_defaults 6.0`, adopt, delete the defaults file.
   - Run `bin/rails zeitwerk:check` and add it to the gate from here on.
   - Zeitwerk enforces strict file/constant naming. With 162 Ruby files this is
     manageable, and `config/initializers/inflections.rb` is empty (comments only), so
     there are no custom acronyms for Zeitwerk to hold you to — one less failure mode.
   - `config/environments/*.rb` gain new required keys.
2. **Rails 6.1:** smaller hop. `load_defaults 6.1`, adopt, delete.
3. Bump the Rails-coupled gems in step: `rails-i18n` 5.0 → 6.0, `sass-rails` → 6.x.
4. `audited` 4.7 → 5.x is a **major** version jump with schema/API changes. It is the
   one application-level gem that carries real risk (it touches every audited model).
   Give it its own commit within this phase so it can be reverted independently.

**Gate:** full recipe green + `zeitwerk:check` clean.

---

## Phase 4 — OmniAuth 1.9 → 2.1 (isolated, manual browser gate)

Deliberately isolated in its own phase: get this wrong in production and nobody can log
in. A three-file diff is diagnosable; the same change buried in a Rails major is not.

**Why here and not first.** It is genuinely Rails-version-independent (OmniAuth 2 needs
only Ruby ≥ 2.2 and Rack ≥ 2.2.3, both already satisfied), so first was tempting. It sits
here instead because the only gate that can prove it works is a **manual browser login**,
and that gate is only trustworthy on a stack you already trust. Placed first, a failed
login is ambiguous — OmniAuth 2 wiring, or an OAuth callback URL mismatch on a 2018-era
Rails 5.1 stack? Placed here, everything else is green and modern, and you are one phase
from the deploy that needs auth working anyway.

`origin/dependabot/bundler/omniauth-2.1.0` already exists — use it as a reference.

**The breaking change, specifically:** OmniAuth 2 requires the *request* phase to be a
POST with a CSRF token. Two places currently issue a GET:

- `app/views/shared/welcome.html.erb:54` — `<a id='google-signin-link' href="/auth/google_oauth2">`
- `app/controllers/sessions_controller.rb:10` — `redirect_to '/auth/google_oauth2'`

Both must become POST form submissions (`button_to`, or a form with
`authenticity_token`), and you need `omniauth-rails_csrf_protection` in the Gemfile.

**Your test suite cannot catch this.** `OmniAuth.config.test_mode = true` (in
`test/controllers/sessions_controller_test.rb`, `test/application_system_test_case.rb`,
and `spec/cypress/app_commands/mock_oauth.rb`) short-circuits the request phase entirely.
The tests cover the *callback* phase and will stay green while real login is broken.

Also bump `omniauth-google-oauth2` 0.6.0 → 1.2.x here (1.x requires OmniAuth 2, so they
move together).

**Gate:** full recipe green **+ manual Google login verified in a real browser.** Note
that there is deliberately no staging environment to rehearse this on (see *Deploy reality*
above), so plan a low-traffic window and know your rollback: this phase should be a single
revertable commit, and the previous release directory is still on the server under
Capistrano.

---

## Phase 5 — Ruby 3.x, Rails 6.1 → 7.0 → 7.1, and secrets migration

Three coupled sub-steps. Split them into separate commits.

### 5a. Ruby 2.7 → 3.1

Rails 7.2 requires Ruby ≥ 3.1, so 3.1 is the right landing spot (not 3.0). If Phase 2's
keyword-argument warnings were fixed properly, this hop is mostly uneventful — that is
the payoff for having done it there. `rbenv` has 3.1.3 installed. Update
`config/deploy.rb`'s rbenv pin again.

### 5b. `config/secrets.yml` → credentials or ENV — **hard blocker for Rails 7.1**

`Rails.application.secrets` is **removed** in Rails 7.1. This must be done before that hop.
The surface is small and fully enumerated — 6 call sites, 4 keys:

| Location | Usage |
|---|---|
| `app/mailers/notification_mailer.rb:5` | `secrets.smtp_username` |
| `app/mailers/error_mailer.rb:10` | `secrets.admin_email` |
| `app/views/notification_mailer/welcome.html.erb:26` | `secrets.admin_email` |
| `app/views/notification_mailer/welcome.text.erb:14` | `secrets.admin_email` |
| `config/environments/production.rb:77-78` | `secrets.smtp_username`, `secrets.smtp_password` |

Keys in `config/secrets.yml`: `secret_key_base`, `smtp_username`, `smtp_password`,
`admin_email`, plus a deprecated `gmail_username`.

**`secret_key_base` is not like the other keys and needs its own ordering.** It has
**zero call sites** — Rails reads it out of `secrets.yml` internally — so it does not
appear in the table above and is easy to miss. Under the ENV approach it becomes
`SECRET_KEY_BASE`. If it is not already set in the production environment when the deploy
drops `config/secrets.yml` from `linked_files`, the app **fails to boot**, and if it is
set to a *different* value than the old file held, **every existing session cookie
invalidates** and all users are silently logged out. Sequence it explicitly:

1. Set `SECRET_KEY_BASE` on the server to the **exact value currently in
   `config/secrets.yml`** (do not generate a fresh one).
2. Deploy the code that reads from ENV.
3. Only then remove `config/secrets.yml` from `linked_files`.

**This is deploy-affecting.** `config/deploy.rb:10` has
`append :linked_files, "config/secrets.yml", "config/initializers/omniauth.rb", "config/database.yml"`.
Whichever route you choose, `linked_files` and the files on the production server must
change in lockstep with the code, or the deploy boots into a crash.

Recommendation: **ENV vars via `Rails.application.config`**, not encrypted credentials.
The three files are already gitignored and Capistrano-symlinked, which means the team's
existing workflow is "secrets live on the server, outside git" — ENV preserves that model.
Encrypted credentials would additionally require managing `master.key` distribution for a
gain you do not currently need. Update the README's secrets instructions in the same commit.

### 5c. Rails 7.0 → 7.1

- Two hops, standard recipe. `load_defaults 7.0` then `7.1`.
- Rails 7 drops Webpacker entirely — already handled in Phase 2, which is why that phase
  came first.
- Rails 7.1 removes `Rails.application.secrets` — already handled in 5b.

**Gate:** full recipe green. Boot production env explicitly (`bin/rails runner -e production`)
— 5b's changes are prod-config-heavy and unit tests will not exercise them. **Do a real
staging deploy before proceeding.**

---

## Phase 6 — Rails 7.2 → 8.0, Ruby 3.1 → 3.4

The home stretch. All key gems have maintained Rails 8-compatible releases (verified
against rubygems.org):

| Gem | Current | Latest | Note |
|---|---|---|---|
| `rails` | 5.1.6.2 | 8.1.3.1 | targeting 8.0.x |
| `audited` | 4.7.0 | 5.8.0 | major — handled in Phase 3 |
| `access-granted` | 1.2.0 | 1.3.3 | minor |
| `omniauth-google-oauth2` | 0.6.0 | 1.2.3 | handled in Phase 4 |
| `delayed_job_active_record` | 4.1.2 | 4.1.11 | still maintained |
| `rails-i18n` | 5.0.4 | 8.1.0 | tracks Rails major |
| `cypress-on-rails` | 1.5.1 | 1.20.1 | large jump, config changed |

1. Ruby 3.1 → 3.4 (`rbenv` has 3.4.9). Update the deploy rbenv pin.
2. Rails 7.2, then 8.0. Standard two-commit recipe each.
3. `cypress-on-rails` 1.5.1 → 1.20.x — its configuration format changed substantially
   (`spec/cypress/app_commands/`, `config/initializers/cypress_on_rails.rb`). Budget real
   time; this is your E2E harness.
4. Bump Cypress itself (4.x → 15.x). A genuine migration, not a version bump — three
   distinct moving parts, each worth its own commit:
   - `spec/cypress.json` (the real config — `baseUrl`, `defaultCommandTimeout`,
     `chromeWebSecurity`, `video`) becomes `spec/cypress.config.js`. Note this is *not*
     the root `cypress.json` you deleted in Phase 0.
   - `spec/cypress/integration/` → `spec/cypress/e2e/`, moving all 18 spec files. Do the
     rename in its own commit so `git log --follow` stays useful.
   - Both `package.json` scripts pass `--project ./spec`, whose semantics changed in
     Cypress 10+ for this layout. `test:cypress` and `test:cypress:run` both need
     rewriting, as does `--headless` (now the default; the flag was removed).
5. **Optional, not required:** Rails 8 ships Solid Queue. You currently run
   `delayed_job_active_record` + `delayed_job_recurring` + `daemons`, with recurring jobs
   in `config/initializers/recurring_jobs.rb` and a `Procfile`. `delayed_job` is still
   maintained, so **defer this**. Migrating background jobs in the same phase as a Rails
   major is how you lose a weekend. File it as separate follow-up work.

**Gate:** full recipe green + staging deploy + production deploy.

---

## Phase 7 — Frontend libraries: React 18, React Router 6, react-redux

Last, and correctly last: it is entirely independent of the Rails version once Phase 2
modernized the build chain. Nothing here blocks the backend, so if time runs short the
app is already on a supported Rails 8 / Ruby 3.4 footing.

The ordering within this phase is forced by the dependency graph:

### 7a. React 16.8 → 18

Small, because the codebase is already hooks-based (0 legacy lifecycle methods, 2 class
components).

- One call site to change: `app/javascript/application/index.js:33` —
  `ReactDOM.render(<App store={store} />, appDiv)` becomes `createRoot(appDiv).render(...)`.
- Bump `@types/react` and `@types/react-dom` to 18.x.
- **Enzyme costs you nothing.** It has no React 18 adapter and never will, but it is
  *configured without being used*: `test/javascript/setupTests.js` calls
  `Enzyme.configure({ adapter: new EnzymeAdapter() })` and **no test in the repo ever calls
  `shallow` or `mount`** (the only `shallow*` matches are `shallowEqual` from react-redux
  in `app/javascript/reducers/useAppSelector.ts`, which is unrelated). So this is not a
  migration — delete the four lines in `setupTests.js` and drop `enzyme`,
  `enzyme-adapter-react-16`, and `jest-enzyme` from `package.json`. Do it in Phase 2 when
  the Jest chain moves, and React 18 arrives with no test-harness debt at all.
- Expect `StrictMode` double-invocation surprises in development if you opt into it. You
  may leave it off.

### 7b. react-redux 7 → 9

Gated behind 7a (react-redux 8+ requires React 18). The TypeScript types shifted, so
expect type churn across the 14 files using `connect()`/`createStore`.

`app/javascript/application/index.js` and `app/javascript/reducers/appReducer.ts` use
plain `createStore` + `combineReducers`. `createStore` is soft-deprecated in favor of
Redux Toolkit's `configureStore`. Treat RTK adoption as **optional follow-up work**, not
part of this upgrade — the plain API still functions.

### 7c. React Router 5.1 → 6 — the largest single frontend item

Sized concretely:

| Symbol | Occurrences |
|---|---|
| `<Link` | 81 |
| `<Route` | 33 |
| `withRouter` | 18 |
| `useHistory` | 8 |
| `<Switch` | 6 |
| `<Redirect` | 1 |
| **files importing `react-router`** | **64** |

This is an API rewrite, not a version bump: `Switch`→`Routes`, `component=`→`element=`,
`useHistory`→`useNavigate`, `Redirect`→`Navigate`, changed nested-route and relative-path
semantics, and **`withRouter` is removed entirely** (all 18 uses must become hooks — which
also means any class component using it must be converted).

**That 64-file, 18-`withRouter` number — not the React version — is what determines this
phase's length.** Consider `react-router` 6.4+ data APIs out of scope; port to the v6
component API and stop.

### 7d. Remaining dependency cleanup

`axios` 0.21 → 1.x, `immutability-helper` (pinned at exactly `2.7.1`) → 3.x,
`react-tabs` 2.2 → current, `eslint` 4 → 9 (flat config), and drop
`babel-preset-react` / `ts-loader` / `webpack-dev-server` 2.11 pins left over from the
old build.

**Gate:** full recipe green + manual click-through of the main boards
(dashboard, people, organizations, events, activities) — routing regressions are exactly
the class of bug that passes unit tests and breaks the app.

---

## Phase 8 — Post-upgrade security pass (no version changes)

**Brian's decision, 2026-09-03:** the security findings brakeman surfaced are fixed
*after* the upgrade, not during it. Rationale, and worth keeping: a security fix inside an
upgrade commit is a change to application behaviour hidden inside a change to
dependencies. If the gate goes red you cannot tell which half did it, and if a fix is
wrong it is buried in a diff nobody reviews line by line. Keeping them separate also means
this phase can be reviewed by someone who does not care about Rails versions at all.

Work items, in the order they deserve attention:

1. **`app/controllers/api/permissions_controller.rb:3` — `params[:type].constantize`.**
   High confidence, remote code execution. User-supplied input reaching `constantize`
   lets a caller instantiate arbitrary constants. Fix by allowlisting the permitted type
   strings and mapping to classes explicitly; never derive a class from raw params.
2. **`app/controllers/api/people_controller.rb:46` — `params.permit!`.** Mass assignment:
   permits every parameter, including any attribute a future migration adds. Replace with
   an explicit permit list.
3. **Three SQL injection findings** — `app/models/event.rb:120`,
   `app/models/concerns/multi_word_search.rb:13`, and `app/models/domain_report.rb:64`
   (interpolated `@period.finish`). Convert to bound parameters.
4. **The person/organization search pickers do not discard stale responses.** Typing into
   a picker fires a request per keystroke and each response overwrites the results list,
   so a slow earlier response can land after a later one and replace the correct results.
   Observed in E2E as pressing Enter selecting the wrong person entirely ("expected input
   to have value 'Drew Mambo', but the value was 'Lance Armstrong'"), and as clicking a
   result failing because the list re-rendered underneath the click. Users hit the same
   thing on a slow connection. Fix by tagging each request and ignoring any response that
   is not for the current query.
5. **`DomainReport#gen_activity_items` has no deterministic order.**
   `app/models/domain_report.rb:66` orders by `start_date: :desc` with no tiebreaker, so
   rows sharing a date come back in whatever order PostgreSQL feels like — users see the
   report reshuffle between loads. It is the same method as the SQL injection finding
   above, so fix both in one pass. `spec/cypress/integration/reports.spec.js` was made
   order-agnostic in Phase 2 to stop it failing at random; tighten it back up once the
   query is deterministic.
6. **Regenerate `config/brakeman.ignore`.** Its 5 entries no longer match anything —
   they reference `app/views/dashboard/dashboard.html.erb`,
   `app/views/languages/show.html.erb` and `app/views/clusters/index.html.erb`, all ERB
   views deleted during the React migration. A stale ignore file is worse than none: it
   reads as "reviewed and accepted" for findings that no longer exist.
7. **Re-run `bundle exec brakeman` expecting zero warnings**, and consider adding it to
   the gate as a hard failure rather than a compare-against-known-list.

By the time this phase runs, brakeman will be unpinned (Phase 5 lifts it to 6+ on Ruby
3.1) and the two EOL warnings for Rails 5.2.8.1 and Ruby 2.7.4 will have resolved
themselves.

**Note:** each of these is a genuine behaviour change with no test covering it today.
Write the test first in each case — that is the actual work here, not the one-line fix.

---

## Sequencing summary

```
Phase 0  Hygiene, Cypress baseline, branch triage           no version changes
Phase 1  Ruby 2.7 + Rails 5.2                    Ruby moves once, covers 4 hops
Phase 2  Node 20 + Webpacker 4 -> Shakapacker  <- joint frontend/backend step
Phase 3  Rails 6.0 -> 6.1 (Zeitwerk) + audited 5
Phase 4  OmniAuth 2                              auth risk; manual browser gate
Phase 5  Ruby 3.1 + secrets -> ENV + Rails 7.0 -> 7.1        deploy-affecting
Phase 6  Ruby 3.4 + Rails 7.2 -> 8.0 + Cypress/cypress-on-rails
Phase 7  React 18 -> react-redux 9 -> React Router 6   independent; router is the big one
Phase 8  Security pass                            post-upgrade, no version changes
```

**Why not "backend first, then frontend."** The instinct is right for Phases 4–6 and 7,
but Phase 2 breaks the split: Webpacker is simultaneously a Rails gem and an npm package,
Rails 7 retires it, and Node 12 blocks the modern Jest the frontend needs. Attempting
Rails 7 before the bundler migration means doing the bundler migration anyway, under
pressure, with a broken build. Phase 2 is where the two halves genuinely touch — after
that, the split holds.

## Deferred / explicitly out of scope

- Solid Queue replacing `delayed_job` (Rails 8 makes it possible; `delayed_job` still works)
- Redux Toolkit replacing plain `createStore`
- `react-router` 6.4+ data/loader APIs
- Encrypted credentials instead of ENV (see Phase 5b rationale)
- Hotwire/Turbo — irrelevant here; this is a React SPA with a Rails API

## Standing risks

1. **OmniAuth request phase is invisible to the test suite** (Phase 4). Manual browser
   gate required, and — by decision, not oversight — no staging environment to rehearse
   on. This is the single largest unmitigated risk in the plan.
2. **Asset precompilation** is only exercised at deploy time. Add
   `RAILS_ENV=production bin/rails assets:precompile` to the gate from Phase 2 onward.
3. **`Capfile` needs touching in Phases 1, 5a, and 6** (`set :rbenv_ruby`), and
   `config/deploy.rb` in Phase 5b (`linked_files`). Note the rbenv pin lives in
   `Capfile:32`, *not* in `config/deploy.rb`. A missed pin update fails at deploy, not
   in tests.
4. **The three gitignored config files** (`secrets.yml`, `database.yml`,
   `initializers/omniauth.rb`) exist only on developer machines and the production server.
   Confirmed never committed to git history. Any change to their shape must be
   communicated to whoever holds the production copies.
