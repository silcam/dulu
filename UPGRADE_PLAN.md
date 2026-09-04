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
bundle exec brakeman               # 7 known warnings, 6 from Phase 3 (below)
bin/rails runner -e development 'puts Rails.version'
bin/rails zeitwerk:check           # Phase 3 onward only
foreman s                          # the documented way to run this app -- see below

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

**Triage a Cypress failure by its mechanism, not by whether the spec name changes.**
Through Phase 2 the suite settled at roughly one failure per two runs, in a different spec
each time. It is tempting to read "different spec every run" as noise. It is not — the
failures fall into two distinct groups, and only one of them is noise:

1. **A search picker was involved** — `clusters.spec.js` "Adds cluster participants",
   `participants.spec.js` "Adds, edits and finishes Drew", `regions.spec.js` "Changes LPF",
   anything going through the `searchFill` command or `cy.placeholder("Name")`. These are
   all **one application bug**: the pickers fire a request per keystroke and let a late
   response overwrite a newer one (Phase 8, item 4). It presents as a detached `<li>`, as a
   dropdown covering the next form control, or — most clearly — as
   `expected input to have value 'Drew Mambo', but the value was 'Lance Armstrong'`. It
   moves between specs because the race is probabilistic, not because it is noise. **Do not
   chase these as migration regressions, and do not expect the E2E gate to be reliably
   green until the picker is fixed.**
2. **Anything else timing out** — re-run and check `/proc/loadavg` first. Phase 2's runs
   happened on a machine at load ~11 on 8 cores with under 1 GB of RAM free and browser
   renderers pegged at 90% CPU; clean 93/93 runs correlated with load dropping to 6–8. A
   broken *bundle* does not behave this way at all — it fails the same test every run, and
   usually every test on the page (see the Electron-78 optional-chaining failure in Phase
   2c hop 4, where the entire events page died).

`defaultCommandTimeout` is 30s, up from 10s, to widen the retry window. That hides nothing:
a genuinely broken build never resolves and still fails, just later.

**A failing test now captures the server-side log.** `spec/cypress/app_commands/log_fail.rb`
used `tail -r`, which is macOS-only, so on Linux it wrote an empty capture for every
failure; and the `APPCLEANED` marker it cuts on was commented out in `clean.rb`; and
`config/environments/test.rb` set `config.logger = Logger.new(nil)`, so there was nothing to
capture in the first place. All three are fixed, at a cost of about 2 seconds on
`bin/rails test`. A failing spec now leaves `log/<full test name>.log` with that test's
requests in it — which is the first thing to look at before theorising.

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

**`bin/rails server` passing does not mean `foreman s` passes.** The `Procfile` runs
three processes, and the `webpacker:` one is `bin/shakapacker-dev-server`. That binstub —
like nineteen others under `bin/` — loads `bundler/setup` and then activesupport
*without* going through `config/boot.rb`, so anything fixed in `boot.rb` does not apply
to it. This is exactly how a broken `foreman s` survived Phase 3's gate: Rails was only
ever started through `bin/rails`. Start `foreman s` after any change to an entry point, a
binstub, or a gem on the boot path, and confirm all three processes stay up.

**Port 3000 may belong to another project.** `foreman s` binds 3000 and fails with
`Errno::EADDRINUSE` if something else holds it — on this machine a `cmbpayroll` puma
does. Check `ss -ltnp | grep :3000` before concluding the app is broken; the webpack
dev server's port 3035 is separate and can succeed while `web.1` fails.

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

Two further brakeman warnings were **expected** mid-upgrade and resolve on their own:
"Support for Rails 5.2.8.1 ended" (gone as of Phase 3) and "Support for Ruby 2.7.4 ended"
(clears in Phase 5). So the expected total is 7 before Phase 3 and **6 from Phase 3 on**.

Also note `config/brakeman.ignore` holds 5 entries that no longer match anything — they
reference `app/views/dashboard/dashboard.html.erb`, `app/views/languages/show.html.erb`
and `app/views/clusters/index.html.erb`, ERB views deleted during the React migration.
The file can be regenerated or emptied.

---

## Deferred pins to unwind later

Phase 1 added three constraints that exist only to hold the dependency graph on Ruby 2.7.
Each should be revisited at the phase named:

| Pin | Reason | Unwind at | Status |
|---|---|---|---|
| `nokogiri "~> 1.15.7"` | nokogiri >= 1.16 requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) | **done in 5a** — pin deleted, now 1.18.10 |
| `delayed_job "~> 4.1.11"` | 4.2 needs `ActiveJob::QueueAdapters::AbstractAdapter`, Rails 7.1+ only | Phase 5 (Rails 7.1) | open, unwinds at 5c |
| `brakeman "~> 5.4"` | brakeman 6+ requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) | **done in 5a** — now `~> 7.0` (7.1.1) |
| `capybara "~> 3.39.0"` | capybara 3.40+ requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) | **done in 5a** — now `~> 3.40` |
| `sprockets "~> 4.0"` | added in Phase 3; upper bound only, not a hold-back | — | — |
| `concurrent-ruby "< 1.3.5"` | 1.3.5 dropped its transitive `require "logger"`; ActiveSupport <= 7.0 needs it | Phase 5c (Rails 7.1) | open, unwinds at 5c |

**Dropping the `nokogiri` pin is not enough on its own** — `bundle install` does not
upgrade a gem already present in the lockfile, so nokogiri sat at 1.15.7 with no pin
holding it. It took an explicit `bundle update nokogiri` to reach 1.18.10. Worth
remembering for the remaining unwinds at 5c.

**brakeman 7.1.1 changed the expected warning count from 5 back up to 7**, and this is
not a regression. It adds two EOL checks the 5.4 line did not have:

| Check | Message | Clears at |
|---|---|---|
| `EOLRuby` (`.ruby-version:1`) | Support for Ruby 3.1.3 ended 2025-03-31 | Phase 6 (Ruby 3.4) |
| `EOLRails` (`Gemfile.lock`) | Support for Rails 6.1.7.10 ended 2024-10-01 | Phase 6 (Rails 8.0) — 7.1 is EOL too, so this stays lit through 5c |

So from 5a on, **the expected brakeman total is 7 = the 5 pre-existing application
findings + 2 EOL warnings**, and both EOL warnings clear in Phase 6, not Phase 5. Also
brakeman 7 reports **3** obsolete entries in `config/brakeman.ignore` rather than the 5
noted above; the cleanup is still a Phase 8 item.

Two more known blockers, not yet actionable:

