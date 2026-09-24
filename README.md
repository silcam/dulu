# README

## Warning
The Readme is still a work in progress. It actually won't get you very far, because there's a lot of seed data you need to get going, and I don't have that in a useful format right now. So if you're trying to setup Dulu for whatever reason, let me know so I can help you out.

## For Development

### Prerequisites
* [Ruby](https://www.ruby-lang.org/en/downloads/) — rbenv, version as pinned in
  `.ruby-version` (currently 3.4.9). `Capfile` pins the same version for deploys, so the
  two must be changed together.
* [Node.js](https://nodejs.org/) — version as pinned in `.nvmrc` (currently 20.20.2). With
  nvm: `nvm install && nvm use`.
* **Yarn Classic**, via corepack: run `corepack enable` once after installing Node. nvm's
  Node 20.20.2 ships `corepack` but no `yarn` shim, so without this there is no `yarn` on
  your `PATH`. The `packageManager` field in `package.json` then pins Yarn to 1.22.22 —
  do not run Yarn 2+ against this repo, it will rewrite the v1 lockfile.
* [PostGreSQL](https://www.postgresql.org/)

### Setup
1. Clone the repo.
    ```shell
    git clone https://github.com/silcam/dulu.git
    ```

1. Create databases dulu_dev and dulu_test. See database.yml for the username and password to use.
   
    ```shell
    rails db:create
    ```
   
   Note: if you also need to drop the db, you can first run

    ```shell
    rails db:drop (if necessary)
    ```

1. Install bundler if you don't already have it

    ```shell
    gem install bundler
    ```

1. Install the necessary gems

    ```shell
    bundle install
    ```

1. yarn install

    ```shell
    yarn install
    ````

   If you don't have it, install [yarn](https://classic.yarnpkg.com/) first.

1. Initialize the development database by loading the schema

    ```shell
    rails db:schema:load
    ```

### Running the Tests

If you just want to run the tests, you can after a few more steps. The test database does not need to be seeded.

Nothing to set up: the mail identities that used to require a hand-edited
`secrets.yml` entry now come from the environment (`SMTP_USERNAME`,
`SMTP_PASSWORD`, `ADMIN_EMAIL`) and fall back to placeholders outside
production. Development and test both use `action_mailer.delivery_method =
:test`, so the placeholders never reach a mail server. Set the variables only if
you want to send real mail from a local server. **Production has no fallback** —
a missing variable raises at boot, on purpose. See `config/application.rb`.

1. Run tests.

   See the definitions in `package.json` for the different testing options. `yarn test:most`
   runs the Rails unit tests and the Jest tests.

   For the end-to-end suite use **`yarn test:cypress:gate`**. It precompiles the test
   packs first, which `test:cypress:run` does not — without that the first `cy.visit()`
   of a run waits for webpack and can time out. Both run under Cypress' own bundled
   Electron; neither passes `--browser chrome` any more.

   Make sure port 3002 is free first (`ss -ltn | grep 3002`) — a leftover Puma there
   either makes the run test stale code or stops the test server binding at all. Note its
   process title is rewritten to `puma ... [dulu]`, so `pkill -f "rails server"` will not
   match it; find it by port.

   Config lives in **`spec/cypress.config.js`**, specs in `spec/cypress/e2e/`. Two
   settings there are load-bearing and should not be "tidied": the raised timeouts (see
   the comment in that file) and `testIsolation: false`, without which specs that build on
   the page the previous test left behind fail.

   On a loaded machine expect roughly one spec per two runs to fail on timing — usually a
   search picker or the new-user dashboard in `people.spec.js`. Check `/proc/loadavg` and
   re-run before treating it as a regression; `UPGRADE_PLAN.md` has the triage note.

   `yarn typecheck` runs the TypeScript check on its own. The webpack build type-checks
   too, but this is faster and is part of the upgrade gate.
   

### Starting the Server

If you want to start the server to run this in a web browser, you need a few more steps.

1. You need to set up an omni auth config in `./config/initializers/omniauth.rb`. You can see the [Omniauth](https://github.com/omniauth/omniauth) documentation for how to do this.

1. You need to seed the database.
    
    ```shell
    rails db:seed RAILS_ENV=development
    ```

    This will insert some default data and create an admin user for you. Use one of your Google accounts.
    
1. Start the Server

    ```shell
    foreman s
    ```

1. Access Dulu at [http://localhost:3000](http://localhost:3000)
