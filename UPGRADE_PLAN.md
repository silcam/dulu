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
bin/rails test                     # 400 tests / 1319 assertions as of Phase 6, 0 failures
npx jest --ci                      # must stay at 125 passed
yarn test:cypress:gate             # 21 specs / 98 tests as of Phase 7c(2) -- see notes below
                                   # NB: its `yarn testPacks` step exits 0 on the run after
                                   # a FAILED compile -- see Phase 7c's build-hazard note
yarn typecheck                     # Phase 2 onward -- see "Where type-checking lives"
bundle exec brakeman               # 5 as of Phase 6c2: the application findings, no EOL noise
bin/rails runner -e development 'puts Rails.version'
bin/rails zeitwerk:check           # Phase 3 onward only
foreman s                          # the documented way to run this app -- see below

# Production-environment boot. DATABASE_URL because config/database.yml's production
# block has no credentials, and the four secrets because Phase 5b deliberately gives
# production no fallback for them.
DATABASE_URL=postgres://dulu:dulu@localhost/dulu_test \
SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'print SecureRandom.hex(64)') \
SMTP_USERNAME=a@b.c SMTP_PASSWORD=x ADMIN_EMAIL=a@b.c \
  bin/rails runner -e production 'puts Rails.version'

# From Phase 2 onward, also confirm what deploy actually runs. Same env as above --
# precompile boots the app, and recurring_jobs.rb needs the database.
rm -rf tmp/shakapacker public/packs public/assets   # or the webpack half silently skips
RAILS_ENV=production bin/rails assets:precompile
yarn install --check-files         # MANDATORY after the line above -- see below

# db/schema.rb round-trip. `bin/rails test` maintains the test database with
# db:migrate, so NOTHING else in this recipe ever executes schema.rb -- a broken
# dump is invisible to all 400 tests and all 98 Cypress specs, and surfaces only
# for a new developer following the README or a fresh production database.
bin/rails db:schema:load RAILS_ENV=test && bin/rails test
```

**Do not skip the last two lines. They are not decoration.** Phase 5c found four problems
by booting the production environment, and **three of them were invisible to every other
check in this recipe** — `delayed_job`'s missing `AbstractAdapter` (production is the only
environment that sets `queue_adapter = :delayed_job`), `recurring_jobs.rb` autoloading
during initialization, and an `uglifier` failure on Rails 7's ES6 actioncable asset that
had been **sitting broken since the 7.0 hop** because `js_compressor` is only configured
in `production.rb`. The precompile line was already written here before Phase 5; it
evidently was not being run. It is the single highest-value check in this list.

**And clear the caches first, or the line half-runs and still looks green.** Shakapacker
keys its build on a digest in `tmp/shakapacker`; on a warm tree the task ends with
`[Shakapacker] Everything's up-to-date. Nothing to do` and the **production-mode webpack
build never executes** — you have proven the Sprockets half only. That happened on the
first 5c run and was caught on re-reading the output. With the caches cleared the same
command spends ~21s in webpack and emits `react-dom.production.min.js`, which is how you
know it really ran.

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
   response overwrite a newer one (Phase 8d item 3). It presents as a detached `<li>`, as a
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
| `delayed_job "~> 4.1.11"` | 4.2 needs `ActiveJob::QueueAdapters::AbstractAdapter` — **Rails 7.2+, not 7.1**, verified on 7.1.6 | Phase 6a (Rails 7.2) | **done in 6a** — now `~> 4.2` |
| `brakeman "~> 5.4"` | brakeman 6+ requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) | **done in 5a** — now `~> 7.0` (7.1.1) |
| `capybara "~> 3.39.0"` | capybara 3.40+ requires Ruby >= 3.0 | Phase 5 (Ruby 3.1) | **done in 5a** — now `~> 3.40` |
| `sprockets "~> 4.0"` | added in Phase 3; upper bound only, not a hold-back | — | — |
| `concurrent-ruby "< 1.3.5"` | 1.3.5 dropped its transitive `require "logger"`; ActiveSupport <= 7.0 needs it | Phase 5c (Rails 7.1) | **done in 5c** — pin deleted, now 1.3.8 |

**Dropping the `nokogiri` pin is not enough on its own** — `bundle install` does not
upgrade a gem already present in the lockfile, so nokogiri sat at 1.15.7 with no pin
holding it. It took an explicit `bundle update nokogiri` to reach 1.18.10. Worth
remembering for the remaining unwinds at 5c.

**brakeman 7.1.1 changed the expected warning count from 5 back up to 7**, and this is
not a regression. It adds two EOL checks the 5.4 line did not have:

| Check | Message | Clears at |
|---|---|---|
| `EOLRuby` (`.ruby-version:1`) | Support for Ruby 3.1.3 ended 2025-03-31 | **cleared in Phase 6b** (Ruby 3.4.9) |
| `EOLRails` (`Gemfile.lock`) | Support for Rails 6.1.7.10 ended 2024-10-01 | **cleared in Phase 6c2** (Rails 8.1.3.1) |

So from 5a on, **the expected brakeman total is 7 = the 5 pre-existing application
findings + 2 EOL warnings**. From Phase 6b it is **6** (Ruby EOL cleared), and from
Phase 6c2 it is **5** — Rails 8.1 cleared the last EOL warning, so the number is now
exactly the pre-existing application findings. Also
brakeman 7 reports **3** obsolete entries in `config/brakeman.ignore` rather than the 5
noted above; the cleanup is still a Phase 8a item.

Two more known blockers, not yet actionable:

- ~~**`rb-inotify` 0.9.10**~~ **resolved in Phase 3.** `listen` 3.1.5 → 3.10.0 carried
  `rb-inotify` to 0.11.1 and the `rb_safe_level` warning wall is gone.
- ~~**`capybara` 2.18.0**~~ **resolved in Phase 3, and it was not optional** — Rails 6.1
  requires `capybara >= 3.26`. Now `~> 3.39.0`, itself a Ruby-2.7 ceiling (see the table
  above). `test/system` still cannot run on this machine for want of a `chromedriver`;
  see Phase 3g.
- ~~**`debase`**~~ **resolved in Phase 6b** — it did not merely fail to build on Ruby 3.4, it would not install at all. Replaced with the `debug` gem.

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
   where Enzyme has to be reconsidered anyway. **Superseded by Phase 6f** — see the
   "Still open" note below.

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