- ~~**`rb-inotify` 0.9.10**~~ **resolved in Phase 3.** `listen` 3.1.5 → 3.10.0 carried
  `rb-inotify` to 0.11.1 and the `rb_safe_level` warning wall is gone.
- ~~**`capybara` 2.18.0**~~ **resolved in Phase 3, and it was not optional** — Rails 6.1
  requires `capybara >= 3.26`. Now `~> 3.39.0`, itself a Ruby-2.7 ceiling (see the table
  above). `test/system` still cannot run on this machine for want of a `chromedriver`;
  see Phase 3g.
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
  from here. This resolves in **Phase 7** with the React Router 6 work.

**Both escape hatches are gone as of the end of Phase 2, and the script is now a plain
`tsc --noEmit`.** `skipLibCheck` moved from the CLI into `tsconfig.json` (where the build
sees it too), the 12 `TS6133` errors were cleared, and `config/webpack/loaders/typescript.js`
no longer relaxes `noUnusedLocals`/`noUnusedParameters`/`noImplicitAny` — so the webpack
build and the standalone type-check now enforce exactly the same `tsconfig.json`.

**One asymmetry to collapse later:** `esModuleInterop` is `true` in `tsconfig.test.json`
and `false` in `tsconfig.json`, so Jest and webpack disagree about CommonJS default-import
semantics. It is correct for `i18n.ts` (see hop 3) and both suites pass, but it is worth
unifying the next time module settings are revisited.

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

### 2f. Work items — status

**Done in this phase**, listed so nobody redoes them:

- **`typescript` 3.8 → 5.4** (hop 4). Forced earlier than planned: Shakapacker 10 drags in
  `@types/babel__core` and webpack's own `types.d.ts`, neither of which TypeScript 3.8 can
  *parse*. It unlocked `@types/node` off its 14.x pin, and `tsconfig` now also excludes
  `config/` and the root config JS files — with `allowJs` and no `include`, build
  configuration was being pulled into the program.
- **`target: "es3"` → `"es2019"`** — note **es2019, not es2020**. ts-loader emits whatever
  `target` says and never consults `browserslist`, so tsconfig is the real browser floor
  for `.ts`/`.tsx`. es2020 emits optional chaining natively, which Chromium below 80 cannot
  parse; Cypress 4.1 drives Electron 78 and the whole app died on it. Raise this when
  Cypress moves in Phase 6, and reconcile the two floors then.
- **The 12 `TS6133` errors are cleared** and both escape hatches removed, so `yarn typecheck`
  is a plain `tsc --noEmit` and the build enforces the same config (see 2e).
- **`node-sass` is gone entirely** (hop 2) — Webpacker 5 replaced it with dart-sass. Both
  `resolutions` pins came out with it.

**Still open:**

- **`jest` 26 → 29 and `ts-jest` 26 → 29.** Deliberately not done here: Jest 27 changes the
  default `testEnvironment` from jsdom to node, which breaks the Enzyme tests. Do it in
  Phase 7 alongside React 18, where Enzyme has to be replaced anyway
  (`enzyme-adapter-react-16` has no React 18 equivalent).
- **`eslint` 4 and its plugins are installed but there is no eslint config anywhere** in
  the repo, so nothing lints. Either configure it or drop the packages; do not leave it
  looking like a lint gate exists.
- **`cypress` sits in `dependencies` rather than `devDependencies`**, so
  `yarn install --production` on the server pulls the whole browser download. Pre-existing;
  worth moving, but it changes what deploy installs — see 2g.
- `app/javascript/packs/application.js` does a bare `import "application"`, which depends on
  `source_path` staying in webpack's `resolve.modules`. Low risk — it fails loudly with
  "module not found" rather than silently — but know it is there.
- `yarn` stays on Classic, pinned by `"packageManager": "yarn@1.22.22"`. Shakapacker
  supports it. Do not add a Yarn 2+ migration to this project as part of the upgrade.

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

Whoever owns the server has to do all of this before the first Phase 2 deploy:

