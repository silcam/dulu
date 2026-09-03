# Dulu Upgrade Plan

**Target:** Rails 8.0 + Ruby 3.4, React 18 + React Router 6, Node 20, Shakapacker
**From:** Rails 5.1.6.2 + Ruby 2.5.0, React 16.8, Node 12.22.6, Webpacker 3.3.1
**Live deploy target:** `config/deploy/production.rb` (Capistrano + Passenger)

### Deploy reality — needs your confirmation before Phase 4

The Capistrano configs do not match the story the hostnames tell, and this affects every
deploy gate in the plan:

| Config | Server | Resolves to | State |
|---|---|---|---|
| `deploy/production.rb` (tracked, *you said this is live*) | `vote` | **192.168.0.18** — LAN address via your `~/.ssh/config` | points at a local machine, not a public host |
| `deploy/testing.rb` (tracked) | `dulu` | 192.168.0.101 — LAN | **dead**: also sets `branch: "testing"`, and no `testing` branch exists in the repo |
| `deploy/amazon.rb` (untracked) | `13.38.125.101` | `ec2-13-38-125-101.eu-west-3.compute.amazonaws.com` — public, resolves | matches your `dulutest` SSH alias (Lightsail, eu-west-3) |

Two consequences baked into this plan:

1. **There is no working staging environment.** `testing.rb` targets a branch that does
   not exist. Every phase gate therefore ends at "tests green + local production-env boot",
   and the risky phases (4 and 5) carry explicit rollback notes instead of "deploy to
   staging first". **If standing up staging is cheap, do it in Phase 0** — it would
   materially de-risk Phases 4, 5, and 6.