- **`jest` 26 → 29 and `ts-jest` 26 → 29.** The stated blocker was that Jest 27 changes
  the default `testEnvironment` from jsdom to node, breaking the Enzyme tests. **Phase 6f
  removed Enzyme, and the premise was wrong anyway: there were no Enzyme tests.** No test
  under `test/javascript/` references `document`, `window`, `localStorage`, or
  `navigator`, so the jsdom default is not load-bearing today. That makes this a plain
  version bump rather than a migration — but re-check it at the point of doing it, since
  Phase 7 may add rendering tests that *do* need jsdom, in which case set
  `testEnvironment: "jsdom"` explicitly rather than relying on a default.
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
"you have been logged out". Not this phase's business — Phase 8d item 6.

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
instead of simply retrying. Small, real, and Phase 8d item 7.

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
  the README. (As of 5c the whole `secrets.yml` file is unread, so the leftover key in each
  machine's copy is moot rather than merely deprecated.)

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

### 5c. Rails 6.1 → 7.0.10 → 7.1.6 (done)

Two hops, each split into "move the gems, keep the old defaults" and then "adopt the new
defaults", so that a behaviour change and a dependency change are never in the same
commit. Both times the suite was green on the new gems *before* `load_defaults` moved,
which is worth keeping as a habit — it makes a later bisect meaningful.

`rails-i18n` had to move in lockstep both times. It caps railties at `< N+1`, so version
solving fails outright otherwise; its Gemfile comment now says so.

**Use a targeted `bundle update`, not a broad one.** A probe with `bundle lock --update`
pulled rubocop 0.76 → 1.90, capistrano 3.10 → 3.20, cypress-on-rails 1.5 → 1.20, foreman,
web-console and about a dozen others. `bundle update rails rails-i18n` moved only the
framework.

#### The 7.0 hop was quiet, and here is why

`app:update` produced exactly two useful things: `new_framework_defaults_7_0.rb` (adopted
wholesale, then deleted) and a `db/schema.rb` rewrite to `ActiveRecord::Schema[7.0]` with
**`precision: nil` on every existing datetime column**. That annotation is load-bearing:
Rails 7 changes the default datetime precision to 6, so without it a schema load would
create columns that differ from production's.

Two of the riskiest 7.0 defaults were already no-ops here:

- **`cookies_serializer`** is already `:json` in its own initializer, so the
  marshal → json cookie break does not apply.
- **`wrap_parameters_by_default`** — `config/initializers/wrap_parameters.rb` already sets
  `wrap_parameters format: [:json]` explicitly.

Two took effect and were checked by hand rather than assumed:

- **`button_to_generates_button_tag = true`** — directly touches Phase 4's welcome page.
  No change, because that `button_to` already used the block form, which emitted
  `<button>` under 6.1 too. Verified by rendering `shared/welcome` and confirming the
  output is still `<button id="google-signin-link">` inside `<form method="post">`.
- **`raise_on_open_redirects = true`** — the only dynamic redirect in the app is
  `sessions_controller.rb:51`'s `redirect_to session[:original_request]`, and that value is
  only ever assigned from `request.path`, so it stays same-origin. The Cypress "Does
  redirects" spec covers it.

**One 7.0 default is deploy-affecting:** `key_generator_hash_digest_class` moves to
SHA256, which invalidates every existing session cookie. Every user gets logged out once
on deploy. Acceptable, but it should not arrive as a support ticket — §8b item 7.

#### The 7.1 hop found three real things

**1. `Rails.application.secrets` is deprecated in 7.1, not removed — and the plan's
framing hid the actual failure.** Removal is 7.2. But merely *having* a `secret_key_base`
in `config/secrets.yml` makes Rails emit the deprecation, and `test.rb` sets
`deprecation = :raise`, so `bin/rails test` died at boot even though Phase 5b had already
migrated every call site. Rails only falls back to generating its own local secret when
`secrets.secret_key_base` is absent.

Fixed in `config/application.rb` with `config.paths["config/secrets"] = []`, which stops
Rails reading the file at all. **This has a deploy consequence that is easy to miss:** it
also makes the `config/secrets.yml` symlink on the production server inert, so
`SECRET_KEY_BASE` in the environment becomes the *only* source in production and its
absence is a boot crash. §8b item 7 previously said the symlink could be relied on as a
fallback during the transition; that is no longer true and has been corrected there. That is what 5b's migration actually meant. The alternative
— telling each developer to delete a key from a gitignored file — would hand everyone a
hard boot failure and a confusing error. With the path emptied, `secret_key_base` resolves
correctly on its own: dev and test self-generate a stable `tmp/local_secret.txt`,
production requires `SECRET_KEY_BASE`.

**2. `delayed_job` cannot be unpinned here — the plan was wrong about which Rails version
adds `AbstractAdapter`.** It says 7.1+; it is **7.2**. Verified on 7.1.6:
`activejob-7.1.6/lib/active_job/queue_adapters/` has no `abstract_adapter.rb` and the
constant appears nowhere in the gem. Unpinning got as far as
`uninitialized constant ActiveJob::QueueAdapters::AbstractAdapter` while booting
production. Restored to `~> 4.1.11`; it unwinds in **Phase 6**. Note that **production is
the only environment that sets `active_job.queue_adapter = :delayed_job`**, so no test and
no other environment would ever have caught this — it is only visible by booting the
production environment deliberately.

**3. `config/initializers/recurring_jobs.rb` referenced an autoloaded constant during
initialization**, which 7.1 turns from a deprecation into an error:
`uninitialized constant DailyEmailTask` on every production boot. Moved inside
`Rails.application.config.after_initialize`, which runs after eager loading and preserves
the old behaviour exactly.

#### The thing the gate had never covered: a real production precompile

Everything above was found by deliberately booting the production environment. Running the
*whole* `assets:precompile RAILS_ENV=production` went further and found a **deploy-breaking
bug that had been latent since the 7.0 hop**:

```
Uglifier::Error: Unexpected token: punc ((). To use ES6 syntax,
harmony mode must be enabled with Uglifier.new(:harmony => true).
```

Rails 7's `actioncable` ships an **ES6** Sprockets asset — classes, arrow functions,
template literals, spread — and `uglifier` 4 cannot parse it. Rails 6.1's actioncable
shipped an ES5 build, so this appeared precisely at the 7.0 hop and **no phase gate would
ever have shown it**: `js_compressor` is only set in `production.rb`, and nothing in the
recipe compiled production assets.

Replaced `uglifier` with **`terser`** (`config.assets.js_compressor = :terser`). Uglifier's
`harmony: true` would also work, but terser is Rails 7's own default and needs no flag.

While there: `app/assets/javascripts/cable.js` required `action_cable`, which now logs
`DEPRECATION: action_cable.js has been renamed to actioncable.js – please update your
reference before Rails 8`. Since Phase 6 targets Rails 8, changed to
`//= require actioncable`. The two assets are the same UMD build and both define the
`ActionCable` global, so this is a rename and nothing more.

**`assets:precompile RAILS_ENV=production` needs a reachable database**, because
`recurring_jobs.rb` schedules a Delayed::Job on boot. That is pre-existing and unchanged —
it was true when the code sat in an initializer too — but it is worth knowing before
someone tries to precompile on a build box without database access. Locally it was run
against the development database via `DATABASE_URL`.

#### Pins after 5c

| Pin | Status |
|---|---|
| `concurrent-ruby "< 1.3.5"` | **dropped** — Rails 7.1 requires `logger` itself; now on 1.3.8 |
| `delayed_job "~> 4.1.11"` | **still pinned**, and now correctly attributed to Rails 7.2 |
| `uglifier` | **removed entirely**, replaced by `terser` |

**Gate at close** (Ruby 3.1.3 / Rails 7.1.6 / Node 20.20.2 / Shakapacker 10.3.2): Rails
**400 tests / 1308 assertions, 0 failures, 0 errors, 1 skip**; Jest **125**; `tsc
--noEmit` clean; `zeitwerk:check` clean; Cypress **93/93**; brakeman **7** (5 + 2 EOL);
`foreman s` serving 200 on 3000; and, new to the recipe from here on, a **full
`assets:precompile RAILS_ENV=production`**.

**Not** gated on a staging deploy — the earlier text here said "do a real staging deploy
before proceeding", which contradicts the standing decision that there is no staging
environment. Replaced by the production-environment boot and precompile above, which is
what can actually be run.

**The lesson, and it is an uncomfortable one:** the verification recipe *already*
listed `RAILS_ENV=production bin/rails assets:precompile`. It was not being run. Three of
the four findings above were invisible to everything else in the gate, and the uglifier
one had been broken for an entire hop. The recipe now says so in bold at the point of
use.

---

## Phase 6 — Rails 7.2 → 8.1, Ruby 3.1 → 3.4, Cypress 4 → 15 (done)

**The plan's ordering was wrong and a probe fixed it before any commit.** It said Ruby 3.4
first, then 7.2, then 8.0. A throwaway `bundle lock` under Ruby 3.1.3 settled it in one
run: Rails 7.2 resolves there, Rails 8.0 does not — `rails-i18n` 8.0 requires Ruby ≥ 3.2,
so version solving fails outright. Actual order:

| Step | What | Status |
|---|---|---|
| 6a | Rails 7.1.6 → 7.2.3.2, `load_defaults 7.2`, unpin `delayed_job` | done |
| 6b | Ruby 3.1.3 → 3.4.9, `debase` → `debug`, and two forced tooling bumps | done |
| 6c | Rails 7.2.3.2 → 8.0.5.1, `load_defaults 8.0` | done |
| 6c2 | Rails 8.0.5.1 → 8.1.3.1, `load_defaults 8.1` — added at Brian's request | done |
| 6d | `cypress-on-rails` post-1.17 layout | done |
| 6e | Cypress 4.1 → 15.21.1, in two commits | done |

Putting Rails 7.2 first also kept `debase` — which does not survive Ruby 3.4 — out of the
same commit as a Rails major.

`rails-i18n` moved at every single hop (6.0 → 7.0 → 7.2-compatible → 8.1.0). It caps
railties at `< N+1`, so it fails resolution every time it is forgotten. Its Gemfile
comment now says so.

### 6a. Rails 7.2 — one application change, with a badly misleading error

`delayed_job` is unpinned here, which is where it always belonged:
`ActiveJob::QueueAdapters::AbstractAdapter` really does arrive in 7.2 (§5c corrected the
plan's claim of 7.1). Verified by booting production, the only environment that sets
`queue_adapter = :delayed_job`.

Rails 7.2 deprecates the keyword form of `enum`, so `Person`'s
`enum email_pref: %i[...]` became `enum :email_pref, %i[...]`. **Under
`deprecation = :raise` this does not present as a deprecation at all.** The exception
fires partway through the class body, Zeitwerk re-runs it, and all 400 tests error with:

```
ArgumentError: You tried to define an enum named "email_pref" on the model "Person",
but this will generate a instance method "immediate?", which is already defined by
another enum
```

`Person` has exactly one enum. This is the third time `deprecation = :raise` has turned a
one-line deprecation into a false trail (see §3b, §5c). **Expect it, and read the Gemfile
diff before believing the error.**

### 6b. Ruby 3.4 — no application changes, and three tooling casualties from one removal

The suite passed on 3.4.9 unmodified and the Gemfile resolved without conflict. Everything
that broke was tooling, and **all of it was the same removal: `File.exists?`**, the
long-deprecated alias of `File.exist?`, is gone in Ruby 3.4. Our own code calls it nowhere
— checked. Three gems still did, and not one of the three failures resembles its cause:

| Gem | Symptom | Fix |
|---|---|---|
| `debase` / `ruby-debug-ide` | would not install at all — `debase-ruby_core_source` fails | replaced with `debug` (ruby/debug) |
| `cypress-on-rails` 1.5.1 | every `app_command` 500s; **all 19 Cypress specs fail in their `before` hooks** with a `CypressError` about a non-2xx response, four layers from the cause | → `~> 1.20` |
| `foreman` 0.64.0 | `foreman s` dies before reading the `Procfile` | → `~> 0.90` |

**Both `foreman` and `cypress-on-rails` were unpinned in the Gemfile but held back in the
lockfile**, so `bundle install` never moved them — each needed an explicit
`bundle update`. Same trap as `nokogiri` in §5a. Assume a version-driven bug is still
present until the lockfile says otherwise.

`.vscode/launch.json` moved from `"type": "Ruby"` (ruby-debug-ide) to `"type": "rdbg"`,
and the stale `bin/rdebug-ide` binstub is gone. Four configurations were dropped while
rewriting it because they could never have run here: they point at `main.rb`, `bin/rspec`
(twice) and `bin/cucumber`, none of which exist and none of whose gems are in the Gemfile.

**The `cypress-on-rails` migration was far smaller than this plan feared.** 1.20 keeps
`cypress_folder` as a deprecated alias for `install_folder`, and its `CommandExecutor`
still supports the legacy `spec/cypress` layout. So the config change is one renamed
attribute, not a restructure. Two deprecations remain logged, and both are layout changes
belonging to 6d/6e:

- `cypress_helper.rb is deprecated, please rename the file to e2e_helper.rb`
- `/__cypress__/command is deprecated ... use /__e2e__/command instead`

`use_middleware = Rails.env.test?` was kept deliberately — it is stricter than the gem's
own suggested `!Rails.env.production?`, and that endpoint **executes arbitrary Ruby**.

### 6c. Rails 8.0 — the one hop where gems and defaults could not be split

Every earlier hop was verified twice: new gems with old defaults, then the new defaults.
That is impossible at 8.0. Rails 8.0 emits a `to_time_preserves_timezone` deprecation
unconditionally until the 8.0 default is set, and `test.rb` raises on deprecations, so
"8.0 gems with 7.2 defaults" cannot be green by construction. Adopting it is inert here
anyway: **zero `to_time` call sites** in `app/`, `lib/`, `test/` or `spec/`. The only other
8.0 default is `action_dispatch.strict_freshness`, which changes ETag/Last-Modified
precedence — immaterial to a JSON API with no HTTP caching configured.

**One real break, and it is minitest's, not Rails'.** `bundle update rails` pulled
**minitest 6.0.6**, and minitest 6 dropped `minitest/mock.rb` — its own `History.rdoc`
says "extracted to the minitest-mock gem". `test_helper.rb` requires it for `Object#stub`,
which the notification and report tests use to freeze Time/Date, so the entire suite
failed to load. Added `gem "minitest-mock"` rather than pinning minitest back: the
extraction is the intended path and minitest 6 is otherwise fine here.

Phase 5c's actioncable asset rename pays off: the Sprockets half of the production
precompile still emits an `actioncable-*.js`, so Rails 8 dropping the `action_cable.js`
alias is a non-event.

**`db/schema.rb` changed at both hops and needed checking, which the gate cannot do.**
7.2 was cosmetic (`ActiveRecord::Schema[7.1]` → `[7.2]`). **8.0 was not**: the dumper now
writes `enable_extension "pg_catalog.plpgsql"` instead of `"plpgsql"` — schema-qualified.
That is a real change to the file the README tells a new developer to run, and
`bin/rails test` maintains the test database via `db:migrate`, so **no test, no Cypress
spec and no precompile ever executes `schema.rb`**. Verified explicitly instead:
`db:schema:load RAILS_ENV=test` succeeds from scratch, the full suite passes against the
freshly loaded schema, and a subsequent `db:migrate` re-dump produces no diff, so the
round-trip is stable. Same failure class as the uglifier bug in §5c — broken, green and
latent — so **the round-trip is now a permanent line in the verification recipe.**

**One line of Phase 5c is now dead and has been deleted.**
`config.paths["config/secrets"] = []` existed because Rails 7.1 *deprecated*
`Rails.application.secrets`. Rails **7.2 removed it**, so the line does nothing on 8.0 —
`Rails.application.respond_to?(:secrets)` is `false`. Removed, along with the seven-line
comment justifying it. §8b item 5 and item 7 previously attributed the inertness of the
`config/secrets.yml` symlink to that line; both now attribute it to the API's removal,
which is a simpler and more durable reason.

### Generated files across 6a and 6c — what was kept and what was thrown away

`app:update` produced files at both 7.2 and 8.0. Kept: `bin/brakeman`, `bin/rubocop` (they
match gems already in the Gemfile) and `public/400.html` (the app already ships 404/422/500
and Rails 8 serves 400). Deleted every time: `public/icon.png`, `public/icon.svg`,
`public/406-unsupported-browser.html` — unreferenced default-app decoration, and the 406
page is only used by `allow_browser`, which this app never calls. Also deleted `bin/dev`,
which is just `exec ./bin/rails server`: a misleading second entry point beside the
documented `foreman s`, since it starts no webpack dev server.

### Gate at close of 6c (Ruby 3.4.9 / Rails 8.0.5.1 / Node 20.20.2 / Shakapacker 10.3.2)

Rails **400 tests / 1319 assertions, 0 failures, 0 errors, 1 skip** (the assertion count
rose from 1308 with minitest 6); Jest **125**; `tsc --noEmit` clean; `zeitwerk:check`
clean; Cypress **93/93** first try; brakeman **6** — the 5 application findings plus one
EOLRails warning, the EOLRuby one having cleared at 6b; production boot; full production
precompile with caches cleared; `foreman s` serving 200.

**Two machine facts that cost time in this phase, both unrelated to Dulu.** The other
project's puma is on port 3000 again, and because the `Procfile` hardcodes `-p 3000` the
conflict does not present as a bind error — `curl` reaches the *neighbouring app* and
returns its 302 and its session cookie, which looks alarming and is not Dulu at all.
`foreman s` was verified via a copied Procfile on port 3001
(`foreman start -f <copy> -d /work/work/dulu`; the `-d` matters, or `./bin/...` resolves
relative to the Procfile's directory). Separately, a leftover test-env puma on **3002**
made one Cypress run fail to boot its server; its process title is rewritten to
`puma ... [dulu]`, so `pkill -f "rails server"` does not match it.

### 6c2. Rails 8.1 — added because 8.0 was about to go EOL

brakeman on 8.0.5.1 reported *"Support for Rails 8.0.5.1 ends on 2026-10-07"*, roughly a
month out, so Brian asked for 8.1. Ordered **before** the Cypress work, on the same
argument used to defer it: the E2E suite is what tells you whether a Rails hop broke
something, so it should not be mid-migration during a version bump.

Resolution was clean — only Rails moved. One gem had to come with it:
**`omniauth-rails_csrf_protection` 1.0.2 includes `ActiveSupport::Configurable`**, which
8.1 deprecates and 8.2 removes, so on 1.x the suite fails to boot outright. 2.0.1 includes
it only conditionally on older Rails. That gem is Phase 4's CSRF seam, so the bump was
checked at the source, not just by a green suite.

All six 8.1 defaults were checked and none affects this app. The two JSON-escaping ones are
the only ones that looked risky, and they govern **Rails' JSON renderer** — the single
place this app puts JSON inside a `<script>` tag (`app/views/web/index.html.erb`) builds
it with plain `JSON.generate`, which those settings do not touch.

**`db/schema.rb` has a 296-line diff and it is nothing but reordering: Rails 8.1
alphabetises columns within each table.** Proved rather than assumed — extracted every
`t.*` / `create_table` / index / foreign-key line from both versions, sorted, and diffed:
identical as multisets, so no column was added, removed or altered. Then ran the
round-trip: `db:schema:load` from scratch, full suite green against the freshly loaded
schema, and a load → migrate → dump cycle reproduces the file byte for byte.

**brakeman is now 5** — exactly the five pre-existing application findings, with no EOL
noise for the first time in the upgrade.

`app:update` at 8.1 also generates `bin/ci` and `config/ci.rb`. Deleted: that pipeline
would fail out of the box here, running `bin/importmap audit` (no importmap — this app uses
Shakapacker) and `brakeman --exit-on-warn` against 5 known findings. There is no CI config
in this repo at all, so it is broken scaffolding rather than a starting point.

### 6d. cypress-on-rails' post-1.17 layout — two lines, not a restructure

This plan assumed the step meant relocating `spec/cypress` to `spec/e2e`. Reading the gem
shows otherwise: the endpoint is decided purely by request path, and app commands resolve
as `"#{install_folder}/app_commands/#{name}.rb"`, which `spec/cypress/app_commands` already
satisfies. So it is:

- `spec/cypress/cypress_helper.rb` → `spec/cypress/e2e_helper.rb`
- `support/on-rails.js` POSTs to `/__e2e__/command`, not `/__cypress__/command` (two
  places: the `appCommands` helper and the `fail` handler's raw ajax call)

Both deprecations were logged **once per app command**, so this is also a large reduction
in noise in any failing run's output. Keeping `spec/cypress` as the root leaves
`--project ./spec` working and avoids churning 19 files' history.

### 6e. Cypress 4.1 → 15.21.1 — eleven majors, and two behaviour changes that needed code

**15.21.1, not the current 16.0.0**: 16 requires Node `^22 || ^24 || >=26` and `.nvmrc`
pins 20.20.2. 15.x accepts `^20.1.0`, so no Node bump — which would be a Phase 2-shaped
change and does not belong here.

Split into two commits so the renames stay reviewable and `git log --follow` keeps working:
first `cypress/integration/` → `cypress/e2e/` (19 files) and `support/index.js` →
`support/e2e.js`, bridged by temporary `integrationFolder`/`supportFile` keys so the suite
stays green on Cypress 4; then the upgrade itself.

`spec/cypress.json` → `spec/cypress.config.js`. `specPattern` must be explicit because the
specs are `*.spec.js`, not Cypress 10+'s default `*.cy.js`. **The five raised timeouts and
their comment carried over verbatim** — that comment is the record of two separate flake
investigations. `cypress/plugins/index.js` was the generated stub with an empty function
body, so it is deleted rather than folded into `setupNodeEvents`.

Two Cypress behaviour changes needed actual fixes:

1. **`testIsolation` has been on by default since Cypress 12**, resetting the browser
   between tests. This suite is deliberately stateful. Set `testIsolation: false`, which is
   exactly the Cypress 4 behaviour. Making 19 specs isolation-clean changes what the tests
   do and is separate work.
2. **Cypress 12 re-runs the entire query chain on every retry.** That breaks
   `cy.contains("tr", X).within(...)` blocks whose own clicks change the row. The first
   diagnosis — a detached subject — was **wrong, and a screenshot disproved it**: the edit
   form was plainly on screen. The real cause is that the row's text `"Verb"` moves into an
   `<input value="Verb">`, and **`cy.contains` matches text, not input values**, so the
   re-query stops matching. Fixed in `linguisticActivities.spec.js` and
   `translationActivities.spec.js` by capturing the row with `.then($row)` and re-entering
   via `cy.wrap($row)`, which pins a concrete element. **Take the screenshot before
   theorising** — `spec/cypress/screenshots/` is written on every failure.

Also `allowCypressEnv: false` (Cypress 15 warns every run that it is insecure and going
away; nothing here calls `Cypress.env()`), and **`cypress` moved from `dependencies` to
`devDependencies`** — in `dependencies` the production server downloads the ~200 MB binary
on every `yarn install --production` during `assets:precompile`.

**On flakiness, honestly:** four full-gate runs during 6e — two clean at 93/93, two failing
`people.spec.js` "Creates person" on `cy.contains("William")`, an assertion that already
carries a 30s override and a comment from an earlier timing investigation. It passes 11/11
with that spec alone, the failures did not correlate with any config change (checked in
isolation), and load average was ~9. That is the documented one-spec-per-two-runs
behaviour. Re-run and check `/proc/loadavg` before calling it a regression.

1. **`cypress-on-rails` layout** — `spec/cypress/cypress_helper.rb` → `e2e_helper.rb`,
   `app_commands/` up to the install-folder root, and the endpoint `/__cypress__/command`
   → `/__e2e__/command` (the specs' `cy.request` calls and `support/on-rails.js` reference
   it). Read `spec/cypress/app_commands/mock_oauth.rb` first — it is the OmniAuth 2 test
   seam, and if it breaks, `log_in.spec.js` fails in a way that looks like a Phase 4
   regression.
2. **Cypress 4 → 15**, eleven majors, in three commits:
   - `spec/cypress.json` → `spec/cypress.config.js`. **Its five non-default timeouts must
     survive** — that file's long `_comment` is the record of two separate flake
     investigations, and losing it re-opens both.
   - `spec/cypress/integration/` → `spec/cypress/e2e/` (19 files) in its own commit so
     `git log --follow` stays useful. `support/index.js` → `support/e2e.js`, with
     `supportFile` pointed at it.
   - `spec/cypress/plugins/` is a Cypress ≤ 9 concept and disappears; fold it into
     `setupNodeEvents`. Both `package.json` scripts pass `--project ./spec`, whose
     semantics changed in Cypress 10+, and `--headless` is now the default (the flag was
     removed).
   - Grep all 19 specs for `cy.route` / `cy.server`, removed in Cypress 12 in favour of
     `cy.intercept`.
   - **Confirm Node first:** Cypress 15 requires Node ≥ 20.19; `.nvmrc` pins 20.20.2,
     which should satisfy it, but check rather than assume.

### 6f — drop Enzyme (done)

Forecast for Phase 2, actually done here, and it was as small as predicted:
`test/javascript/setupTests.js` contained nothing but `Enzyme.configure`, no test in the
repo calls `shallow`/`mount` or a `jest-enzyme` matcher, so the file, its
`setupFilesAfterEnv` hook, and `enzyme` / `enzyme-adapter-react-16` / `jest-enzyme` all
went together. `enzyme-adapter-react-16` has no React 18 successor, so this had to happen
before Phase 7 regardless; doing it while the suite is known-good keeps `yarn jest` from
breaking mid-migration for a reason unrelated to React. Jest unchanged at 125.

### 6g — three specs for the routing behaviours Phase 7 can break (done)

**Not a coverage-building exercise, and deliberately not one.** The question asked was
whether to write Cypress specs before the React work. The answer was mostly no: the 19
existing specs deep-link via `cy.visit` at ~30 distinct URL shapes, so URL-to-component
resolution — the thing React Router 6 most threatens — is already the suite's
best-covered behaviour. Writing more of the same buys surface to debug, not signal. Three
holes that resolution coverage cannot see were worth filling. Cypress 93 → **97**.

1. **`spec/cypress/e2e/navigation.spec.js` — history semantics.** `cy.go` and `cy.reload`
   appeared **nowhere** in the suite: every spec navigated forward only, so a `push` that
   should have been a `replace`, or a component that stops re-rendering when only the
   location changes, was invisible. One test per navigation mechanism the app actually
   uses: a `<Link>`, an `onClick` calling `history.push` directly (`RegionsTable`), and a
   nested `<Route>`'s own push (`LanguagePage`'s tabs, plus a reload to prove the URL and
   not component state selects the tab). Phase 7c converts 18 `withRouter` and 8
   `useHistory` sites to `useNavigate`; this is the class of failure that introduces.

2. **`spec/cypress/e2e/notifications.spec.js` — `/feed` and `/*activities/:id`.** Nothing
   visited either. **That wildcard route is load-bearing, and the reason is not obvious
   from the route table:** `Notification#linkify` (`app/models/notification.rb:263`)
   builds every activity link through `ApplicationHelper#model_path`, which yields the STI
   *subclass* path — `/translation_activities/:id`, `/linguistic_activities/:id`,
   `/media_activities/:id`. The leading `*` is what absorbs the varying prefix.
   `ActivityPage` then resolves the activity and `history.replace`s to the canonical
   `/languages/:lid/activities/:aid`. The spec pins both the redirect and the
   replace-not-push, which is what keeps the intermediate URL out of the back button.

   The fixtures ship no notifications and the feed is read-only, so the spec seeds one
   with `cy.appEval` — the mechanism `support/on-rails.js` already exposes.

**Both specs were negative-controlled, not trusted for passing.** Repointing the wildcard
route to a dead path fails `notifications.spec.js` on the un-redirected subclass URL;
turning `RegionsTable`'s `push` into a `replace` fails `navigation.spec.js`. A new spec
that has never been seen to fail is not yet evidence of anything.

**A dead end worth recording so nobody re-walks it.** The first attempt at the `<Link>`
test clicked the dashboard sidebar, on the assumption that `dashboard.spec.js`'s
`cy.contains("li", "Ewondo").click()` → `cy.contains("h2", "Ewondo")` was a navigation.
**It is not** — the sidebar only sets an in-page selection, and no URL changes. Related:
`Searcher` is *not* a route consumer either, on two counts — `Activity.search` is
commented out of `Api::SearchesController`, and `flattenResults`
(`Searcher.tsx:98`) discards the result of `flatResults.concat(...)`, so subresults never
render at all. Notification links are the wildcard route's only live caller.

Full suite green at **97/97** including `people.spec.js` — **one run; this is not a
status change.** See 6e's flakiness note above and re-read it before treating any Cypress
failure as a regression.

---

---

## Phase 7 — Frontend libraries: React 18, React Router 6, react-redux

**Phase 7 is complete (2026-09-08).** Landed in the order **7c → 7a → 7b → 7d**, not the
numbering below; the reasoning is under 7c. Twelve commits, each with its own gate. Final
state: `react-router-dom` 6.30.6, React 18.3.1 on `createRoot`, react-redux 9.3.0 with
redux 5.0.1, axios 1.20, immutability-helper 3.1.1, react-tabs 6.1.1, jest 30, and
eslint 9 with the repo's first lint config.

Gate at completion: Rails **401 tests / 1323 assertions, 0F 0E 0 skips**; Jest **125**;
`tsc --noEmit` clean; `zeitwerk:check` clean; Cypress **98 passing / 1 pending**;
clean-cache test build and production `assets:precompile` both green; `yarn install
--check-files` clean and, for the first time in this upgrade, free of peer warnings.

**Two of the four sub-phases changed application behaviour, both server-side or
model-side, and both are recorded in their as-landed notes:** axios 1's params
serialization broke `/api/reports/domain_report` (7d item 1), and immutability-helper 3's
types exposed three genuine modelling errors (7d item 2). Everything the phase found and
did *not* fix is in Phase 8.

Last, and correctly last: it is entirely independent of the Rails version once Phase 2
modernized the build chain. Nothing here blocks the backend, so if time runs short the
app is already on a supported Rails 8 / Ruby 3.4 footing.

The ordering within this phase is forced by the dependency graph:

### 7a. React 16.8 → 18

Small, because the codebase is already hooks-based: 0 legacy lifecycle methods, no string
refs, no `findDOMNode`, and `react-dom` imported in exactly one file. (An earlier draft
said "2 class components"; there are 15. It does not change the estimate — none of them
use anything React 18 removed — but the number was wrong.)

- One call site to change: `app/javascript/application/index.js:33` —
  `ReactDOM.render(<App store={store} />, appDiv)` becomes `createRoot(appDiv).render(...)`.
- Bump `@types/react` and `@types/react-dom` to 18.x.
- ~~**Enzyme costs you nothing.**~~ **Done in Phase 6f**, not Phase 2 — the forecast was
  right that it was configured without being used, and the removal was four lines plus
  three `devDependencies`. React 18 now arrives with no test-harness debt at all.
- Expect `StrictMode` double-invocation surprises in development if you opt into it. You
  may leave it off — and note `index.js` does **not** use it today, so this is an opt-in,
  not something inherited. Weigh it knowing that **Cypress runs against the test bundle**,
  so a non-idempotent mount effect surfaces there as duplicated rows or double-fired
  requests, which reads exactly like a router bug. Adopting `createRoot` is required;
  adopting `StrictMode` is a separate, deferrable choice.

**7a as landed (DONE).** `react`/`react-dom` `~16.8.0` → `18.3.1`, `@types/react` → 18,
one call site changed to `createRoot`, `StrictMode` left off.

Three things the forecast did not have:

- **`react-redux` had to move in the same commit.** 7.1.3 declares `react: ^16.8.3`, so
  landing React 18 alone would leave the tree peer-incompatible until 7b. 7.2.9 is the
  last 7.x, declares `^16.8.3 || ^17 || ^18`, and changes no API — a same-major bump, and
  it does not pre-empt 7b.
- **A duplicate copy of the React types, not the React 18 types, caused the 37 type
  errors.** `@types/react-redux`, `@types/react-tabs` and `@types/hoist-non-react-statics`
  all depend on `"@types/react": "*"`. With `@types/react` at 18 in the root, that `*`
  resolved to 19 in three nested copies, and every `connect()`-wrapped and `react-tabs`
  component failed `TS2786`: the `ReactElement` of one copy is not the `ReactNode` of the
  other. The error text points at `connect()` and reads like a react-redux
  incompatibility, which it is not. Fixed with a `resolutions` entry pinning the tree to
  one major (and `@types/react-redux` 7.1.5 → 7.1.34, which the `^7.1.5` range should have
  picked up but the lockfile had pinned). **The `resolutions` entry was removed again at
  the end of 7d**, once 7b and 7d had dropped all three of the packages that needed it.
- **One genuine type error.** `@types/react` 16's `ReactNode` included `{}`, so
  `PlainTable` interpolating a `string | { text, url }` cell type-checked — even though
  React 16 itself threw "Objects are not valid as a React child" on the object branch. The
  18 types dropped `{}` and it stopped compiling. Both rows go through one `Cell`
  component now. Note `PlainTable` is unreferenced dead code: nothing imports it and
  nothing constructs a `TableReport`. Deleting it is Phase 8f item 4, not a port.

`react-tabs` 2.3.0 stays, and yarn warns about its `react: ^16` peer on every install. It
renders correctly on 18 (`navigation.spec.js` walks LanguagePage's tabs) and uses only an
unprefixed `componentWillReceiveProps`, which warns rather than fails until React 19. The
bump to 6.x is still **7d** — and it now cannot be done any earlier, since react-tabs 6
requires React ≥18.

**What this phase found rather than caused:** nothing covered `MainRouter`'s error
boundary, and it is broken. See Phase 8d item 1 — the spec is written and skipped, and the
bug reproduces identically on React 16.

### 7b. react-redux 7 → 9

Gated behind 7a (react-redux 8+ requires React 18). The TypeScript types shifted, so
expect type churn across the 14 files using `connect()`/`createStore`.

`app/javascript/application/index.js` and `app/javascript/reducers/appReducer.ts` use
plain `createStore` + `combineReducers`. `createStore` is soft-deprecated in favor of
Redux Toolkit's `configureStore`. Treat RTK adoption as **optional follow-up work**, not
part of this upgrade — the plain API still functions.

**7b as landed (DONE).** `react-redux` 7.2.9 → 9.3.0 and `redux` 4 → 5.0.1 in one commit
— react-redux 9 requires `redux ^5.0.0`, so they are not separable. `@types/react-redux`
is dropped rather than bumped: react-redux ships its own types from 8 on.

The forecast said to "expect type churn across the 14 files using `connect()`". There was
none. `connect()`, `useSelector`, `TypedUseSelectorHook` and `shallowEqual` all behave as
before, and `tsc` reported exactly two errors, both the same one:

**redux 5's `dispatch` takes `UnknownAction`, which carries an index signature, and
TypeScript gives an object *type alias* an implicit index signature but never gives one to
an *interface*.** `LoadAction` was the codebase's only action declared as an interface —
which is precisely why the other action types dispatched fine. Converted to a type alias;
the shape is unchanged. Worth remembering as a rule: after redux 5, an action type must be
a `type`, not an `interface`.

`createStore` is soft-deprecated in redux 5 but still exported and still works, so
`index.js` is untouched. Redux Toolkit remains optional follow-up (Phase 8g item 10).

### 7c. React Router 5.1 → 6 — the largest single frontend item

Sized concretely:

| Symbol | Occurrences |
|---|---|
| `<Link` | 81 |
| `<Route` | 33 |
| `withRouter` | ~~18~~ **9** — see below |
| `useHistory` | 8 |
| `<Switch` | 6 |
| `<Redirect` | 1 |
| **files importing `react-router`** | ~~**64**~~ — **44 of them import only `Link`** |

This is an API rewrite, not a version bump: `Switch`→`Routes`, `component=`→`element=`,
`useHistory`→`useNavigate`, `Redirect`→`Navigate`, changed nested-route and relative-path
semantics, and **`withRouter` is removed entirely**.

**Both `withRouter` claims above were wrong, and the correction shrinks this phase.**
The 18 was import lines plus usage lines double-counted: there are **9** call sites, in 9
files. And "any class component using it must be converted" applies to **one** —
`SaveReportBar`, a `React.PureComponent`; the other eight are function components that
needed nothing but the hook. `BaseMainRouter` is also a class, but it never used
`withRouter` — it already takes `history` from a `useHistory` wrapper, which is the
pattern `SaveReportBar` now copies.

**Done in 7c (1/n)**, on react-router 5: v5.1 already ships the hooks, so this landed with
the suite green and without depending on v6. Each `IProps` also stopped extending
`RouteComponentProps` — leaving it would keep a live second path for a parent to pass
`history`/`match`/`location` with `tsc` staying quiet about it. No parent does today; all
nine were checked.

~~**That 64-file, 18-`withRouter` number — not the React version — is what determines this
phase's length.**~~ **Wrong for the third time, and in the same direction.** `Link` is
unchanged in v6, and **44 of the 64 files import nothing else** — they need no work at
all. Counting what actually changes:

| | | status |
|---|---|---|
| `withRouter` call sites | 9 | **done, 7c (1/n)** |
| components declaring a `history` prop | 25 | **done, 7c (2/n)** |
| `history={...}` pass-downs | 30 | **done, 7c (2/n)** |
| `<Switch>` / `<Route>` files | 7 | **done, 7c (3/n)** |
| `push` / `replace` / `goBack` call sites | 26 | **done, 7c (3/n)** |
| files importing only `Link` | 44 | no work — confirmed, `Link` is unchanged |

**7c is complete. `react-router-dom` 6.30.6, Cypress 98/98, jest 125, `tsc` clean,
production precompile clean.** What the port actually involved, beyond the mechanical
renames:

- **Brian chose the idiomatic shape over a minimal port** (2026-09-07): `MainRouter`
  declares the whole route tree, boards render `<Outlet />` and read `useParams()`,
  and `matchParamsForChild` / `routeActionAndId` are deleted. The enabling fact,
  verified with a real render before committing to it: **a v6 layout route's own element
  sees its child's params**, so a board can highlight the selected row without being
  handed an id.
- **Each board's detail pane is keyed.** `key={props.id}` used to sit on the page
  components; without an equivalent, React reuses the instance across ids and the
  mount-time fetch never re-runs. `LanguagesBoard` keys on the whole pathname because its
  old key did.
- **`LanguagePageRouter` and `ClusterPageRouter` became layout routes** that load their
  record and pass it through `<Outlet context>`; children read a typed
  `useLanguageContext()` / `useClusterContext()`.
- **`Dashboard` was rendering `LanguagePageRouter` outside any route** with `basePath=""`,
  which made every one of that router's paths unmatchable — so the fallback was all it
  could ever show. That cannot work against a layout route; it now renders `LanguagePage`
  via a small `DashboardLanguagePage`. This is also the reason `dashboard.spec.js` clicks
  through the sidebar with no URL ever changing.
- **Both location-state sites changed shape, not just name.** `SavedReportViewer`'s
  `history.push(to, state)` became `navigate(to, { state })`, and `DateCell`'s `<Link>`
  carried state *inside* `to`, which v6 types as pathname/search/hash only — it is a
  separate `state` prop now. (The earlier claim that SavedReportViewer was the app's only
  location-state user was wrong; `tsc` found the second one.)
- **A real bug fell out.** `NewOrganizationForm` navigates to `/organizations/:id`, but
  every link uses `/organizations/show/:id`. Under v5 that worked *only* because
  `routeActionAndId()` quietly rewrote a numeric first segment into action `"show"`. The
  v6 tree dropped the rewrite and `organizations.spec.js` failed within one run. Both
  spellings are routed now; changing the form instead would be a behaviour change rather
  than a port.
- `@types/react-router-dom` is gone (v6 ships its own), and the `history` package is no
  longer even a transitive dependency — so the four wrapper-injected props are typed
  `NavigateFunction`, and `MainRouter`'s crash report posts the **location** instead of
  the history object, which is what it actually wanted.

Consider `react-router` 6.4+ data APIs out of scope; port to the v6
component API and stop. **`react-router-dom` 7 is out of scope for this phase on a hard
constraint, not a preference:** every 7.x declares `peerDependencies: { react: ">=18" }`,
so it cannot land before 7a. If it is wanted at all, it is a separate hop after React 18.

**Do 7c first, on React 16.** React Router 6 supports React 16.8+ — confirmed from the
package rather than the docs: `react-router-dom@6.30.6` declares
`peerDependencies: { react: ">=16.8", "react-dom": ">=16.8" }` — while react-redux 8+
requires React 18 — so the router rewrite, which is the large one, can land against a
suite that is currently green rather than against a freshly-changed React. Doing 7a, 7b
and 7c together means every failure has three candidate causes. Order: **7c → 7a → 7b**,
not the numbering above.

**Two route patterns need a decision before any of it is written** (both surveyed in
Phase 6g):

- **`MainRouter.tsx:123` — `path="/*activities/:id"` cannot be expressed in v6**, where a
  splat must be trailing. Confirmed the same way: on 6.30.6,
  `matchPath("/*activities/:id", "/translation_activities/1071624995")` returns **`null`**
  — again silent, again falling through to the `Dashboard` catch-all. (`matchPath` is what
  was tested; whether `<Routes>` additionally warns at render time was not.) It is not dead code: it is the landing point for every activity
  link in a notification, which `ApplicationHelper#model_path` renders as the STI subclass
  path (`/translation_activities/:id`, `/linguistic_activities/:id`,
  `/media_activities/:id`). Enumerate the subclasses and give each an explicit route, or
  route on a single `/activities/:id` and change `model_path`'s callers — but the
  redirect-to-canonical-URL behaviour must survive either way.
  **`spec/cypress/e2e/notifications.spec.js` is the acceptance test**, and it fails on the
  un-redirected URL if the route stops matching.
- **Three routes rely on optional params** — `/languages/:idOrAction?`,
  `/people/:actionOrId?/:id?`, `/organizations/:actionOrId?/:id?`. Optional segments were
  dropped in early v6 and reintroduced in 6.5. **Settled: target `react-router-dom`
  `^6.30.6`** (latest 6.x), and this stops being a migration concern at all — no
  split-then-unsplit, and no reason to pin at 6.5 itself, since every 6.x from 6.5 onward
  has them.

  Verified rather than assumed, by installing the package and calling `matchPath`
  directly:

  | pattern | url | 6.30.6 | 6.4.5 |
  |---|---|---|---|
  | `/languages/:idOrAction?` | `/languages` | `{}` | — |
  | `/languages/:idOrAction?` | `/languages/876048951` | `{idOrAction: "876048951"}` | **`null`** |
  | `/people/:actionOrId?/:id?` | `/people/edit/732959017` | `{actionOrId: "edit", id: "732959017"}` | — |
  | `/organizations/:actionOrId?/:id?` | `/organizations/show/258650127` | `{actionOrId: "show", id: "258650127"}` | — |

  Same param names, same shape as v5. **Note the 6.4.5 column: a version without optional
  segment support returns `null`, it does not throw** — so on a too-old version these
  routes would silently stop matching and fall through to `MainRouter`'s unpathed
  `<Route render={() => <Dashboard />} />`. A wrong version number presents as "clicking a
  language shows the dashboard", not as an error.

`MainRouter`'s routes all use `render={({ match, history, location }) => ...}` and hand
`history` down as a prop — `BaseMainRouter` itself is a class component that takes
`history` from a `useHistory` wrapper. v6 has no `render` prop and no `match`/`history`
objects, so these are not mechanical `component=` → `element=` swaps; each becomes a
child component calling `useParams`/`useNavigate` for itself.

**Two things 7a left on 7d's doorstep.**

- **`react-tabs` 2.3.0 → 6.x is now unavoidable here, and it could not have happened
  earlier.** react-tabs 6 declares `react: ^18 || ^19`, so it had to follow 7a; 2.3.0
  declares `^16` only, so yarn warns about it on every install until this lands. It does
  render correctly on 18 — its one legacy call is an unprefixed
  `componentWillReceiveProps`, which warns rather than fails until React 19. react-tabs 6
  ships its own types, so `@types/react-tabs` goes away with it.
- **Revisit the `resolutions` entry in `package.json` when it does.** ~~7a added it to pin
  `@types/react`/`@types/react-dom` to one major.~~ **Done: dropping `@types/react-tabs`
  removed the last of the three `"@types/react": "*"` dependents, so the pin became inert
  and was deleted — see Phase 8g item 3 for the verification and for the symptom to watch
  for.**

### 7d. Remaining dependency cleanup

`axios` 0.21 → 1.x, `immutability-helper` (pinned at exactly `2.7.1`) → 3.x,
`react-tabs` 2.2 → current, `eslint` 4 → 9 (flat config), and drop
`babel-preset-react` / `ts-loader` / `webpack-dev-server` 2.11 pins left over from the
old build.

**A build hazard found while doing 7c (1/n), which affects every phase's gate:**
`yarn testPacks` — and therefore `yarn test:cypress:gate`, which runs it — **exits 0 with
"Everything's up-to-date. Nothing to do" on the run immediately after a compile that
failed.** Shakapacker records the digest regardless of whether webpack succeeded, so the
second attempt is a cache hit. Cypress then runs against the last *good* bundle and the
suite is green while the code does not compile. Reproduced deliberately: fail a compile,
re-run, exit 0, and again on a third run. **Read the first `testPacks` output, not the
exit code of a re-run**, and `rm -rf tmp/shakapacker` when a build's result is in doubt.
This is the same digest-cache trap the verification recipe already warns about for
`assets:precompile`, in a worse form — there it silently skipped work, here it silently
launders a failure into a pass.

**7d as landed (DONE), in six commits.** The forecast listed five bumps; what it did not
anticipate is that two of them changed behaviour rather than just versions.

1. **`axios` 0.21 → 1.20 — and it changed a wire format.** axios 0.x serialised a nested
   params object by JSON.stringify-ing it, and `DomainReport.from_web_params` depended on
   that: it called `JSON.parse(params[:period])`. axios 1 serialises nested params the way
   Rails expects (`period[start][year]=2017`), so the parse received a Parameters object,
   raised, and `/api/reports/domain_report` **500'd** — the domain report rendered empty
   with "Dulu server error". Fixed on the server rather than by re-creating axios 0.x's
   quirk with a `paramsSerializer` shim: the bracket form is what `from_database` already
   reads out of the JSONB column, so both entry points now take the same shape, with the
   four scalars permitted explicitly. **This was the only place relying on it** — also the
   app's only `JSON.parse` of a query param; every other GET sends flat scalars, which
   serialise identically in both versions. `test/controllers/reports_controller_test.rb`
   was a `skip 'Implement'` placeholder, which is why a 500 here had nothing to fail; it
   now pins the wire format and the missing-period case.
2. **`immutability-helper` 2.7.1 → 3.1.1 — the runtime is unchanged, the types are new.**
   2.x's types were `any`; 3.x ships real ones, and `tsc` produced 12 errors in 8 files.
   Three were the types telling the truth: `Event.prepareEventParams` was `$merge`-ing
   Rails nested-attribute names (`cluster_ids`, `event_participants_attributes`) into a
   typed model when it is really building a request body — now a spread;
   `IEventParticipant.id` is optional, because a participant added in the form has no id
   until Rails assigns one, and the form has always pushed an id-less object; and three
   `SearchPicker`s ignored that `setSelected` is `(T | null)`. The rest are casts with a
   stated reason. One of them is worth knowing generally: **`Spec<T>` is a conditional
   type, so on an unresolved type parameter it collapses to `$set`/`$apply` and object
   commands like `$merge` stop type-checking** — a limitation of the library's types, not
   of the call, and it needs `as Spec<T>` in three places.
3. **`react-tabs` 2.3.0 → 6.1.1.** This is what 7a's peer warning was waiting on: v6
   declares `react ^18 || ^19`, so it could not precede 7a. The API needed nothing — all
   three call sites already use the controlled `selectedIndex`/`onSelect` pair. `Icon.tsx`
   stopped importing `Omit` from react-tabs (it shipped its own before TypeScript 3.5 had
   one). `@types/react-tabs` is gone, which removes one of the three
   `"@types/react": "*"` dependents, and the sprockets stylesheet still resolves —
   `app/assets/stylesheets/react_tabs.scss` imports a file v6 still ships.
4. **`jest` 26 → 30, `ts-jest` 29, `mockdate` 3.** jest 30 rather than the 29 the forecast
   named: ts-jest 29.4 supports `^29 || ^30` and nothing here touches what 30 removed. One
   config change — ts-jest 29 reads options from the `transform` entry, not `globals`, and
   the option is `tsconfig`, not `tsConfig`. The transform key deliberately matches the
   `js-with-babel` preset's own ts key so it *overrides* that entry rather than adding a
   second one; jest merges a preset's transform map with the config's, so `.js` keeps
   going through babel-jest.
5. **`concurrently` 5 → 9, `nodemon` 2 → 3.** Both are used by the test scripts, not
   leftovers. concurrently 9 takes the same flags the cypress scripts pass, verified by
   running the full suite through it.
6. **eslint: there was nothing to migrate.** The forecast said "eslint 4 → 9 (flat
   config)", assuming a config existed. **There was none** — no `.eslintrc` anywhere, no
   lint script, no CI, so eslint had never run on this repo. Brian's call (2026-09-08):
   set it up now, report, and change no application code. eslint 9.39 + typescript-eslint
   8.70 + react/react-hooks/jest plugins, `eslint.config.mjs`, a `yarn lint` script, and
   **144 findings** — recorded as Phase 8c. eslint 10 is out but `eslint-plugin-react`
   peers at `^9.7`, so 9 is today's ceiling. `yarn install` is now free of peer warnings
   for the first time in this upgrade.

**The pins the forecast wanted dropped were already gone:** `babel-preset-react` is not a
dependency, `ts-loader` is at 9.x and `webpack-dev-server` at 5.x — Phase 2 replaced those
when it replaced the build. What remains outdated is deliberate, and is inventoried in
Phase 8g rather than left implicit.

**Gate:** full recipe green + manual click-through of the main boards
(dashboard, people, organizations, events, activities) — routing regressions are exactly
the class of bug that passes unit tests and breaks the app.

---

## Phase 8 — Post-upgrade pass (no version changes)

**Brian's decision, 2026-09-03:** the security findings brakeman surfaced are fixed
*after* the upgrade, not during it. Rationale, and worth keeping: a security fix inside an
upgrade commit is a change to application behaviour hidden inside a change to
dependencies. If the gate goes red you cannot tell which half did it, and if a fix is
wrong it is buried in a diff nobody reviews line by line. Keeping them separate also means
this phase can be reviewed by someone who does not care about Rails versions at all.

The same reasoning collected everything else the upgrade *found* but deliberately did not
fix, and by the end of Phase 7 that was too much for one list. Split into sub-phases,
each independently reviewable and independently deployable:

| | Sub-phase | Items | Why it is separate |
|---|---|---|---|
| **8a** | Security | 6 | brakeman findings plus the `hd` question. Reviewable by someone who does not care about Rails versions. |
| **8b** | Deploy mechanics | 7 | **Not sequenced after Phase 7** — needed at the *first* deploy of this branch, whenever that is. |
| **8c** | Lint findings | 144 findings, 7 tasks | The first eslint run this repo has ever had (Phase 7d). Mostly mechanical; a handful are real. |
| **8d** | Correctness defects | 7 | Real bugs found during the upgrade and left alone on purpose. Each needs a test first. |
| **8e** | Test-suite debt | 9 | Flakes, a skipped spec that documents a live bug, tests that assert nothing, no CI. |
| **8f** | Dead code and modelling | 4 | Debt the port created or exposed. Nothing here is broken today. |
| **8g** | Deferred majors and forward-compat | 10 | Everything Phase 7 chose not to bump, with the reason. Includes one warning that becomes an error on a future dependency. |

**Nothing in 8c–8g is a regression from this upgrade unless it says so.** Where a defect
was verified to predate the upgrade, the verification is recorded with it — that
distinction is the difference between "we broke this" and "we finally looked."

**Note:** each item below is a genuine behaviour change with no test covering it today.
Write the test first in each case — that is the actual work here, not the one-line fix.

### 8a. Security

1. **`app/controllers/api/permissions_controller.rb:3` — `params[:type].constantize`.
   The fix is to delete the endpoint, not to allowlist it: it is dead code.**
   Brakeman classifies it high-confidence remote code execution. What can be
   demonstrated from reading it is narrower — `constantize` resolves (and under Zeitwerk
   autoloads) any constant the caller names, then `type.find(params[:id])` is called on
   it and the result handed to `can?`, which makes it a model/row-existence and
   permission oracle across every table plus a reliable 500 generator on any string that
   is not an AR model. Deletion makes the distinction moot, which is the argument for
   deleting rather than debating the label.

   It has no consumers. `git grep -l "permissions/check" HEAD` returns
   `config/routes.rb` and nothing else, and `doWhat` — a parameter any caller would have
   to send — appears nowhere in the tree but the controller itself. It was added
   2018-12-07 in `01e5014` alongside the Events Calendar work; its only caller lived in
   `app/javascript/components/events/NewEventForm.jsx`, which went away with the
   events-new flow (`MainRouter` still routes `/events/new` to
   `<span>To be added...</span>`). Meanwhile the pattern the rest of the app actually
   uses is `can?` evaluated server-side into the jbuilder payload — `json.update can?(:update, person)`
   and friends, ~20 call sites across `app/views/api/**`. There is nothing to migrate to
   an allowlist.

   Delete: `app/controllers/api/permissions_controller.rb` and `config/routes.rb:62`.
   There is no `app/views/api/permissions/` and there was no controller test, so nothing
   is lost from the gate; the regression test described below adds one
   (401 → 402 tests). If the events-new flow is ever rebuilt, it should get a
   `json.permissions` block like every other resource rather than a generic query
   endpoint.

   **The regression test cannot assert a 404, and it does not belong in
   `test/controllers/`.** `config/routes.rb:88` ends with `get '*route', to: 'web#index'`,
   so a deleted API path is *not* unroutable — it falls through to the SPA shell and
   returns 200 HTML. `assert_raises(ActionController::RoutingError)` and
   `recognize_path` both see a live route. Assert the two things that are actually true
   instead: the constant is gone, and the path now resolves to `web#index`. That is a
   routing fact rather than a controller behaviour, and a file named
   `permissions_controller_test.rb` reads as evidence the controller still exists, so it
   lives in `test/integration/removed_routes_test.rb` — written, passing (1 test,
   2 assertions).

   Worth recording separately: because of that catch-all, **an XHR to any dead or
   misspelled `/api/*` path gets a 200 of HTML**, which is exactly the case
   `require_login`'s comment calls out as indistinguishable from real data to
   `DuluAxios`. Deleting this endpoint is safe only because nothing calls it; a *renamed*
   endpoint would fail silently rather than loudly. Candidate for a constraint on the
   catch-all (scope it to exclude `/api`) — filed here rather than acted on.

2. **`app/controllers/api/people_controller.rb:46` — `params.permit!`.** Brakeman calls
   this mass assignment, but the earlier wording here ("permits every attribute a future
   migration adds") was wrong and worth correcting: line 46 is in `update_view_prefs`,
   which assigns no model attributes at all. It does
   `current_user.view_prefs.merge!(params[:view_prefs])`, and `view_prefs` is a `json`
   column defaulting to `{}` (`db/schema.rb:367`). `create`/`update` already go through a
   proper allowlist in `person_params`. So the real exposure is an **unbounded write of
   arbitrary JSON into the current user's own prefs blob** — verified: a key named `evil`
   posted alongside the real prefs is merged in and persisted.

   **Do not derive the allowlist from `ViewPrefs` in the reducer.** The struct is small —
   4 top-level keys (`app/javascript/reducers/useViewPrefs.ts:8`) — but transcribing its
   *value shapes* into strong params makes the TypeScript interface and the controller two
   sources of truth for the same contract, and the drift is silent in the worst direction:
   add a pref in TS, forget Rails, strong params drops it, and `update_view_prefs` returns
   `response_ok` (204) regardless, so nothing surfaces. The pref just never persists. The
   existing test (`test/controllers/people_controller_test.rb:168`) only exercises
   `dashboardTab`, a scalar, so it would keep passing while the two hash-valued prefs
   broke.

   Two things were checked against a real `ActionController::Parameters` rather than
   assumed. Allowlisting only the top-level names **does not work** —
   `permit(:dashboardSelection, :dashboardTab, :notificationsTab, :domainReportParams)`
   returns `{"dashboardTab", "notificationsTab"}` and silently drops both hash-valued
   prefs, because a bare key permits scalars only. The full nested form does work:

   ```ruby
   params.require(:view_prefs).permit(
     :dashboardTab, :notificationsTab,
     dashboardSelection: %i[type id],
     domainReportParams: [:domain,
       { period: { start: %i[year month], end: %i[year month] } },
       { languageIds: [] }, { clusterIds: [] }]
   )
   ```

   — at the cost of restating `DRDataParams` and the `Selection` union in Ruby.

   **Preferred fix: treat it as the opaque bag it is, and bound it rather than typing it.**
   `params.require(:view_prefs).to_unsafe_h.slice(*VIEW_PREF_KEYS)` returns the full
   nested structure and drops unknown keys (verified), is scoped to the `view_prefs`
   subtree so it can never reach an attribute assignment the way a global `permit!` could,
   and needs only the four key *names* — which is a list that changes rarely and whose
   drift is a deliberate two-file edit.

   `to_unsafe_h` returns an `ActiveSupport::HashWithIndifferentAccess`, so
   `VIEW_PREF_KEYS` may be `%w[]` or `%i[]` interchangeably — verified identical — and the
   sliced result always has **String** keys either way. Use `%w[]` so the code reads the
   same way the data does: the `json` column round-trips string keys, which is what
   `people_controller_test.rb:171` already asserts on (`view_prefs['dashboardTab']`).
   Absent keys are simply absent from the result rather than merged in as nils, which is
   what the merge semantics need. One pre-existing wrinkle to leave alone but know about:
   the merge target is a plain Hash from the column, so `view_prefs[:some_key]` (symbol)
   is `nil` in Ruby — only string lookup works.

   **But key-slicing bounds the key names only, and that is not the main problem — the
   storage is.** Values under those four keys stay arbitrary: `dashboardTab` can hold a
   nested structure of any shape and any size. That matters on its own, independent of
   whether today's readers happen to handle it:

   - **`Person` is `audited`** (`app/models/person.rb:31`, bare, so every column) and
     `view_prefs` is in scope — confirmed via `Person.non_audited_columns`, which lists
     only the timestamps, `id`, `type` and `lock_version`. So each `setViewPrefs` call
     writes an `audits` row carrying the full before/after `view_prefs` in
     `audited_changes`. That table is **append-only**: an attacker does not overwrite one
     row, they add one per request, each holding arbitrary JSON of unbounded size. Write
     amplification plus a polluted audit trail.
   - **The blob is embedded in every page load.** `WebController#make_user_data` puts it
     in the initial HTML, not a lazy fetch, so a bloated `view_prefs` permanently degrades
     that user's every page load — and there is no UI anywhere to reset it.
   - **Durability outlives the code.** Output escaping is a property every future read
     site has to re-earn; validation is a property of one write site. A payload sitting in
     the column is waiting for the first consumer that does not escape — a CSV export, a
     mailer, an admin view, a `dangerouslySetInnerHTML`.

   So the size cap is not hygiene, it is the control: reject a `view_prefs` payload over a
   few KB outright rather than storing and then coping with it. Fix the write and the read
   both — they protect against different things, and only fixing the read leaves an
   attacker-controlled write primitive into another user's row (see item 8).

   **There may already be junk in the column.** Check the restored production dump before
   assuming this is theoretical:
   `SELECT id, length(view_prefs::text) FROM people ORDER BY 2 DESC LIMIT 10;` and
   `SELECT DISTINCT jsonb_object_keys(view_prefs::jsonb) FROM people;` — anything outside
   the four known keys, or any row much larger than a few hundred bytes, is a cleanup task
   rather than a code fix. Note the column is `t.json`, not `jsonb` (`db/schema.rb:367`),
   so it is stored as text with no validation at the database level either.

3. **Three SQL injection findings** — `app/models/event.rb:120`,
   `app/models/concerns/multi_word_search.rb:13`, and `app/models/domain_report.rb:74-75`
   (interpolated `@period.finish` and `start_period_str`). Convert to bound parameters.

   The `domain_report.rb` pair was traced and is **not exploitable as it stands**, which
   does not make it not worth fixing. `DomainReport.from_web_params` permits
   `start: %i[year month], end: %i[year month]`, and `YearMonth#initialize`
   (`app/lib/year_month.rb`) does `year.to_i` / `month.to_i`, so `@period.finish.to_s` is
   always `\d+-\d+` and attacker text cannot reach the query. The guard is incidental —
   two classes away from the interpolation and not written as a guard — so it survives
   only until someone changes `YearMonth`. Bind the query. Note the same values reach
   `DomainReport.from_database`, which reads `report.report[:dataParams]` out of the
   `reports` JSONB with no permit at all (`Api::ReportsController#report_params` is
   `params.require(:report).permit(:name, report: {})` — `report: {}` permits an arbitrary
   nested hash); the same `to_i` coercion is all that stands there too.

4. **Regenerate `config/brakeman.ignore` — after items 1, 2, 3, 7, 8 and 9, not before.**
   Regenerating first would bake in findings that are about to be deleted or fixed.
   Its 5 entries no longer match anything —
   they reference `app/views/dashboard/dashboard.html.erb`,
   `app/views/languages/show.html.erb` and `app/views/clusters/index.html.erb`, all ERB
   views deleted during the React migration. A stale ignore file is worse than none: it
   reads as "reviewed and accepted" for findings that no longer exist.

   **Landed 2026-09-15: deleted, not regenerated.** With every finding fixed the scan is
   clean, so a regenerated file would have been an empty one — and an empty ignore file
   still invites the next person to add to it. `config/brakeman.ignore` is gone; if a
   finding ever needs accepting, the argument for accepting it belongs in a commit
   message, not a fingerprint list.

   One finding survived items 1–3 and 7 and was fixed here: `event.rb`'s `for_period`
   composed its two filters by interpolating the fragments into `"#{a} AND #{b}"`. Both
   came from private helpers and were literals, so it was safe — but only to a reader who
   went and checked, which brakeman could not. It now chains `where(*a).where(*b)`, which
   ActiveRecord ANDs into the same SQL with no fragment built by interpolation. Verified
   identical output across all four argument shapes.

5. **`hd: 'sil.org'` does not restrict who can log in, and someone probably thinks it
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

   **Decided 2026-09-15: written down as false, no code change.** Not every account that
   legitimately accesses Dulu is an `@sil.org` account, so verifying the returned `hd`
   claim would lock out real users. Authorization rests on the `Person` row with
   `has_login`, as it already did; `hd` stays a convenience hint to Google's account
   chooser and nothing should be built on it meaning more than that. This item is closed
   — do not re-file it as an unfixed finding.

6. **Re-run `bundle exec brakeman` expecting zero warnings**, and consider adding it to
   the gate as a hard failure rather than a compare-against-known-list.

   **Landed 2026-09-15: zero warnings, and it is now a gate.** brakeman 7.1.1 against
   Rails 8.1.3.1 reports 0 security warnings, 0 errors over 29 controllers, 40 models and
   16 templates. `yarn security` runs `brakeman -q -z --no-pager` and `test:most` /
   `test:all` now run it first. The `-z` matters: brakeman exits 0 even when it finds
   warnings unless told otherwise, so without it the gate would have passed silently
   forever.

7. **`Note#for_type.constantize` is the same bug class as item 1, except this one is
   live — and brakeman cannot see it.** `app/models/note.rb:14` is
   `for_type.constantize.find(for_id)`, and `for_type` is user-supplied:
   `Api::NotesController#create` does
   `params.permit(:for_type, :for_id, :text).merge(person: current_user)` and passes it
   straight to `Note.create` with **no `authorize!` call at all**, so any logged-in user
   can store an arbitrary class name against an arbitrary id. Brakeman almost certainly
   never flagged it because the value is laundered through a model attribute rather than
   appearing as `params[...].constantize` at the call site — which is what makes it the
   more dangerous of the two: notes are UI-reachable, unlike item 1's endpoint.

   It is latent rather than exploited today, and worth understanding why: the *instance*
   method `Note#for` has no callers anywhere in `app/`. The only thing that reads notes
   is the *class* method `Note.for(model)` (`app/views/api/languages/show.json.jbuilder:3`),
   which builds a `WHERE for_type = ? AND for_id = ?` and never constantizes. So the
   poisoned rows sit there until someone writes the first caller of `Note#for` — at which
   point it dereferences on their behalf. Fix both halves: allowlist `for_type` against
   an explicit map of permitted classes on create (this is where item 1's original
   allowlist prescription belongs), and add the missing `authorize!` so a note cannot be
   attached to an object the author cannot see.

   **Landed 2026-09-15, allowlist only.** `Note::FOR_TYPES` is `%w[Language Cluster Person]`
   — the union `app/javascript/models/Note.ts:12` declares — enforced on the write as a
   validation and again on the read in `#for`. Twice on purpose: the validation governs
   only rows written after it, and prod rows and console writes go around it. `for_id` must
   now name an existing record, and `create` returns 422 instead of `render :show` with a
   nil id. Production holds only `Language` (checked 2026-09-15), so no historical row
   raises.

   **The `authorize!` half was deliberately not done.** Once `for_type` is bounded there is
   no object to protect: `AccessPolicy` has no `:read` rule for `Language` at all, every
   logged-in user can already read every language, and `languages/show.json.jbuilder`
   renders its notes to all of them. A bare `authorize! :create, Note` would deny everyone,
   since no `:create` rule exists. Authorship cannot be forged (`person: current_user`) and
   edit/destroy are already author-only. Whether any logged-in user should be able to note
   any language is a product question, not a security finding.

   Two facts to pin down before writing the allowlist. The UI sends only
   `for_type: "Language"` (`app/javascript/components/languages/LanguagePage.tsx:58` is
   the sole `noteFor` producer), while `app/javascript/models/Note.ts:12` declares
   `"Language" | "Cluster" | "Person"` — so the type declaration is already wider than
   the app. And the production data may be wider than either: run
   `SELECT DISTINCT for_type FROM notes;` against the restored dump before narrowing the
   allowlist, or `#for` starts raising on historical rows. Note that `GO_LIVE_QA_PLAN.md`
   currently claims notes attach to Events as well as Languages; that is wrong on this
   reading and should be corrected to Language-only when this item is worked.

8. **`skip_before_action :verify_authenticity_token, only: [:update_view_prefs]`
   (`app/controllers/api/people_controller.rb:4`) — CSRF is off on the endpoint from
   item 2, and this is the more serious half.** Not previously filed. Combined with
   `permit!` it means an off-site page can write arbitrary JSON into a logged-in user's
   `view_prefs` with no token. The skip also looks vestigial: `DuluAxios.put` sets
   `data.authenticity_token = getAuthToken()` on every request, exactly as it does for
   every other PUT in the app, so there is no obvious reason this one endpoint needs the
   exemption. Try deleting the `skip_before_action` and see whether anything breaks —
   find out why it was added before assuming it was unnecessary, but the default should be
   removing it.

9. **`WebController#make_user_data` uses `JSON.generate(...).html_safe` inside a
   `<script>` tag — stored XSS for anything in `view_prefs`.** `app/views/web/index.html.erb`
   interpolates it into `<script type="application/json" id="userData">`, and stdlib
   `JSON.generate` does not escape `<` or `>`. Verified:
   `JSON.generate({a: "</script><script>alert(1)</script>"})` returns the sequence
   literally, whereas `{a: "</script>"}.to_json` returns `\u003c/script\u003e`. So any
   string at any depth in `view_prefs` can close the script tag. Chained with items 2 and
   8 — arbitrary stored JSON, written cross-site with no CSRF token — this is plantable in
   another user's account and fires on their next page load. Fix by using `to_json` /
   `ActiveSupport::JSON.encode` (both escape `<`, `>`, `&` by default), which holds for
   every value regardless of what the blob contains. Fix this **as well as** item 2, not
   instead of it: this one protects rows already in the database, item 2 stops new ones.

By the time this phase runs, brakeman will be unpinned (Phase 5 lifts it to 6+ on Ruby
3.1) and the two EOL warnings for Rails 5.2.8.1 and Ruby 2.7.4 will have resolved
themselves.

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
5. **`config/secrets.yml`** — **nothing reads this file any more.** Phase 5b moved every
   call site to ENV, and Rails 7.2 removed `Rails.application.secrets` from the framework
   entirely, so not even `secret_key_base` comes from it. The symlink in `linked_files` is
   inert. It is listed here only so nobody assumes it is still doing something.
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

**Every user gets logged out once on this deploy, regardless of `SECRET_KEY_BASE`.**
Rails 7.0's defaults move `key_generator_hash_digest_class` to SHA256, which changes how
session cookies are signed, so existing cookies stop verifying. This is unavoidable and
harmless — people log in again — but it should be expected rather than reported as a bug.
It arrives from a second direction on top of the `secret_key_base` risk below.

**`SECRET_KEY_BASE` is the one that gets forgotten, because it has zero call sites** —
Rails used to read it out of `secrets.yml` internally. As of Phase 5c **the environment is
its only source in production, and there is no fallback of any kind.** Verified by booting
production with the SMTP variables set and `SECRET_KEY_BASE` unset:

```
ArgumentError: Missing `secret_key_base` for 'production' environment,
set this string with `bin/rails credentials:edit`
```

Note carefully: **the `config/secrets.yml` symlink does not save you.** An earlier draft of
this note said step 2 below could rely on it, on the grounds that Rails reads
`secret_key_base` from either source. That is no longer true for the simplest possible
reason: **`Rails.application.secrets` was removed outright in Rails 7.2**, so the framework
has no code that opens that file. (Confirmed on 8.0.5.1 —
`Rails.application.respond_to?(:secrets)` is `false`.) A missing `SECRET_KEY_BASE` is a
boot crash, not a degraded boot.

Set it to the **exact existing value** from the server's current `config/secrets.yml`, not
a fresh one: a different value invalidates every session cookie. Sequence:

1. Set all four variables where the deploy user's non-interactive shell will see them.
2. Deploy. There is no fallback, so step 1 is not optional.
3. Whenever convenient, drop `config/secrets.yml` from `config/deploy.rb:10`'s
   `linked_files` and delete it from the server. This is **cosmetic cleanup, not a
   sequenced prerequisite** — the file is already unread. Doing it just stops a stale file
   full of live credentials sitting on the server pretending to matter.

**`assets:precompile` needs a reachable database.** `config/initializers/recurring_jobs.rb`
schedules a `Delayed::Job` on every production boot, and precompile boots the app. This is
pre-existing, not new, but it rules out precompiling on a build box that cannot reach
Postgres.

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

### 8c. Lint findings — the first eslint run this repo has ever had

Phase 7d set up eslint 9 with a flat config, on Brian's call, to report and not to fix
(see `eslint.config.mjs`, which records why there was nothing to migrate from). `yarn lint`
is **not in the gate**; whether it should be is the last item here.

**144 problems: 110 errors, 34 warnings.** By rule:

| Rule | Err | Warn | Character |
|---|---|---|---|
| `prefer-const` | 37 | | mechanical, `--fix`able |
| `react-hooks/exhaustive-deps` | | 21 | **needs judgement, see below** |
| `@typescript-eslint/no-explicit-any` | 20 | | mostly at API boundaries |
| `@typescript-eslint/no-unused-vars` | 14 | | dead code |
| `no-var` | 7 | | mechanical |
| `no-unused-vars` (js) | 7 | | dead code |
| `react-hooks/set-state-in-effect` | 6 | | **real, see below** |
| `jest/no-commented-out-tests` | | 7 | commented-out tests |
| `jest/expect-expect` | | 5 | **tests that assert nothing** |
| `@typescript-eslint/no-unused-expressions` | 4 | | |
| `react/display-name` | 3 | | |
| `@typescript-eslint/no-empty-object-type` | 3 | | `interface IProps {}` left by prop removal |
| `no-case-declarations` | 2 | | |
| `react-hooks/rules-of-hooks` | 1 | | **real, see below** |
| `react/jsx-no-target-blank` | 1 | | **security, see below** |
| `react-hooks/purity` | 1 | | |
| `react-hooks/refs` | 1 | | |
| `@typescript-eslint/no-require-imports` | 1 | | |
| `no-extra-boolean-cast` | 1 | | |
| `jest/valid-expect` | 1 | | **a broken assertion, see 8e** |
| `jest/no-disabled-tests` | | 1 | |

39 errors are `--fix`able. Do that as one mechanical commit with no review burden, and
keep it away from everything below.

**Mechanical pass done 2026-09-15: 144 problems → 71, in three commits.** `tsc --noEmit`
clean and Jest 125 passing after each.

- **`--fix` (144 → 105).** `prefer-const`, `no-var`, `no-extra-boolean-cast`. One thing in
  it is not style and is called out in its commit message: the autofix also added
  `rel="noreferrer"` to `DomainStatusItemView.tsx:149`, which closes finding 5 below.
- **Config: the `^_` convention (105 → 98).** `_props`, `_action`, `_e` and the Cypress
  `_` placeholders all predate this config and already mean "deliberately unused", so the
  linter is told the convention rather than the code edited to satisfy it. Note
  `no-unused-vars` and `@typescript-eslint/no-unused-vars` are separate rules needing
  separate options; both are set.
- **Code (98 → 71).** `data && dispatch(...)` → `if (data)` in `CoreData.ts`; two
  `let {…}` destructures split so only the reassigned binding stays `let`
  (`Icon.tsx`, `StyledTable.tsx`); two `case` blocks braced; three anonymous default
  exports named; four unread `catch (err)` bindings → optional catch binding; two props
  destructured only to keep them out of a spread renamed `_`; two dead imports removed.

The 71 that remain are findings 1–7 below plus the jest ones, which belong to 8e. Nothing
mechanical is left: **what is left needs a decision or a test.**

The findings that are not style:

1. **`react-hooks/rules-of-hooks` — `LanguagePageContent.tsx:37` calls `useContext`
   conditionally.** There is an early `return` above it, so on renders that take the early
   branch the hook is skipped, and React matches hooks by position within an instance.

   **Fixed 2026-09-15 by moving the hook above the returns — and the earlier claim here,
   that this was "the one lint finding that is a live correctness bug", was wrong.** It is
   not reachable. `LanguagePage.tsx:76-80` renders one `LanguagePageContent` per tab, keyed
   by name, each with a **constant** `tab` prop, so an instance never switches branch and
   its hook count never changes. What made it worth fixing is that the safety lives two
   files away and nothing here enforces it: add a `useState` below those returns, or render
   this component with a changing `tab`, and it starts throwing "Rendered more hooks than
   during the previous render" — into the error boundary that currently blanks the app
   (8d item 1). A trap rather than a bug.

   Not verified, and not relied on: React reads context off the fiber's dependency list
   rather than the hook list, which would mean `useContext` never occupied a positional
   slot at all. This repo's Jest has no jsdom environment (`jest-environment-jsdom` is not
   installed — every JS test here is a pure-function test), so it could not be checked, and
   the structural argument above stands without it. The component's shape is filed as a
   post-upgrade refactor in 8f item 4.
2. **`react-hooks/set-state-in-effect` ×6** — `CoreData.ts:14`,
   `NotificationSidebar.tsx:88`, `EventsTable.tsx:55`,
   `ActivityViewPeopleEditor.tsx:60`, `MyNotificationChannels.tsx:37`, `GoBar.tsx:50`.
   Synchronous `setState` inside an effect triggers a second render pass immediately. Note
   the company this keeps: the error boundary in 8d item 6 blanks the app for exactly this
   reason, at the extreme.

   **Reorganised 2026-09-15: worked per *effect*, not per rule.** Every one of these six
   is also an `exhaustive-deps` finding — an effect that calls `setState` is exactly the
   shape both rules catch — so the two lists overlap on all six, and six of the 21
   `exhaustive-deps` messages resolve with them — one each, not two. (An earlier draft of
   this paragraph, and the commit message for the family A work, both said "12 of the 21".
   That was wrong: each of the six effects produces exactly one message under each rule.
   Measured after family A landed: `exhaustive-deps` 21 → 18, `set-state-in-effect`
   6 → 3.) Doing them as two passes would have meant
   reading the same effects twice. Two further `exhaustive-deps` sites were handed to 8d,
   where the surrounding bugs are already written up: `useSearch.ts:34` (8d item 3's
   picker race) and `NetworkErrorAlerts.tsx:21` (8d item 6). That leaves 13 messages in 8
   files that are genuinely just dependency-array work.

   The six effects are three problems, not six. **Family A — derived state kept in
   state — is done:**

   - **`GoBar.tsx:50`.** `matches` was `search(query, props)` in state, resynced by
     `useEffect(..., [query])`. Now derived with `useMemo`. This also closed **8d item
     2** — see there for why deriving beat the dependency-array fix that item proposed.
   - **`ActivityViewPeopleEditor.tsx:57-61`.** `useState(availablePtptIds[0])` plus a
     dependency-*less* effect re-selecting the first entry when the pick fell out of the
     list. The effect was not synchronising anything: `useState` reads its argument only
     on the first render, and on that render the participants fetched by `useLoadOnMount`
     have not arrived, so the initial value was always `undefined`. The pick is now state
     and its validity a derivation. The workaround comment at line 94 ("Only need to check
     both because of tests where Edit gets clicked before ptpts are loaded") documents the
     render this removes; the guard is left alone because `participantPeople` can return
     fewer entries than `availablePtptIds`, so the two conditions are not equivalent.
   - **`MyNotificationChannels.tsx:35`.** Same shape for `addDomain`. This one had **no
     test coverage at all** — the Domain branch sits behind the "Add Channel" type
     selector — so `spec/cypress/e2e/notificationChannels.spec.js` was written first,
     against the unchanged component, and passed before and after.

   **Family B — a loading flag at the head of an async fetch — is done, as comments.**
   `EventsTable.tsx:55` and `NotificationSidebar.tsx:88` both run an effect that calls an
   async fetcher, and both fetchers open with `setLoading(true)`. The extra render pass
   that triggers is the one that draws the spinner, so the rule is describing the intent:
   it cannot tell a loading flag — a fact about an in-flight request, which is precisely
   what state is for — apart from state that should have been derived. Unlike family A,
   nothing here is derivable and the effect is doing what effects are for, synchronising
   with something outside React.

   Both rules are suppressed with the reasoning in the code, as a block rather than
   `disable-next-line` because the two rules report on different lines (the `setState`
   call, and the dependency list a line below it). The `exhaustive-deps` halves were
   traced rather than waved away:

   - `EventsTable` — `getEvents` is redefined every render, so listing it would refire the
     effect every render; a `useCallback` honest about its closure (`props.eventsUrl`,
     `props.eventsBackTo`, five `props.add*` callbacks) would change identity whenever the
     parent re-rendered and **refetch**. `[]` is correct: fetch once on mount.
   - `NotificationSidebar` — `state` is deliberately unlisted. The condition is "has this
     tab been fetched yet", so re-running when `state` changes would defeat it. The
     stale-closure risk this usually implies is absent: `getNotifications` reads
     `state[channel].nextPage` for pagination, but the effect only runs on a tab change
     and its closure is that render's.

   The alternative was to hoist the loading flag out of the fetchers to their call sites so
   the effects no longer set state. Rejected: `getEvents` has two call sites (mount, and
   the "more events" button) and both want the flag, so hoisting duplicates it and makes
   the fetcher's contract worse to satisfy a linter.

   **C — `CoreData.ts`** carries three findings at once (this one, `purity` at :10,
   `exhaustive-deps` at :12) and is a real defect: see item 4 below. It is the only
   `set-state-in-effect` left.
2b. **The remaining `exhaustive-deps` messages contained one real bug, and it is fixed.**
   `DBParticipantsTable.tsx:36` passed `props.languageIds` **as** its dependency array
   rather than as a dependency. React's `areHookInputsEqual` compares pairwise only up to
   `min(prev.length, next.length)`, so a selection that was a superset of the previous one
   with the same leading ids compared equal on every index React looked at and the effect
   was skipped outright.

   Measured on the dashboard's People tab before fixing it — participant fetches per
   sidebar selection:

   ```
   user (Drew)    [876048951, 292428285, 248732538]
   Ndop cluster   [292428285, 248732538]
   North Region   [876048951, 505201461]
   Cameroon       []                        <- nothing at all
   South Region   [406181303, 292428285, 248732538]
   ```

   Selecting **Cameroon**, the largest selection the dashboard offers, fetched nothing,
   leaving the tab showing whatever earlier clicking had left in the store — an incomplete
   list with no error and no spinner. Fixed by adopting the stable key
   `JSON.stringify(props.languageIds)` that `DBActivitiesTable.tsx:56` already used for
   the identical problem; the codebase had two answers to one question and one of them was
   wrong. `spec/cypress/e2e/dashboardPeople.spec.js` was written first and failed against
   the old code with `expected 0 to be above 2`.

   The spec asserts on the **requests**, not the rendered rows: the store accumulates, so
   people loaded by an earlier selection linger and the table can look plausible while the
   fetch it needed never happened.

2c. **The other eleven `exhaustive-deps` messages: two real tidies, the rest declared.**
   Done 2026-09-16 as one commit, **55 problems → 44**, with no behaviour change anywhere.
   The point of the pass was to leave nothing in the file that a reader has to re-derive:
   after it, every remaining suppression carries the reason in the code.

   Two were genuinely wrong and are now correct:

   - **`DuluApp.tsx:38`** omitted `dispatch`. Listing it costs nothing — react-redux
     returns the store's own dispatch, created once and never replaced — so this stays a
     once-on-mount effect, but now by something the linter can check.
   - **`SavedReports.tsx:23`** guarded its fetch with `if (!savedReports)` inside a
     mount-only effect, where `savedReports` is null by construction and the guard could
     never be false. Deleting the dead read is what makes `[]` honest rather than
     suppressed — the warning existed only because of the line that did nothing.

   Two more were readability, not correctness: `DBActivitiesTable.tsx:56` and
   `DomainReportSidebar.tsx:59` both computed `JSON.stringify(...)` **inside** the
   dependency list, which the rule cannot statically check. Hoisted to a named
   `…Key` variable, which is also where the explanation now lives. This is the same
   stable-key technique 2b adopted for `DBParticipantsTable`.

   Five sites still carry a suppression, each with its reasoning in the code — the two
   above among them, since hoisting the key makes the dependency checkable but does not
   make the omitted props wrong to omit:

   | site | why the rule is wrong here |
   |---|---|
   | `DBActivitiesTable.tsx` | `domain` is computed from `props.type`, a string literal at every `MainContent` call site; `noAPILoad` is not derived from anything, but is likewise fixed per instance — a bare attribute on the Workshops table, absent elsewhere; `load` is a new closure each render |
   | `DomainReportSidebar.tsx` | `props.setReport` is a fresh arrow per parent render; listing it would refetch the report each time the fetched report arrives |
   | `EventsCalendar.tsx:48,53` | `centerMonth` is computed from `props.year`/`props.month`, which the second effect already lists; `props` is the wrong dependency by the rule's own admission, and the first effect is a mount-only load the second one takes over from |
   | `useLoad.ts:29` | uncheckable **by construction** — the dependency list is a function parameter, so there is no literal for eslint to read, and that is the hook's whole purpose |
   | `DBEventsTable.tsx:27` | family B's shape: no list on purpose, the guard (`eventsBackTo == undefined && !loadingMore`) is what stops it |

   Suppressed as blocks rather than `disable-next-line`, for the reason family B already
   found: the rule reports on the dependency-array line, not the `useEffect` call, so a
   next-line directive lands on the wrong row and is then itself reported as unused.

   **What is left of this rule is two messages, both already assigned:** `useSearch.ts:34`
   to 8d item 3 and `NetworkErrorAlerts.tsx:21` to 8d item 6.


3. **`react-hooks/refs` — `useSearch.ts:36` reads a ref during render.** `useSearch` is
   the search picker, and 8d item 3 is the search picker's stale-response race. Same file,
   same family of problem; fix them together.
4. **`react-hooks/purity` — `CoreData.ts:10` calls `Date.now()` during render.**
   Traced 2026-09-15 and it is worse than a purity smell: **the five-minute refresh this
   component exists to perform does not happen on a timer at all.** There is no
   `setInterval`. The effect has no dependency array, so it runs after *every* render and
   only then checks the clock — meaning the refresh fires whenever something else happens
   to re-render `CoreData`, and on a screen the user is not interacting with it never
   fires. Fix by making it an actual interval, which deletes the `lastUpdate` state and
   all three findings. Deferred from family A because it changes runtime behaviour on
   every open tab (three GETs every five minutes, where today an idle tab issues none),
   which is a decision rather than a cleanup.

   **Landed 2026-09-16: the existing behaviour kept, and declared. Brian's call, and the
   right one.** Two rewrites were tried and rejected before this. A real `setInterval`
   polls three whole collections from every open tab forever, including tabs nobody is
   looking at, to keep a cache only `GoBar` reads. A mount-only load leaves an active user
   on a page-load snapshot. What the accidental implementation actually did — refresh when
   the user navigates, at most once every five minutes — is better than both: it spends
   requests only while someone is using the app.

   So the fault was never the behaviour, it was that nothing said so. The comment claimed
   an interval that did not exist, the mechanism was "an effect with no dependency array
   runs after every render, and CoreData re-renders with BaseMainRouter, which calls
   useLocation", and the clock check sat in the render path. The rewrite keeps the
   semantics and states them: `useLocation()` directly, `[pathname, dispatch]` as the
   dependency list, `Date.now()` inside the effect, and the timestamp in a **ref** rather
   than state — it is bookkeeping between effect runs that nothing renders, so state only
   bought an extra render pass. All three findings go quiet because the code now says what
   it means.

   Verified in a browser with `cy.clock(Date.now(), ["Date"])` — faking `Date` only, so
   React's scheduler and axios keep running: one fetch on load, still one after three
   navigations, two after advancing past the gate, and two again immediately after.
   `spec/cypress/e2e/coreData.spec.js` keeps that pinned, because the two "obvious"
   rewrites are each one small edit away and a future reader has no other way to know the
   trade was considered.

   Also settled while measuring: **the boards, not `CoreData`, are what refresh this data
   in practice**, and they do it on *mount* rather than on location change — so clicking
   "Languages" while already inside `/languages/…` refetches nothing, because
   `LanguagesBoard` is a layout route that never unmounted. And `/api/languages` is
   fetched twice on a cold load, once by `CoreData` and once by `LanguagesBoard`. The
   design question underneath — `GoBar` searching the store instead of the server — is
   filed as 8f item 6.
5. **`react/jsx-no-target-blank` — `DomainStatusItemView.tsx:149`** uses `target="_blank"`
   with no `rel="noreferrer"`. Reverse tabnabbing: the opened page gets a handle on this
   one. A security finding brakeman cannot see because it is in the React tree, which is
   worth noticing about the coverage of 8a.
6. **`@typescript-eslint/no-explicit-any` ×20 and `no-unused-vars` ×21.** Worth reading
   once as a list rather than fixing blind, and reading them did correct the guess written
   here first. **The `any`s do not cluster at the axios boundary.** Only three of the
   twenty-three findings are there — eslint reports at *declarations*, not usages, so the
   fifty-seven call sites that read `data.foo` off an untyped response produce no findings
   at all. The other twenty are seven unrelated little decisions: React children typed
   `any` ×2, a style bag, the three in `i18n`, four generic utilities, two hook parameters,
   a type guard and the dispatch context, plus `JSEvent`'s two.

   **6a. The axios boundary — landed 2026-09-16.** Three findings: `AnyObj`'s index
   signature, `PostParams`'s, and `get`'s `params?: {}`.

   The honest fix was measured rather than guessed. Flipping `AnyObj`'s index signature to
   `unknown` produces **35 `tsc` errors across 20 files**, and every one of them wants a
   cast — which is the assertion `any` was already making, written out longer. That is a
   wide diff across files this upgrade has no other reason to touch, in exchange for
   type-checking *at* the cast and nothing after it.

   What landed instead makes the response shape a type parameter defaulting to `AnyObj`:
   `get: <T = AnyObj>(url, params?: AnyObj) => Promise<T | undefined>`, and the same on
   `post`, `put` and `delete`. Every existing call site compiles untouched and keeps the
   type it had; a caller that knows the shape now has somewhere to say so —
   `DuluAxios.get<{ report: DomainReport }>("/api/reports/domain_report", params)` — and
   gets its field names checked. The debt gets paid down at call sites as they are touched
   for other reasons, which is the only way it realistically gets paid down at all.

   The two remaining `any`s are suppressed at their single declaration with the measurement
   written above them, so a future reader inherits the reasoning rather than the verdict.
   `params?: {}` became `params?: AnyObj`, which closes a small real hole: `{}` means "any
   non-nullish value", so `DuluAxios.get(url, "oops")` type-checked before today.

   One wart this does *not* fix, and should not be mistaken for fixed: `delete` returns
   `false` from its catch, so `DuluAxios.delete<T>()` can hand back a boolean the signature
   does not admit. That was equally untrue of the old `Promise<MaybeAnyObj>` signature; the
   generic neither causes it nor cures it.

   44 → 41 lint problems (29 → 26 errors). `tsc` clean, Jest 125 passing, Cypress 104 / 103
   passing / 1 pending — no runtime change, and none intended.

   **6b. The other twenty** are a separate and much cheaper conversation: mostly mechanical
   (`children: any` → `React.ReactNode`, a style bag → `React.CSSProperties`), with the
   `i18n` three, the generic utilities and `LoadAction`'s type guard needing a little
   judgement each.
7. **Decide whether `yarn lint` joins the gate.** It cannot today: it exits 1. Either fix
   to zero and add it, or add it with `--max-warnings` and a baseline. A lint step nobody
   runs is what the last one was, and it sat in `devDependencies` for years without a
   config.

### 8d. Correctness defects found during the upgrade

Each of these was found while doing something else, left alone deliberately, and needs a
test written before the fix.

1. **The error boundary does not show its error page; it loops and blanks the app.**
   `/events/crash-me-now` exists precisely to exercise `BaseMainRouter`'s boundary.
   Visiting it leaves `#app` empty, throws React error #185 ("Maximum update depth
   exceeded"), and posts a flood of reports to `/api/errors` — in production, one
   admin email per post. The cause is `componentDidUpdate`, which clears `hasError`
   whenever the previous state had it set: that re-renders the route that just crashed,
   which throws again. The intent is to let the user navigate away from the error page,
   and it does that by re-rendering the thing that crashed. Fix by clearing `hasError`
   on a *location change* rather than on any update — the boundary already receives
   `location` as a prop since Phase 7c, so compare it against the location the crash
   happened at. **Verified pre-existing, not a React 18 regression:** reverting
   `react`/`react-dom` to 16.8.6 and rebuilding reproduces it identically. Found in
   Phase 7a. `spec/cypress/e2e/errorBoundary.spec.js` is written and `describe.skip`ped
   — unskip it here, it is the failing test this item would otherwise ask for.

2. **`GoBar` never recomputes its matches when its data arrives.** Its
   `useEffect(() => setMatches(search(query, props)), [query])` lists only `query` as a
   dependency, while the languages/people/organizations it searches are fetched by
   `CoreData` *after* first paint. Type before that lands and the dropdown stays empty
   until you type another character. Found in Phase 7c while writing a test that had to
   wait on a table row before typing, purely to work around it. Same family as the search
   picker race below. Add the searched lists to the dependency array.

   **Fixed 2026-09-15, and not the way this item proposed.** Adding the lists to the
   dependency array would have worked, but the better answer was to notice that `matches`
   is not state at all: it is `search(query, props)` and nothing else. Storing a value
   that can always be recomputed is what created the possibility of it being stale, so the
   state and the effect are both gone and the value is derived during render (`useMemo`,
   keyed on `query` and `props`, because hovering a result sets `activeIndex` and would
   otherwise rescan every record). That also removes the one-render window where the query
   had updated and the matches had not — visible on every keystroke, not just at load.
   Found via 8c's `set-state-in-effect`, which flagged the same line.

   `navigation.spec.js`'s wait-for-a-table-row, added in Phase 7c purely to work around
   this, is now ordinary determinism and its comment says so.

3. **The person/organization search pickers do not discard stale responses.** Typing into
   a picker fires a request per keystroke and each response overwrites the results list,
   so a slow earlier response can land after a later one and replace the correct results.
   Observed in E2E as pressing Enter selecting the wrong person entirely ("expected input
   to have value 'Drew Mambo', but the value was 'Lance Armstrong'"), and as clicking a
   result failing because the list re-rendered underneath the click. Users hit the same
   thing on a slow connection. Fix by tagging each request and ignoring any response that
   is not for the current query.

4. **Two defects in the global search, both found in Phase 6g while establishing
   that `Searcher` is not a route consumer.** Neither is a regression from this upgrade;
   both predate it. (a) `Searcher.tsx`'s `flattenResults` discards the result of
   `flatResults.concat(flattenResults(result.subresults.results, level + 1))` — the return
   value is thrown away, so **subresults never render at all**. (b) `Activity.search` is
   commented out of `Api::SearchesController`, so activities are absent from global search
   entirely. Worth asking whether (b) was deliberate before "fixing" it; (a) is plainly a
   bug.

5. **`DomainReport#gen_activity_items` has no deterministic order.**
   `app/models/domain_report.rb:66` orders by `start_date: :desc` with no tiebreaker, so
   rows sharing a date come back in whatever order PostgreSQL feels like — users see the
   report reshuffle between loads. It is the same method as the SQL injection finding
   above, so fix both in one pass. `spec/cypress/integration/reports.spec.js` was made
   order-agnostic in Phase 2 to stop it failing at random; tighten it back up once the
   query is deterministic.

6. **The frontend has no session-expiry handling: a logged-out request shows "Dulu
   server error" instead of sending the user to sign in.** `DuluAxios.handleError`
   (`app/javascript/util/DuluAxios.ts`) branches on nothing but the presence of
   `error.response`: any HTTP status at all becomes `{ type: "server" }`, which
   `NetworkErrorAlerts` renders as `server_error_message` — "Dulu server error." Phase 4
   made a logged-out XHR return 401 (`ApplicationController#require_login`,
   `head :unauthorized`; it used to return a 302 that axios followed cross-origin into
   Google), so the status is now clean and distinguishable — nothing consumes it.
   The server-side log signature is the `ActionController::Callbacks` INFO line
   `Filter chain halted as :require_login rendered or redirected`. That line is not an
   exception and is never rendered; it is the normal trace of the 401 branch, so do not
   go looking for a raise behind it.

   **This is the most user-visible thing about the cutover, not background debt.** Every
   session cookie is invalidated by this deploy (§8b/P5 — Rails 7.0 moved
   `key_generator_hash_digest_class` to SHA256). An unverifiable cookie is discarded
   silently, so `session[:user_id]` is nil, `Person.find_by id: nil` is nil, `logged_in?`
   is false — and every user holding an open tab at deploy time gets a 401 on their next
   XHR. The first thing they see of the new version is a generic server error. Worse,
   `NetworkErrorAlerts` clears `serverError` on every `location.pathname` change while
   the 401 recurs, so the banner blinks in and out as they click around and the app looks
   alive but empty rather than plainly broken — considerably harder to diagnose from a
   support ticket. Consider promoting this ahead of the first deploy rather than leaving
   it in Phase 8; that is Brian's call, but it should be a knowing one.

   **Prerequisite: 401 currently means two different things.** `require_login` answers a
   logged-out XHR with an empty-bodied `head :unauthorized`, and the
   `rescue_from "AccessGranted::AccessDenied"` handler answers a permission denial with
   `render plain: "Not allowed", status: 401` — on HTML requests as well as XHR. Status
   alone therefore cannot distinguish "sign in again" from "you may not do that", and
   body-sniffing is the wrong fix. Split them first: 403 for `AccessDenied`, 401 reserved
   for not-logged-in. That is one line in the `rescue_from` block and one line in
   `assert_not_allowed` (`test/test_helper.rb:62`); the ~15 controller test files that
   assert it all go through that helper. The frontend fix is unsafe without this split —
   a 401-means-logged-out handler would try to re-authenticate a user who is simply
   unauthorised.

   **The fix has to be driven from the client.** The server cannot usefully redirect an
   XHR — that is exactly what Phase 4b removed, because axios follows a 302 cross-origin
   into Google. So on a 401 the frontend navigates, and it should reload the *current*
   URL rather than go to root: `require_login`'s HTML branch sets
   `session[:original_request] = request.path`, which survives the OAuth round trip, so a
   reload puts the user back where they were after signing in, where root would throw the
   deep link away.

7. **A stale CSRF token on the sign-in button gives an error page.** Leave the welcome
   page open past session expiry, click sign in, and `omniauth-rails_csrf_protection`
   raises from middleware. Rails maps that to 422, but the user sees an error page rather
   than a retry. Rescue it and re-render the welcome page.

### 8e. Test-suite debt

1. **`people.spec.js` "Creates person" is flaky, and it is not a test problem** — it is
   8d item 3 (the search picker's stale responses) observed from outside. It failed once
   in five full runs during Phase 7, always at load average 5+, and passes 11/11 in
   isolation. Fixing the picker fixes the flake; tightening the spec would only hide it.
   `navigation.spec.js` failed once in the same family, on its GoBar test.
2. **`spec/cypress/e2e/errorBoundary.spec.js` is `describe.skip`ped and documents a live
   bug.** It is 8d item 1's failing test, already written. Unskip it there.
3. **`testIsolation: false`** in `spec/cypress.config.js`. Cypress 12 turned isolation on
   by default; this suite predates that and is deliberately stateful — specs build on the
   page the previous test left behind, and `log_in.spec.js` asserts on "Welcome to Dulu"
   before it visits anything. Making the 22 specs isolation-clean is a real improvement
   and a real project. Until then, note that **a spec's alphabetical neighbours are part
   of its fixture.**
4. **`Activity.test.js:74` asserts nothing.** `expect(...).toBeUndefined` — the matcher is
   referenced, not called, so the assertion never runs. Found by `jest/valid-expect`. This
   is the one lint finding that means a test has been silently passing.
5. **Five more tests with no assertions** (`jest/expect-expect`): `eventsReducer.test.js`
   ×3, `deepcopy.test.ts`, and `Workshop.test.ts` — the last is skipped in its entirety,
   which `jest/no-disabled-tests` also reports.
6. **Seven blocks of commented-out tests** (`jest/no-commented-out-tests`), mostly in
   `arrayUtils.test.ts`. Delete them or restore them; a commented test is a claim that
   something was once checked and is not now.
7. **There is no CI.** No `.github/workflows`, no `.circleci`. Every gate in this plan has
   been run by hand. That is why the `yarn testPacks` digest hazard below mattered enough
   to document: with no CI there is no second place the truth shows up.
8. **`test/system` cannot run on this machine** for want of a `chromedriver` (Phase 3g).
   Two system tests exist and have never been exercised in this upgrade.
9. **Notification channels have no E2E coverage at all.** No spec among the 22 opens the
   settings page that renders `MyNotificationChannels` — `notifications.spec.js` is the
   feed. So the three `SearchPicker` null guards and the `Domain` cast added there in 7d
   are unexercised, as is `set-state-in-effect` at `MyNotificationChannels.tsx:37`
   (8c item 2). Nothing there can misbehave today, but "98 green" should not be read as
   having exercised it.

10. **`navigation.spec.js` flaked once, on 2026-09-16.** One of its four tests failed in a
   full-suite run (the spec took 35s against its usual 6s, so a retry against a timeout),
   and did not reproduce: green in isolation immediately after, and green in a second full
   run of all 26 specs. Recorded rather than chased because a suite run by hand has no
   history to compare against — this is the first noted flake, and a second sighting is
   what would make it a bug. Which test failed is unknown: the run captured no screenshot.

**And a standing hazard rather than a task:** `yarn testPacks` — and therefore
`yarn test:cypress:gate` — **exits 0 with "Everything's up-to-date" on the run immediately
after a compile that failed**, because shakapacker records the digest regardless of
webpack's result. Cypress then runs against the last *good* bundle, so the suite is green
while the code does not compile. Read the **first** run's output, and `rm -rf
tmp/shakapacker` whenever a build's result is in doubt.

### 8f. Dead code and modelling

Nothing here is broken today.

1. **`NewOrganizationForm` navigates to a URL nothing else in the app uses.** After
   saving it goes to `/organizations/:id`, while every link in the app points at
   `/organizations/show/:id`. Under React Router 5 this worked only by accident:
   `routeActionAndId()` rewrote a numeric first segment into action `"show"`, so the
   wrong URL was silently repaired on arrival. Phase 7c deleted that helper and
   `organizations.spec.js` failed inside one run. **The port routes both spellings** —
   changing the form would have been a behaviour change, not a migration — so nothing is
   broken today, but the duplicate route in `MainRouter` is debt. Fix by making the form
   navigate to `/organizations/show/:id` and deleting the bare `:id` route. Check first
   that no bookmark or email links the short form; if they do, keep it as an explicit
   `<Navigate>` redirect rather than a second copy of the page.

2. **The activity routes now enumerate `Activity`'s STI subclasses by hand.** React
   Router 5 matched all of them with `/*activities/:id`; v6 splats must be trailing, so
   that pattern is inexpressible and `MainRouter` lists
   `/translation_activities/:id`, `/linguistic_activities/:id`, `/media_activities/:id`
   and `/activities/:id` instead. Correct today, but a fourth subclass added to
   `Activity` will 404 on the frontend with nothing failing to say so. Either derive the
   list from a single shared source, or add a model test asserting
   `Activity.descendants` matches the paths the router declares. `notifications.spec.js`
   covers the routes that exist; it cannot cover one that was never added.

3. **The dashboard shows a language with no URL of its own, and it is the reason a
   whole router was unreachable.** Before Phase 7c, `Dashboard` rendered
   `LanguagePageRouter` outside any route with `basePath=""`, which made every path that
   router declared unmatchable — the fallback `LanguagePage` was the only thing it could
   ever display. 7c replaced it with `DashboardLanguagePage`, which renders
   `LanguagePage` directly, so the dead code is gone. What remains is the underlying
   design: selecting a language on the dashboard changes no URL, so it cannot be linked,
   bookmarked, or returned to with the back button, and `dashboard.spec.js` has to click
   through the sidebar without asserting a location. Decide whether that is intended. If
   it is not, giving the dashboard real nested routes is the fix and it is a feature
   change, not cleanup.
4. **`LanguagePageContent` is three components sharing one name — revisit after the
   upgrade.** It opens with two early returns that hand the whole render to
   `LanguageEventsContainer` (tab `Events`) or `ParticipantsTable` (tab `People`), and
   only then does the work its name suggests. 8c's `rules-of-hooks` finding was a symptom
   of that shape: the hook sat below the returns, so the component's hook count varied
   with its branch. 2026-09-15 moved the hook above them, which makes it correct, and
   deliberately did not restructure — a component split is not a lint fix.

   The real fix is to hoist the branching into `LanguagePage`'s `TabPanel` map
   (`LanguagePage.tsx:76-80`), so the Events and People panels render their own component
   directly and `LanguagePageContent` handles only the tabs it was written for. Cheap and
   low-risk; parked only because it is a refactor rather than part of the upgrade.
   `props.tab` is constant per instance today, which is what makes the current code safe
   and is also what makes the split easy.

5. **`foreman` is a dependency doing a job `concurrently` already does — replace
   `foreman s` with `yarn start`.** Raised 2026-09-15. Nothing here is broken; the point
   is that the gem is unnecessary.

   Checked, and none of the three reasons to keep foreman apply. There is **no `.env` and
   no `dotenv` gem**, so its main advantage over a plain process runner — loading `.env`
   into every child — is buying nothing. **Nothing but `README.md:121` reads the
   `Procfile`**: it appears nowhere in `config/deploy*` or any rake task, so it is not a
   deploy contract (deployment is Capistrano, not Heroku). And **`concurrently` is already
   a devDependency** at `^9.2.1`, already running multi-process setups in
   `test:cypress`, `test:cypress:run` and `test:cypress:gate`.

   foreman has also cost something already: 0.64 called `File.exists?`, removed in Ruby
   3.4, so `foreman s` died before reading the `Procfile` and had to be bumped to
   `~> 0.90` (see the Gemfile comment). That is maintenance paid for a tool we do not need.

   Proposed replacement — one script, the same three processes:

   ```json
   "start": "concurrently -p \"[{name}]\" -n \"web,webpack,jobs\" -k -c blue,yellow,magenta \"bundle exec rails server -p ${PORT:-3000} -P tmp/pids/server_dev.pid\" \"./bin/shakapacker-dev-server\" \"bundle exec rake jobs:work\""
   ```

   `-k` kills the siblings when one dies, which is the foreman behaviour worth keeping.
   `${PORT:-3000}` is an incidental win: the `Procfile` hardcodes `-p 3000`, and Phase 5
   had to copy it to a temp file on 3001 to work around another project's puma holding the
   port (`foreman start -f <copy> -d /work/work/dulu`). With `PORT` respected that becomes
   `PORT=3001 yarn start`.

   When this is done: remove `gem "foreman"` and its Gemfile comment, delete the
   `Procfile`, and **update `README.md:121`** — plus the many references to `foreman s`
   throughout this plan, which are historical records of what was run at each phase gate
   and should be left as they are rather than rewritten. Verify by starting it and
   confirming all three processes come up: 200 on the web port, the dev server serving
   packs, and `jobs:work` polling. Note that `yarn start` makes Node a prerequisite for
   starting Rails in development, which is already true in practice because of the webpack
   dev server.

   Deliberately **not** done during the upgrade: it changes the documented way to run the
   app, and every phase gate in this plan was verified with `foreman s`. Changing the
   runner mid-upgrade would mean a gate failure could be the runner rather than the code.

6. **Dulu has two global searches, and one of them is why `CoreData` exists.** Raised
   2026-09-16 while fixing 8c item 4. `Api::SearchesController` (`/api/search`) searches
   languages, people, organizations, clusters *and* events server-side, and the
   dashboard's `Searcher` uses it. The NavBar's `GoBar` does the same job client-side,
   filtering whatever happens to be in the Redux store — which is why `CoreData` eagerly
   loads `/api/languages`, `/api/people` and `/api/organizations` on every page load.

   Two things make this worth revisiting rather than leaving. `GoBar` searches **five**
   collections and `CoreData` loads **three**: clusters and regions reach the store only
   if the user visits `ClustersBoard` or `RegionsBoard`, so a newly created cluster is
   unfindable in `GoBar` until then. That has always been true and nobody has filed it,
   which is the best evidence available that the eager-load design is not load-bearing.
   And every view of this data already refetches on mount, so the store is kept current by
   ordinary navigation regardless.

   If `GoBar` used `/api/search` like `Searcher` does, its results would be complete and
   consistent for the first time, `CoreData` could be deleted outright, and three
   whole-collection GETs would come off every page load. That is a feature change rather
   than cleanup, which is why it is filed here and not done. Whoever takes it should also
   decide whether two search boxes are wanted at all.

7. **The dashboard fetches participants one language at a time.** Surfaced 2026-09-16 by
   the `DBParticipantsTable` fix in 8c item 2b. The effect loops over the selection's
   language ids and issues `/api/languages/:id/participants` for each, so a selection's
   cost is linear in its size: in the dev database, selecting **Cameroon** issues **62**
   requests (Bamenda 26, Equatorial Guinea 8, Greater North 18, Yaoundé 10), and
   production will be proportionally larger.

   Pre-existing — every region selection already did this — but worth filing now because
   the bug that was just fixed made the largest selection *silently free*. It fetched
   nothing at all, so nobody ever saw what a whole-country selection costs. Fixing the
   correctness bug turned the cheapest click into the most expensive one.

   The fix is a bulk endpoint — `/api/participants?language_ids=[…]`, or extending
   `dashboard_list` — so one selection is one request. `DBActivitiesTable` has the same
   shape (`/api/activities` per language id) and should be done at the same time. Not
   attempted during the upgrade: it needs a new endpoint and a jbuilder view, which is a
   feature change.

8. **`PlainTable.tsx` is unreferenced.** Nothing imports it and nothing constructs a
   `TableReport`. Found in Phase 7a, when `@types/react` 18 rejected it for rendering a
   `string | { text, url }` as a child — a latent crash in dead code. It was fixed rather
   than deleted, because deleting a component is not a type bump. Delete it here, or find
   out what it was for.
9. **`DomainReportSidebar` keys its fetch on a value it feeds itself.** Noticed
   2026-09-16 while hoisting the key in 8c item 2c; **pre-existing and untouched** — the
   hoist is value-identical to the expression it replaced.

   The effect refetches when `JSON.stringify(reportParams)` changes, and on every response
   calls `props.setReport(data.report)`, which is where `reportParams` comes from
   (`props.report.dataParams`). So the response feeds the key. It terminates today only
   because the server echoes the params back in the same shape, and `JSON.stringify` is
   key-order-sensitive: a response that reordered the keys, or added one, would stringify
   differently and the effect would fetch again, forever. The loop would be a tight one —
   no throttle, no error state, just requests.

   The robust form keys on something the response cannot influence (a counter bumped by
   `updateReportParams`) or compares the params structurally rather than by serialisation.
   Not attempted during the upgrade: it is a change to how the report reloads, and the
   current code is stable against the server we have.

### 8g. Deferred majors and forward-compatibility

Everything Phase 7 chose not to bump, with the reason. None of these is urgent; all of
them are cheaper to decide now than to rediscover.

1. **React 19** (`react`/`react-dom` 18.3.1 → 19.x). Not a version bump: 19 removes the
   unprefixed legacy lifecycles, `propTypes` on function components, and string refs.
   `react-tabs` 6 already declares `^18 || ^19`, and `react-redux` 9 declares `^18 || ^19`,
   so the dependencies are ready — the application is the question. Note the codebase has
   15 class components and one unprefixed `componentWillReceiveProps` inside react-tabs.
2. **`react-router-dom` 7** (6.30.6 → 7.x). Deliberately out of scope in 7c, and every 7.x
   requires React ≥18, which is now satisfied. The v6 component API this port targets is
   what v7 keeps, so this is a smaller hop than 5→6 was.
3. **The `resolutions` pin is gone, and this is the symptom to recognise if it comes
   back.** 7a added `resolutions` for `@types/react`/`@types/react-dom` because three
   packages declared `"@types/react": "*"`, which resolved to 19 in nested copies and made
   every `connect()`-wrapped and react-tabs component fail `TS2786` — an error whose text
   points at `connect()` and reads like a react-redux incompatibility. All three of those
   dependents are now gone (`@types/react-redux` with 7b, `@types/react-tabs` with 7d,
   `@types/hoist-non-react-statics` with them), so the pin was inert and was removed:
   verified with a forced clean resolve, which produced one copy of `@types/react` at
   18.3.31 and no lockfile change. **Nothing holds the types below 19 any more**, which is
   what item 1 needs. If a future dependency reintroduces a `"@types/react": "*"`, the
   symptom is a burst of `TS2786`s — check for a second copy in `node_modules` before
   believing the error.
4. **eslint 10** (9.39.5 → 10.x). Blocked, not deferred: `eslint-plugin-react` 7.37.5
   peers at `^9.7`, so 9 is the ceiling until that plugin ships eslint 10 support.
5. **Cypress 16** (15.21.1 → 16.x), **TypeScript 7** (5.9.3 → 7.x), **`@types/node` 26**
   (20.x → 26.x). Each is a major with its own gate; none is needed by anything above.
6. **Babel 8** (`@babel/*` 7.29 → 8.x) and the **webpack loader majors** —
   `babel-loader` 8→10, `css-loader` 6→7, `style-loader` 3→4, `webpack-cli` 5→7,
   `webpack-merge` 5→6, `compression-webpack-plugin` 9→12,
   `css-minimizer-webpack-plugin` 4→8, `webpack-assets-manifest` 5→6,
   `webpack-dev-server` 5→6. These are shakapacker's neighbours, not application
   dependencies; shakapacker 10 pins compatible ranges and the build is green. Treat them
   as one build-toolchain phase, not as ten bumps.
7. **`regenerator-runtime` 0.13.11 → 0.14.1.** Trivial, but it is imported by
   `application/index.js` alongside `core-js/stable` for Babel's `useBuiltIns: "entry"`,
   so it belongs with the Babel decision above.
8. **`prop-types` is still a dependency for one file.** `index.js` declares
   `App.propTypes`, which is the only `propTypes` in the codebase — and React 19 ignores
   `propTypes` on function components entirely. Drop it with item 1; `App` takes one prop
   and the file is not type-checked because it is `.js`.
9. **A duplicate JSON key that becomes an error in json 3.0.** Every Rails test run prints
   `warning: detected duplicate key "type"` from `active_support/json/encoding.rb`,
   for activity payloads carrying both `"type" => "TranslationActivity"` and
   `type: "TranslationActivity"` — a string key and a symbol key for the same field, from
   a jbuilder view merging in a hash that already has one. Harmless today, an exception
   when json 3.0 lands. Find the view and pick one key.
10. **Redux Toolkit.** `createStore` is soft-deprecated in redux 5 and still exported;
    `index.js` uses it and works. `configureStore` remains optional follow-up, as it was
    before — recorded here so "deprecated" is not mistaken for "broken."

---

## Sequencing summary

```
Phase 0  Hygiene, Cypress baseline, branch triage    DONE  no version changes
Phase 1  Ruby 2.7 + Rails 5.2                       DONE  Ruby moves once, 4 hops
Phase 2  Node 20 + Webpacker -> Shakapacker 10      DONE  joint frontend/backend step
Phase 3  Rails 6.0 -> 6.1 (Zeitwerk) + audited 5    DONE  + sprockets 4, capybara 3
Phase 4  OmniAuth 2                              DONE  browser login verified
Phase 5  Ruby 3.1 + secrets -> ENV + Rails 7.0 -> 7.1   DONE  deploy-affecting; see 8b item 7
Phase 6  Ruby 3.4 + Rails 7.2 -> 8.1 + Cypress 15     DONE  Rails 8.1 added: 8.0 EOL 2026-10-07
         6f drop Enzyme, 6g routing specs (93->97)  DONE  pre-Phase-7 groundwork
Phase 7  React Router 6 -> React 18 -> react-redux 9  DONE  order was 7c, 7a, 7b, 7d
         7c (1/n) withRouter removed on v5           DONE  9 sites, not 18
         7c (2/n) history prop-drilling removed on v5 DONE  25 components, 30 pass-downs
         7c (3/n) react-router-dom 6.30.6            DONE  nested routes + Outlet
         7a React 18.3.1 + createRoot                DONE  react-redux 7.2.9 alongside
         7b react-redux 9.3.0 + redux 5.0.1          DONE  one type error, not "churn"
         7d (1/n) axios 0.21 -> 1.20                 DONE  changed a wire format
         7d (2/n) immutability-helper 3.1.1          DONE  12 type errors, 3 were real
         7d (3/n) react-tabs 6.1.1                   DONE  needed 7a first
         7d (4/n) jest 30 + ts-jest 29               DONE  transform, not globals
         7d (5/n) concurrently 9, nodemon 3          DONE
         7d (6/n) eslint 9 + flat config             DONE  first setup; 144 findings -> 8c
Phase 8  Post-upgrade pass                       post-upgrade, no version changes
         8a security  8b deploy  8c lint  8d correctness
         8e test debt  8f dead code  8g deferred majors
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