1. **Node 20.20.2** (not just "Node 20" — Webpacker 5's dart-sass requires `>=20.19.0`).
2. **`corepack enable`, once.** nvm's 20.20.2 ships `corepack` but no `yarn` shim, so a
   fresh environment has no `yarn` on `PATH` at all. `"packageManager": "yarn@1.22.22"` in
   `package.json` then pins Yarn Classic; without the pin, corepack hands you Yarn 4 and it
   rewrites the v1 lockfile.
3. **Either enable `capistrano/yarn`** (uncomment it in `Capfile`, so `yarn install` runs as
   part of deploy) **or update the shared `node_modules` by hand.** Enabling it is the right
   long-term answer, but it changes deploy behaviour and is not something to slip into an
   upgrade commit unannounced.

**Left unchanged deliberately; raise before deploying.** Tracked as **Phase 8b** so it
does not get lost — but note the timing there: it is needed at the *first* deploy of this
branch, not after Phase 7. The README's "Prerequisites" section was rewritten in Phase 2
and now carries the same three requirements for developer machines.

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

## Phase 3 — Rails 5.2 → 6.0 → 6.1 (done)

Two hops, still on Ruby 2.7. Delivered in five commits: Rails 6.0 + Zeitwerk, `audited` 5
on its own, Rails 6.1, the sprockets pin lifted, and the trailing pins. Predicted
correctly: Zeitwerk was the main event, `audited` needed isolation, and `rails-i18n` and
`sass-rails` had to move in step. What the plan did not predict is below — all of it cost
time, and all of it is the kind of thing that reads as a mystery if you meet it cold.

### 3a. Resolve the dependency graph before writing any config

Ten minutes of `bundle lock` in a throwaway directory answered the question the plan had
left open: does the Ruby-2.7 `nokogiri "~> 1.15.7"` pin survive Rails 6.1? It does —
Rails 6.1's `loofah`/`rails-html-sanitizer` chain resolves happily against nokogiri
1.15.7. Rails 6.0, 6.1, `rails-i18n` 6.0, `sass-rails` 6.0 and `audited` 5.8 were all
proven resolvable *before* the first line of config changed. Do this at the top of every
remaining phase; the alternative is finding a hard blocker after a day of fixes.

### 3b. Four things blocked boot before any Rails-6 behaviour was reachable

None of these are Zeitwerk, and each stops the app dead:

1. **`concurrent-ruby` 1.3.5 dropped its transitive `require "logger"`.** ActiveSupport
   up to 7.0 relies on it, so every `bin/rails` command dies with
   `uninitialized constant ActiveSupport::LoggerThreadSafeLevel::Logger`. **Fixed by
   pinning `concurrent-ruby < 1.3.5`** — the pin comes out in Phase 5c, where Rails 7.1
   requires logger itself.

   The first attempt was a `require "logger"` in `config/boot.rb`, and **it was wrong.**
   Twenty binstubs under `bin/` never load `config/boot.rb` at all — they load
   `bundler/setup` and then activesupport directly — so `bin/shakapacker-dev-server`
   still died, and because that is the `webpacker:` line in the `Procfile`, **`foreman s`
   exited immediately while `bin/rails server` worked fine.** The gate missed it because
   the dev server was verified back in Phase 2 and Phase 3 only ever started Rails
   through `bin/rails`. **`foreman s` is the documented way to run this app and belongs
   in the gate** — add it whenever an entry point, binstub or boot-path gem changes.
2. **`rails/all` loads Action Text, which autoloads during initialization.** Zeitwerk
   deprecates that, and `config/environments/test.rb` raises on deprecations, so the
   whole suite failed to boot. `config/application.rb` now requires railties explicitly.
   Action Text, Active Storage and Action Mailbox are all genuinely unused here — no
   `*_blobs`/`*_attachments` tables, no `has_*_attached`, no `rich_text`, no
   `app/mailboxes` — so dropping them is honest, not a workaround. Action Cable stays,
   because `app/assets/javascripts/cable.js` does `//= require action_cable` and
   sprockets would fail without it.
3. **`jbuilder` 2.7.0 registers a single-arity template handler**, deprecated in 6.0 and
   therefore fatal under `deprecation = :raise`. 2.13 takes `(template, source)`.
4. **`pg` was silently stuck at 1.0.0** — `Gemfile` leaves it unpinned, so `bundle
   install` never moved it, and Rails 6.1's activerecord requires `pg ~> 1.1`. Presents
   as `Gem::LoadError: can't activate pg (~> 1.1)` on *every* rails command, which reads
   like a Rails problem and is a lockfile problem. `bundle update pg`.

The lesson generalises: with `deprecation = :raise` (which is what makes a multi-hop
upgrade tractable, and worth keeping), a deprecation in a *third-party* gem is a boot
failure. Expect one or two per hop and read the trace for the gem name before assuming
the app is at fault.

### 3c. Zeitwerk was nearly free — one dead file

`bin/rails zeitwerk:check` found exactly one problem:
`app/controllers/concerns/redirect_to_referrer.rb` was commented out end to end, so it
defined no constant. Its only `include` in `application_controller.rb` was commented out
too. Deleted rather than added to an `ignore` list. `config/initializers/inflections.rb`
being empty really did pay off — there were no custom acronyms to satisfy.

`zeitwerk:check` is now in the gate. It is not sufficient on its own — it only validates
what is eager-loadable — so the production-env boot stays in the gate alongside it. Note
it also reports `test/mailers/previews` as unchecked; that is expected and not a finding.

### 3d. The two "not backwards compatible" 6.1 defaults were checked, not assumed

`new_framework_defaults_6_1.rb` flags two. Both are fine here, and the reasoning matters
because Phase 4 must not inherit either as a mystery:

- **`cookies_same_site_protection = :lax`.** The only cross-site entry point is the
  Google OAuth callback, and `config/routes.rb:83` declares it as
  `get '/auth/:provider/callback'`. SameSite=Lax still sends cookies on top-level GET
  navigations, so the session survives. **If login breaks in Phase 4, this is not why.**
- **`urlsafe_csrf_tokens = true`.** Rails accepts both encodings on read, so this only
  bites on rollback.

`load_defaults 6.0`'s cookie change (`use_cookies_with_metadata`) carries the same
rollback caveat as every phase here: cookies written under 6.x defaults are not readable
by 5.2 code, so **rolling back a deploy past this phase logs every user out.** That is
recoverable — they log in again — but it should not be a surprise.

Also renamed: `config.action_view.raise_on_missing_translations` →
`config.i18n.raise_on_missing_translations`. **Not a pure rename** — the i18n form also
raises for translations looked up from controllers, so the suite is now strictly stricter.
It stayed at 396/1285, so nothing was relying on a silently-missing controller
translation.

### 3e. `audited` 4.10 → 5.8 — the gate could not have caught the schema half

The API surface this app uses is tiny (the `audited` macro, `:associated_with` on six
models, and `can :read, Audited::Audit`), and none of it changed. The schema did.
audited 5 expects the polymorphic indexes as `[type, id]` where this table has had
`[id, type]` since installation, and expects `version` as a third column on
`auditable_index`. **Nothing fails without them** — they are query-plan changes — so the
"empty `git diff db/schema.rb`" gate would have read as "audited 5 is happy" when it was
not.

`rails generate audited:upgrade` must be run **twice**: its checks are sequential, and it
only offers `add_version_to_auditable_index` once the column order has been reverted. Run
it a third time and it produces nothing, which is how you know the table is finally the
shape audited 5 expects. Two migrations resulted, and this is the only schema change in
the phase.

No test covers audit writing at all, so it was verified by hand: create + update on an
audited model yields two rows, actions `create`/`update`, versions 1/2, and the expected
`audited_changes` diff.

### 3f. Sprockets 3 → 4, deliberately last

`sass-rails` 6 would have pulled sprockets 4 in at hop 1. It was pinned at `~> 3.7`
through both Rails hops so that an asset failure could not be confused with Zeitwerk, then
lifted in its own commit. Rails 7 requires sprockets 4, so this was not deferrable past
Phase 5 regardless.

Verified past "precompile exited 0", because silently empty stylesheets are exactly how
this fails. From a cleared `public/assets` and `tmp/cache/assets`, `application.css` is
3446 bytes and equals `dulu.css` + `react_tabs.scss` + `welcome.scss`, matching the sum of
those three compiled outputs. Dev mode takes a different path (`assets.debug = true`), so
development was booted separately and confirmed to link
`application.debug-<digest>.css` and serve it, `application.js` and `dulu.css` with
content.

**Sprockets is not dead here** — `app/views/layouts/application.html.erb:7` links
`application.css`. But three of the seven stylesheets are:
`components.scss`, `custom.scss` and `fuzzy_date_field.scss` are commented out line by
line and compile to 0 bytes. That is correct output, not a regression. They are dead code
for a later hygiene pass; left alone here to keep the phase's scope honest.
`react_tabs.scss` imports from `node_modules`, so **`node_modules` must exist on the
server at precompile time** — another reason Phase 8b is not optional.

`uglifier` is kept as the JS compressor even though Rails 6.1 defaults to `terser` and
uglifier cannot parse ES6+. That is safe here because sprockets only compiles
`application.js` and `cable.js`, and `application.js` is nothing but Action Cable's ES5
source — 22495 bytes in dev, minified to 11984 in production, verified byte-for-byte as
real output rather than an empty file. The webpack bundle does not go through sprockets at
all. Swapping to terser is a Phase 5/6 tidy-up, not this phase's business.

Incidental improvement: sprockets 3 was emitting
`public/assets/express/lib/application-<digest>.js`, because
`config/initializers/assets.rb:9` adds `node_modules` to `assets.paths`. Sprockets 4 only
compiles what `app/assets/config/manifest.js` links, so the stray file is gone.

### 3g. `capybara` was mandatory, and `test/system` still cannot run here

The plan called the capybara bump optional-ish ("bump it in Phase 3 … a bump would be
unverified by the gate"). It is **mandatory**: Rails 6.1's
`ActionDispatch::SystemTestCase` requires `capybara >= 3.26`, and 2.18.0 makes
`test/system` fail to load outright. Capybara is held at `~> 3.39.0` because 3.40 requires
Ruby >= 3.0 — **another pin to unwind in Phase 5.** `selenium-webdriver` went 3.14 → 4.9
with it.

`test/system/notifications_int_test.rb` has **15 live tests**. (No contradiction with the
Phase 1 note — that was about two *other* integration files, which had no live tests and
were deleted. Nobody has run `test/system` in a long time simply because `bin/rails test`
does not.) It still does not run here: there is no `chromedriver` on this machine, so all
15 error at driver startup. That is **pre-existing and unrelated to the upgrade** —
capybara 2.18 + selenium 3.14 needed a chromedriver too. What this phase changed is that
the file *loads* again: mid-phase, between the 6.1 bump and the capybara bump, it did not
load at all. Deliberately not chased further: the Cypress suite covers the same ground and
is the maintained gate, and installing browser drivers is not an upgrade task. Someone
should decide whether these 15 tests are worth reviving or are superseded by Cypress.

### 3h. Pins resolved and pins added

`listen` 3.1.5 → 3.10.0 pulled `rb-inotify` 0.9.10 → 0.11.1, which **clears the
`rb_safe_level will be removed in Ruby 3.0` warning wall** that made every command's
output unreadable. The plan predicted this would free up here, and it did. Phase 5's
blocker list is one item shorter.

`brakeman` is now **6 warnings, not 7** — "Support for Rails 5.2.8.1 ended" resolved
itself. The remaining six are the five real findings tracked in Phase 8 plus the Ruby
2.7.4 EOL warning, which Phase 5 clears.

**Gate at close** (Ruby 2.7.4 / Rails 6.1.7.10 / Node 20.20.2 / Shakapacker 10.3.2):
`bin/rails test` 396 tests / 1285 assertions / 0 failures / 1 skip — assertion count
unchanged from the pre-upgrade baseline; `npx jest --ci` 125 passed; `yarn
test:cypress:gate` 19 specs / 93 tests all passing on all four gate runs of this phase;
`yarn typecheck` clean; `zeitwerk:check` clean; brakeman 6 known / 0 errors; development
and production boots green; `RAILS_ENV=production bin/rails assets:precompile` green with
output content verified; `BUNDLE_FROZEN=true bundle install` clean.

---

## Phase 4 — OmniAuth 1.9 → 2.1.4 (done, login verified in a browser)

Delivered as **one commit** — deliberately, because it is the rollback unit. Get this
wrong in production and nobody can log in.

`omniauth` 1.9.0 → 2.1.4, `omniauth-google-oauth2` 0.6.0 → 1.2.3 (1.x requires OmniAuth 2,
so they move together), plus `omniauth-rails_csrf_protection`. That carries `oauth2`
1.4 → 2.0.25, `faraday` 0.15.4 → 2.8.1, `jwt` 2.1 → 3.2 and `hashie` 3.6 → 5.1 — a bigger
transitive jump than it looks, but none of those four is used directly anywhere in `app/`,
`lib/` or `config/`. Resolved on Ruby 2.7 with the `nokogiri ~> 1.15.7` pin intact and
`PLATFORMS` still `ruby`, checked in a throwaway lockfile before any code changed.

**The reference branch is useless.** `origin/dependabot/bundler/omniauth-2.1.0` is a
**lockfile-only** commit — no code changes at all. Merging it would have broken login
outright. It is not a template for this work.

### 4a. Three call sites, and the third one reshapes the fix

The plan predicted two GETs into the request phase. There are three, and the one it missed
is the one that cannot be fixed the same way:

1. **`app/controllers/application_controller.rb` — `require_login`.** A logged-out deep
   link redirected straight to `/auth/google_oauth2`. **A redirect is always a GET, so
   this cannot become a POST** — `button_to` is no help here. It now renders
   `shared/welcome` and the user clicks the button. `session[:original_request]` is still
   recorded first, so `send_to_correct_page` still lands them where they were headed.
2. **`app/controllers/sessions_controller.rb#new`** — same problem, same fix.
3. **`app/views/shared/welcome.html.erb`** — the `<a href>` became `button_to`. Its
   wrapping `<p>` had to become a `<div>`: `button_to` emits a `<form>`, which is not
   phrasing content, so a browser silently closes the `<p>` before it and the padding is
   lost.

**The one user-visible change in this phase:** a logged-out deep link used to bounce
straight to Google, and now shows the welcome page first. One extra click. **Forced by
OmniAuth 2, not chosen** — worth saying out loud to anyone who notices.

`config/routes.rb:83` **stays a `get`.** OmniAuth 2 changes only the *request* phase, and
the callback being a GET is precisely why Phase 3d's `cookies_same_site_protection = :lax`
is safe. Converting it to POST would silently break login under 6.1 defaults.

### 4b. The API had to be answered differently from the browser

Every `Api::*` controller inherits `ApplicationController`, so `require_login` fires for
XHRs too. A logged-out XHR now gets **401**. It used to get the 302, which axios follows
into a cross-origin Google redirect; rendering the welcome page for it would be worse
still, because `DuluAxios` cannot tell 200-with-HTML from real data — `response.data`
would hand an HTML string to the caller as though it were a successful payload.

The condition is deliberately `request.format.json? || request.xhr?` and **not**
`unless request.format.html?`. Those look equivalent and are not: a bare `Accept: */*`
(curl, uptime monitors, link checkers) lands on the non-HTML branch and would get a 401
where a browser gets the page. This was caught empirically, not by reading — the first
version of the fix used the `html?` form and `curl localhost:3000/` returned 401. Anything
ambiguous now gets the page.

The frontend still has **no session-expiry handling at all** — `DuluAxios.handleError`
knows only `"server"` and `"connection"`. A 401 surfaces as a generic error rather than
"you have been logged out". Not this phase's business, but a fair Phase 8 candidate.

### 4c. The suite cannot gate this, and the plan understated by how much

`OmniAuth.config.test_mode = true` short-circuits the request phase in
`test/controllers/sessions_controller_test.rb`, `test/application_system_test_case.rb` and
`spec/cypress/app_commands/mock_oauth.rb`. On top of that,
`config/environments/test.rb:29` sets `allow_forgery_protection = false`, so **neither the
Rails suite nor Cypress can exercise the CSRF verification** that is the entire point of
OmniAuth 2. Both suites stay green with real login completely broken.

Two tests encoded the behaviour just removed and were **rewritten, not deleted** —
`test '/login'` and `test 'Create Session - Redirect to original request'`. The second
still checks the mechanism that matters (`original_request` surviving the OAuth round
trip); only its first assertion changed. Three tests were added, the useful one being
*the welcome page must contain a POST form to the request phase and no `<a>` version of
the control*. That is the only automated assertion in any suite that touches the request
phase at all. It will not catch a broken OAuth handshake, but it will catch someone
turning the button back into a link.

### 4d. What was verified by hand, which is more than the plan thought possible

Against a live development server, with no Google account involved:

| Check | Result |
|---|---|
| `POST /auth/google_oauth2` **with** a valid CSRF token | **302 to `accounts.google.com`** with the correct `client_id`, `scope`, `state`, `prompt=select_account`, `hd=sil.org` |
| `POST` with **no** token | rejected — the CSRF layer is live |
| `GET /auth/google_oauth2` | **no redirect to Google** — the breaking change, working |
| browser-style `GET /` and `GET /people` | 200, welcome page |
| axios-style `GET /api/people` | 401 |

That covers everything except Google's own consent screen. **Never fix a surviving GET
path by setting `OmniAuth.config.allowed_request_methods` to include `:get`.** It is the
top search result for the error and it re-opens exactly the hole this bump closes; a
surviving GET is a missed call site.

One rough edge, **unverified in production**: a missing or stale CSRF token on the sign-in
POST raises from middleware, so in development it renders a 500. Rails maps
`ActionController::InvalidAuthenticityToken` to 422 by default, but `production.rb` forces
SSL and this could not be confirmed over plain HTTP locally. The practical case is a
welcome page left open in a tab past session expiry: clicking sign-in shows an error page
instead of simply retrying. Small, real, and a Phase 8 candidate.

### 4e. Verified by Brian in a real browser, 2026-09-04

**Local login works.** Brian clicked sign-in at `localhost:3000` and logged in. Google did
not re-prompt for consent, because his account already had a valid grant for the dev
client — so the *consent screen* is untested, but nothing else is. The path that ran is
the whole application path: `button_to` POST → `omniauth-rails_csrf_protection` token
check → OmniAuth 2 request phase → redirect to Google → callback (still a GET) →
`SessionsController#create` → `Person` lookup → session.

**The Google console is not affected by this phase, and the dev/live client split is not a
gap.** Google never sees the request phase: the POST goes browser → Dulu's Rack
middleware, which answers with a 302 to `accounts.google.com`. What Google receives is the
same GET authorize request as before, and the callback is the same GET at the same URL.
No redirect URI, client ID or console setting changes. Brian's dev and production Google
apps are separate and unconnected, and that is fine — if production login worked before
this phase, the Google half still works after it.

**One thing that has not been seen and cannot be seen from this repo:** the *server's*
`config/initializers/omniauth.rb`. It is gitignored, so it is a different file from the
local one and may pass provider options the 1.x strategy no longer accepts — silently, since
unrecognised options are ignored rather than rejected. **Tracked as a deploy prerequisite
in §8b item 4**, with the list of options 1.2.3 actually forwards.

### 4f. Notes for the deploy

There is deliberately no staging environment to rehearse on (see *Deploy reality*), so
deploy this in a low-traffic window.

Optional, if someone wants the consent screen exercised too: revoke Dulu's access at
`myaccount.google.com/permissions` and log in again, or use a fresh account. That tests
Google's UI rather than this code, which is why it is optional.

Note when testing locally that the `redirect_uri` OmniAuth builds embeds the port, so use
**3000** — a server on another port sends Google a URI that is almost certainly not
registered. The rollback is `git revert` of the single commit,
and Capistrano still has the previous release directory on the server.

**Gate:** 398 tests / 1297 assertions / 0 failures / 1 skip; jest 125 passed; Cypress 93/93
including the rewritten `log_in.spec.js`; `tsc` clean; `zeitwerk:check` clean; brakeman 6
known / 0 errors; development and production boots green; `RAILS_ENV=production
assets:precompile` green; `BUNDLE_FROZEN=true bundle install` clean; empty
`git diff db/schema.rb`; `foreman s` starts all three processes. **Plus the manual
browser login, done — see 4e.**

---

## Phase 5 — Ruby 3.x, Rails 6.1 → 7.0 → 7.1, and secrets migration

Three coupled sub-steps. Split them into separate commits.

### 5a. Ruby 2.7 → 3.1.3 (done)

Rails 7.2 requires Ruby ≥ 3.1, so 3.1 is the right landing spot (not 3.0).

**The dependency graph did not move at all.** Probed first with a throwaway `bundle lock`
in a scratch directory under `RBENV_VERSION=3.1.3`, the same technique as §3a: the
resolved `GEM` section came out **byte-identical** to the Ruby 2.7 lockfile. So this hop
needed no Gemfile change and produced no `Gemfile.lock` diff. Three specific Ruby-3.1
hazards were checked and all three were already handled:

- **`net-smtp`/`net-imap`/`net-pop` left the default gems in Ruby 3.1**, which kills
  `mail` < 2.8 with `cannot load such file -- net/smtp`. Not an issue here: `mail` is
  already 2.9.1 and declares them, and all three are already in the lockfile.
- **psych 4 ships with Ruby 3.1** and makes `safe_load` the default path, which can break
  `secrets.yml`, `database.yml` aliases and YAML fixtures. Rails 6.1.7 already carries the
  psych-4 fix, and `config/database.yml` has one anchor (`test: &TEST`) that nothing
  references, so there is no alias to trip over. Verified by booting, not assumed.
- **`debase` 0.2.9** — expected to be the casualty, since it will not build on Ruby 3.4
  (see the pins list). It builds fine on 3.1; `debase-ruby_core_source` 4.0.1 ships
  `ruby-3.1.0-p0` headers. One `bundle install` did fail on a `debase-ruby_core_source`
  header path, but it was transient and did not recur — not a real incompatibility.

**What actually broke was keyword arguments, in two places, and the plan was too
optimistic that Phase 2 had covered it.** Phase 2 fixed *warnings emitted by the code
paths the suites exercise*. These two were a hash passed positionally to a
keyword-argument method, which Ruby 2.7 only warned about at the call site if it ran:

1. **`config/initializers/session_store.rb`** — `session_store :cookie_store, { key:
   ..., expire_after: ... }` against Rails' `session_store(new_session_store = nil,
   **options)`. This is a **boot failure**, not a test failure: `wrong number of arguments
   (given 2, expected 0..1)` on every `bin/rails` command. Braces removed.
2. **`app/controllers/concerns/translation_helper.rb:58`** — `I18n.t(params[:key], subs)`
   where `subs` is a built-up hash. Splatted to `**subs`. This one was worth 29 test
   errors across `NotificationTest` and `ParticipantsControllerTest`, because every
   notification's text goes through `t_nested`. A matching positional hash in
   `test/models/notification_test.rb:111` (`I18n.t("Ezra", { locale: :fr })`) was fixed
   the same way.

The lesson for Phase 6's Ruby 3.4 hop: **grep for hashes passed positionally into
framework methods before running anything**, because the first one blocks boot and hides
the rest.

**Two corrections to what this section used to say:**

- The rbenv pin is **`Capfile:32` — `set :rbenv_ruby`**, not `config/deploy.rb`, which
  has no rbenv line. `.ruby-version` and `Capfile` must move together; the README already
  says so and its "currently 2.7.4" was updated in the same commit.
- The table in §5b says `config/environments/production.rb:77-78`; the real lines are
  **74-75**. The rest of the six-call-site enumeration is exact.

**Noise, not a failure:** `rails test` now prints `PG::Coder.new(hash) is deprecated.
Please use keyword arguments instead!` twice per run, from *inside* `activerecord
6.1.7.10`'s postgresql adapter. It is a `pg` gem warning on stderr, not an
`ActiveSupport::Deprecation`, so `deprecation = :raise` does not catch it and it is not
worth pinning around. It should disappear at Rails 7.

**Gate at close** (Ruby 3.1.3 / Rails 6.1.7.10 / Node 20.20.2 / Shakapacker 10.3.2):
Rails **398 tests / 1297 assertions, 0 failures, 0 errors, 1 skip**; Jest **125 passed**;
`tsc --noEmit` clean; `zeitwerk:check` clean; Cypress **93/93**; brakeman **5 warnings**,
which is the predicted drop from 6 — "Support for Ruby 2.7.4 ended" cleared exactly as
§"Pre-existing security findings" said it would, and the remaining 5 match that table
line for line. (The follow-up commit that raised brakeman to 7.1.1 moves that expected
number back to 7 — see the pins table for why that is not a regression.) `foreman s` verified by hand: web.1 listening on 3000 and answering 200,
webpacker.1 compiling successfully.

One environment note that cost time and is not Dulu's fault: **a fresh shell here has
Node 12 on `PATH`**, so `yarn typecheck` and `yarn jest` fail with 25 broken suites and a
`internal/modules/cjs/loader.js` stack that looks like a real regression. `nvm use` first.

### 5b. `config/secrets.yml` → ENV (done)

`Rails.application.secrets` is **removed** in Rails 7.1, so this had to land before 5c.
Went with ENV rather than encrypted credentials, for the reason the forecast gave:
`config/secrets.yml`, `config/database.yml` and `config/initializers/omniauth.rb` are
already gitignored and Capistrano-symlinked, so the team's model is already "secrets live
on the server, outside git". ENV preserves it; credentials would add `master.key`
distribution for no gain here.

**Six call sites, all rewritten, and the enumeration in the forecast was exact** (bar one
line number — production.rb is 74-75, not 77-78):

| Location | Was | Now |
|---|---|---|
| `app/mailers/notification_mailer.rb:5` | `secrets.smtp_username` | `config.x.smtp_username` |
| `app/mailers/error_mailer.rb:10` | `secrets.admin_email` | `config.x.admin_email` |
| `app/views/notification_mailer/welcome.html.erb:26` | `secrets.admin_email` | `config.x.admin_email` |
| `app/views/notification_mailer/welcome.text.erb:14` | `secrets.admin_email` | `config.x.admin_email` |
| `config/environments/production.rb:74-75` | `secrets.smtp_{username,password}` | `config.x.smtp_{username,password}` |

Two things the forecast did not list and this commit also removed:

- **`config/environments/production.rb:20` had `config.read_encrypted_secrets = true`**,
  pointing at a `config/secrets.yml.enc` that does not exist and never has. It is part of
  the same removed API. Deleted.
- **`gmail_username`** is referenced by nothing but the README and this plan. Dropped from
  the README; the key can be deleted from each machine's `secrets.yml` at leisure.

#### The design: fail loud in production, inert placeholders everywhere else

`config/application.rb` gains `Dulu.env_config(name, non_production_default)`:

```ruby
def self.env_config(name, non_production_default)
  return ENV.fetch(name) if Rails.env.production?

  ENV.fetch(name, non_production_default)
end
```

**Production has no fallback on purpose.** The failure mode being avoided is specific:
`notification_mailer.rb:5` is `default from:` in the *class body*, evaluated at load time,
so a missing value does not raise — it makes every email `From: nil`. Combined with
production.rb's `raise_delivery_errors = false`, that loses mail in total silence. A
`KeyError` at boot is strictly better.

**Development and test get a placeholder, and it is genuinely inert.** Both
`config/environments/development.rb:35` and `test.rb:35` set
`action_mailer.delivery_method = :test`, so nothing is ever handed to an SMTP server. Net
effect: a fresh clone now needs *no* setup step here, where the README previously told
developers to hand-add a fake `smtp_username` to `secrets.yml`.

`config.x` is an `ActiveSupport::OrderedOptions`, so a **typo in one of these key names
reads back as `nil` rather than raising** — the `ENV.fetch` is doing all the safety work,
not the lookup. That is why the two new mailer tests assert `refute_nil` rather than only
comparing values.

#### What was verified, and the one number that matters

- **`assets:precompile` does boot `application.rb`.** Ran
  `env -u SMTP_USERNAME … SECRET_KEY_BASE=x RAILS_ENV=production bin/rails
  assets:precompile` and it died with `KeyError: key not found: "SMTP_USERNAME"` at
  `config/application.rb:46`. This is the intended failure — it happens before the release
  is published — but it makes the environment variables a **hard prerequisite for the
  first deploy of this branch**, not a nice-to-have. See §8b.
- With the three variables set, production config loads and
  `config.action_mailer.smtp_settings[:user_name]` is populated; boot then stops at the
  Postgres connection, which is only because there is no production database on this
  machine.
- `NotificationMailer.default[:from]` is a real address, not `nil`.
- **Dev/test self-heal without `secrets.yml`.** Moved the local file aside, booted, and
  `Rails.application.secret_key_base` came back 128 bytes with a freshly generated
  `tmp/development_secret.txt` (note: `development_secret.txt`, not the
  `local_secret.txt` that older docs name). Restored the file afterwards. So dropping
  `secret_key_base` from a developer's local copy is safe; the only cost is that the local
  dev session cookie invalidates once.

**Two new tests**, because nothing covered any of this: `notification_mailer_test.rb`
asserts `default[:from]` tracks `config.x.smtp_username` and is not nil, and a new
`error_mailer_test.rb` covers the `admin_email` path that addresses the report both to and
from — a `nil` there would mail the report to nobody without raising.

#### The server side, which is not in this commit

`secret_key_base` **has zero call sites** — Rails reads it out of `secrets.yml` internally
— which is exactly why it is easy to miss. Under ENV it becomes `SECRET_KEY_BASE`. If it
is unset when the deploy stops symlinking `config/secrets.yml`, the app **fails to boot**;
if it is set to a *different* value than the old file held, **every session cookie
invalidates** and every user is silently logged out.

`config/deploy.rb:10` still has
`append :linked_files, "config/secrets.yml", …` and **this commit deliberately leaves it
alone**. Rails 6.1 still reads `secrets.yml`, so nothing is broken by keeping the symlink;
removing it is a sequenced deploy step, not a code change. Tracked as §8b item 7.

**One trap worth stating plainly, because it is easy to get wrong:** `set :default_env`
in `config/deploy.rb` will not work here. Capistrano evaluates `deploy.rb` on *your*
machine, so `ENV["SECRET_KEY_BASE"]` inside it reads the laptop's environment, not the
server's — and hardcoding the values would put them in git, which is the whole thing this
setup exists to avoid. The variables have to be set **server-side**, in whatever the
deploy user's non-interactive SSH shell actually reads (`~/.ssh/environment`, a systemd
unit, or a file sourced by an SSHKit command prefix). That choice is server work; see §8b
item 7.

**Gate:** Rails **400 tests / 1305 assertions, 0 failures, 0 errors, 1 skip**; Cypress
**93/93**; `zeitwerk:check` clean; brakeman **7** (the expected 5 + 2 EOL). Production
config boot verified with dummy variables as above. **Not** gated on a staging deploy —
there is no staging environment, by decision.

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

## Phase 8 — Post-upgrade pass: security, plus deploy mechanics (no version changes)

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
7. **The frontend has no session-expiry handling.** `DuluAxios.handleError` knows only
   `"server"` and `"connection"`. Phase 4 made a logged-out XHR return 401 (it used to
   return a 302 that axios followed cross-origin), so the status is now clean and
   distinguishable — nothing consumes it. Surface "you have been logged out, sign in
   again" instead of a generic error.
8. **A stale CSRF token on the sign-in button gives an error page.** Leave the welcome
   page open past session expiry, click sign in, and `omniauth-rails_csrf_protection`
   raises from middleware. Rails maps that to 422, but the user sees an error page rather
   than a retry. Rescue it and re-render the welcome page.
9. **`hd: 'sil.org'` does not restrict who can log in, and someone probably thinks it
   does.** `config/initializers/omniauth.rb` passes `hd` to Google, and Phase 4 confirmed
   it still reaches the authorize URL under `omniauth-google-oauth2` 1.x. But `hd` is a
   *hint* to Google's account chooser, not a guarantee, and Google's own guidance is to
   verify the `hd` claim on the returned identity rather than trust the request
   parameter. `SessionsController#create` does not: it reads `omniauth.auth.info.email`
   and looks up `Person.where('email ILIKE ?', @gmail).first`, so authorization rests
   entirely on there being a matching `Person` with `has_login`. A non-sil.org address
   that matches such a row logs in. **Pre-existing, not a Phase 4 regression** — the
   Person allowlist is a defensible design — but the belief that `hd` enforces the domain
   should either be made true (check the returned `hd`/email domain in `#create`) or
   written down as false.
10. **Re-run `bundle exec brakeman` expecting zero warnings**, and consider adding it to
   the gate as a hard failure rather than a compare-against-known-list.

By the time this phase runs, brakeman will be unpinned (Phase 5 lifts it to 6+ on Ruby
3.1) and the two EOL warnings for Rails 5.2.8.1 and Ruby 2.7.4 will have resolved
themselves.

**Note:** each of the items above is a genuine behaviour change with no test covering it
today. Write the test first in each case — that is the actual work here, not the one-line
fix.

### 8b. Deploy mechanics — parked here, but **not** sequenced after Phase 7

Filed in this phase so it is not lost, not because it comes last. These are prerequisites
for the **first deploy of `upgrade/rails-8`, whenever that happens** — after Phase 3, after
Phase 5, or only at the end. Whoever deploys hits them on that deploy regardless of which
phase the branch has reached. Nothing here is a security finding and nothing changes a
version; the full reasoning is in §2g, which is where a reader in Phase 2 context will
look.

The short form: the server's `node_modules` is a shared `linked_dirs` entry that no deploy
step ever updates, while `capistrano/rails/assets` runs `assets:precompile` on every
deploy. Post-Phase-2 code needs Node 20 and the Shakapacker tree; the server still has the
Webpacker 3 / Node 12 one, so **precompile fails on the server even though it passes
locally.** Three things fix it:

1. **Node 20.20.2** on the server (not just "Node 20" — dart-sass requires `>=20.19.0`).
2. **`corepack enable`, once** — otherwise there is no `yarn` on `PATH` at all.
3. **Either uncomment `require "capistrano/yarn"` in `Capfile`** so `yarn install` runs as
   part of deploy, **or** update the shared `node_modules` by hand. Enabling it is the
   right long-term answer and changes deploy behaviour, so it is Brian's call, not
   something to slip into an upgrade commit.

**Untracked config on the server, which nothing in this repo can verify.** Three files are
gitignored, so the server's copies are *different files* from the local ones and have
never been reviewed against the upgraded gems. Read them on the server before deploying:

4. **`config/initializers/omniauth.rb` — check it against what
   `omniauth-google-oauth2` 1.2.3 still accepts.** Phase 4 took this gem from 0.6.0, and
   options it no longer recognises are **silently ignored**, not rejected — so a stale
   option does not fail the deploy, it just stops doing whatever it was doing. That is the
   worst failure mode available: `hd`, for instance, would quietly stop being sent.
   The local copy passes only `prompt` and `hd`, both fine. 1.2.3 forwards these to
   Google and nothing else:

   ```
   access_type  hd  login_hint  prompt  request_visible_actions  scope  state
   redirect_uri  include_granted_scopes  enable_granular_consent  openid_realm
   device_id  device_name
   ```

   plus the strategy options `name`, `skip_jwt`, `jwt_leeway`, `authorize_options`,
   `overridable_authorize_options`, `authorized_client_ids`, `client_options`,
   `image_size` and `image_aspect_ratio`. Anything else in the server's file is dead
   weight and should be removed or replaced deliberately.

   Note the *client ID and secret* need no attention: production uses a different Google
   app from the dev one, and Phase 4 changed nothing Google sees. The request phase is a
   POST from the browser to Dulu's own middleware; Google still receives the same GET
   authorize request and the same GET callback at the same URL. No redirect URI or console
   setting changes.
5. **`config/secrets.yml`** — no longer read by application code as of Phase 5b, but
   **still the source of `secret_key_base`** while the app is on Rails 6.1, and still
   symlinked. Do not delete it from the server; see item 7 for the order.
6. **`config/database.yml`** — the production block carries the real credentials only on
   the server. Untouched by any phase so far; listed so nobody assumes the repo copy is
   authoritative.

#### 7. Four environment variables, which are a hard prerequisite for the first deploy of this branch

Phase 5b moved the mail identities out of `config/secrets.yml` and into ENV, with **no
fallback in production** — deliberately, so a missing value fails at boot instead of
sending mail `From: nil` into a `raise_delivery_errors = false` void. The consequence,
verified rather than assumed: **`assets:precompile` boots `config/application.rb`**, so
without these variables the deploy dies at precompile with
`KeyError: key not found: "SMTP_USERNAME"`.

| Variable | Value | Notes |
|---|---|---|
| `SMTP_USERNAME` | the current `smtp_username` from the server's `config/secrets.yml` | was the mailgun user |
| `SMTP_PASSWORD` | the current `smtp_password` | **exists only on the server** — it is not in any developer's local copy |
| `ADMIN_EMAIL` | the current `admin_email` | used as both `to:` and `from:` on JS error reports |
| `SECRET_KEY_BASE` | the **exact** current value, copied verbatim | see below |

**`SECRET_KEY_BASE` has its own ordering and its own failure mode.** It has zero call
sites — Rails reads it from `secrets.yml` internally — so it is the one that gets
forgotten. Set it to the exact existing value, not a fresh one: a *different* value
invalidates every session cookie and silently logs out every user. Sequence:

1. Set all four variables on the server.
2. Deploy. `config/deploy.rb:10` still symlinks `config/secrets.yml` at this point, which
   is fine and intentional — Rails 6.1 reads `secret_key_base` from either source.
3. Only after a deploy has succeeded with the variables in place, remove
   `config/secrets.yml` from `linked_files`.

Step 3 becomes mandatory at Rails 7.1 (Phase 5c), which removes
`Rails.application.secrets` entirely and will stop reading the file at all.

**`set :default_env` in `config/deploy.rb` is the wrong mechanism and will not work.**
Capistrano evaluates `deploy.rb` on the deploying machine, so `ENV[...]` there reads the
laptop's environment, not the server's; and literal values in that file would be committed
to git, which is exactly what this whole symlinked-secrets setup exists to prevent. The
variables must be set where the deploy user's **non-interactive** SSH shell will see them
— `~/.ssh/environment` (needs `PermitUserEnvironment`), a systemd unit if the app runs
under one, or a server-side file pulled in via an SSHKit command prefix. Note that
`~/.bashrc` and `~/.profile` are **not** sourced for Capistrano's non-interactive
commands, which is the usual way this gets missed.

Two lockfile facts for whoever runs that deploy, since `config/deploy.rb` sets
`bundle_flags '--deployment'` and that mode refuses to re-resolve:

- `Gemfile.lock`'s `BUNDLED WITH` is still **2.4.22** and `PLATFORMS` is unchanged across
  every hop of Phases 1–3. Nothing new is required of the server's bundler.
- The local `.bundle/config` sets `BUNDLE_WITHOUT: "db"`, which is a **stale no-op** —
  there is no `group :db` in the `Gemfile`. It is gitignored and never deployed, so it
  affects nothing but the `Gems in the group 'db' were not installed.` line every
  `bundle install` prints. Do not read that line as a missing dependency.

**Deliberately not done.** No deploy config has been touched. This is separate from the
deploy *destination* question, which is closed and out of scope (see the top of this
plan).

---

## Sequencing summary

```
Phase 0  Hygiene, Cypress baseline, branch triage    DONE  no version changes
Phase 1  Ruby 2.7 + Rails 5.2                       DONE  Ruby moves once, 4 hops
Phase 2  Node 20 + Webpacker -> Shakapacker 10      DONE  joint frontend/backend step
Phase 3  Rails 6.0 -> 6.1 (Zeitwerk) + audited 5    DONE  + sprockets 4, capybara 3
Phase 4  OmniAuth 2                              DONE  browser login verified
Phase 5  Ruby 3.1 + secrets -> ENV + Rails 7.0 -> 7.1        deploy-affecting
Phase 6  Ruby 3.4 + Rails 7.2 -> 8.0 + Cypress/cypress-on-rails
Phase 7  React 18 -> react-redux 9 -> React Router 6   independent; router is the big one
Phase 8  Security pass + deploy mechanics         post-upgrade, no version changes
         (8b's deploy prerequisites are needed at the FIRST deploy of this
          branch, not after Phase 7 -- see 8b)
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