2. **Confirm which host actually serves production.** You said `production.rb`, but it
   points at a LAN address while the untracked `amazon.rb` points at a live AWS host. If
   `vote` resolves differently from the production network this is fine; if not, the live
   target is really `amazon.rb` and Phase 0 should commit it. Resolve this before Phase 4,
   because that is the first phase whose correctness can only be proven on the real host.

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
bin/rails test                     # must stay at 396 tests / 1285 assertions, 0 failures
npx jest --ci                      # must stay at 125 passed
yarn test:cypress:gate             # 18 specs / 92 tests -- see note on Electron below
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
```

**Use `test:cypress:gate`, not `test:cypress:run`.** The pre-existing
`test:cypress:run` passes `--browser chrome`. This machine has Chrome 152 while Cypress
is pinned at 4.1.0 (early 2020, contemporary with Chrome 80), and that pairing kills the
browser mid-run: the suite hangs indefinitely with the Rails server still answering in
20ms and no database contention. `test:cypress:gate` uses Cypress' bundled Electron,
which is version-matched and completed the suite reliably every time. Revisit once
Cypress itself is upgraded in Phase 6.

**`git diff db/schema.rb` after every gate run.** `test/helper.rb` line 3 executes
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

## Pre-existing security findings (surfaced, not fixed)

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

The unsafe `constantize` on user-supplied input is worth looking at first. These deserve
their own focused pass, separate from this plan.

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

## Phase 2 — Node 12 → 20 and Webpacker 3 → Shakapacker (joint frontend/backend step)

This is the phase most upgrade plans get wrong by splitting it. It cannot be split:

- **Webpacker is dead.** The gem tops out at 5.4.4 and is retired in Rails 7. Its
  maintained continuation is `shakapacker` (currently 10.3.2). The gem and the npm
  package are version-locked to each other, so `webpacker (3.3.1)` +
  `@rails/webpacker (^3.3.1)` must move together.
- **Node 12 → 20 breaks jest 23 / ts-jest 23** regardless of anything Rails does.
- Rails 7 (Phase 5) *forces* the bundler decision. Doing it here, on the stable Rails 5.2
  footing from Phase 1, means one variable at a time — and Shakapacker only requires
  `railties >= 5.2` and Ruby >= 2.7 (verified against rubygems), both of which Phase 1
  delivers. So this does not need to wait for Rails 6.1.

`nvm` already has Node 20.11.1 and 18.20.8 installed.

**Recommendation: Shakapacker**, not `jsbundling-rails`+esbuild or Vite. Reason: your
webpack config is genuinely small — one pack (`app/javascript/packs/application.js`) and
three appended loaders in `config/webpack/environment.js` (style-loader, CSS modules,
TypeScript). Shakapacker is the continuation of what you already have, so this becomes a
config migration rather than a build-system rewrite. Revisit Vite only if you later want
faster dev rebuilds as a goal in its own right.

Work items:

1. Node 20 + `yarn` lockfile regeneration.
2. `webpacker` → `shakapacker` (gem + `shakapacker` npm package), migrate
   `config/webpacker.yml` → `config/shakapacker.yml`, and rewrite
   `config/webpack/environment.js` to Shakapacker's config API (the
   `environment.loaders.append` style is gone).

   **Do not jump 3.3.1 → 10 in one move.** Shakapacker's documented migration guides
   assume you are coming from Webpacker 5/6, and webpack itself goes 3 → 5 underneath you
   (loader API, `resolve`, and plugin changes at each major). Step it:
   `webpacker 3.3.1 → 4.x → 5.4.4` (5.4.4 is Webpacker's final release and still supports
   Rails 5.2), then `shakapacker 6.x`, then `7 → 8 → 10`. Each step has an upgrade guide
   to follow; a direct leap has none, and you will be debugging webpack 5 breakage and
   Shakapacker config breakage simultaneously with no reference for either.
3. **Replace `typings-for-css-modules-loader`** — unmaintained, and the blocker for
   modern webpack. All 65 CSS imports use the default-import form
   (`import styles from "./Dashboard.css"`), so you do **not** need per-file generated
   typings. Replace the loader with `css-loader`'s built-in `modules` option plus a single
   ambient declaration:

   ```ts
   // app/javascript/types/css.d.ts
   declare module "*.css" {
     const styles: { [className: string]: string };
     export default styles;
   }
   ```

   Then delete the 34 checked-in `*.css.d.ts` files. This is a net simplification, not
   just a swap.
4. Upgrade the JS test chain: `jest` 23 → 29, `ts-jest` 23 → 29, `babel-jest`,
   `typescript` 3.8 → 5.x. Note `setupTestFrameworkScriptFile` in `package.json` is
   removed in modern Jest — it becomes `setupFilesAfterEnv`.
5. **Fix `tsconfig.json`: `"target": "es3"` → `"es2020"`.** ES3 will fight modern
   TypeScript and library typings. Cheap, do it here.
6. Replace `node-sass` if it reappears in the lockfile; move to `sass` (dart-sass).

**Gate:** full recipe green. Pay special attention to Cypress here — this is the phase
most likely to break asset compilation in a way unit tests cannot see. Also verify
`RAILS_ENV=production bin/rails assets:precompile` succeeds, since that is what deploy runs.

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
that there is no working staging environment to rehearse this on (see *Deploy reality*
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

## Sequencing summary

```
Phase 0  Hygiene, Cypress baseline, branch triage, staging?   no version changes
Phase 1  Ruby 2.7 + Rails 5.2                    Ruby moves once, covers 4 hops
Phase 2  Node 20 + Shakapacker + Jest/TS      <- joint frontend/backend step
Phase 3  Rails 6.0 -> 6.1 (Zeitwerk) + audited 5
Phase 4  OmniAuth 2                              auth risk; manual browser gate
Phase 5  Ruby 3.1 + secrets -> ENV + Rails 7.0 -> 7.1        deploy-affecting
Phase 6  Ruby 3.4 + Rails 7.2 -> 8.0 + Cypress/cypress-on-rails
Phase 7  React 18 -> react-redux 9 -> React Router 6   independent; router is the big one
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
   gate required, with no staging environment to rehearse on.
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
