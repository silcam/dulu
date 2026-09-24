# README

## Warning
The Readme is very basic. It actually won't get you very far, because there's a lot of seed
data you need to get going, and I don't have that in a useful format right now. So if you're
trying to setup Dulu for whatever reason, let me know so I can help you out.

## For Development

### Prerequisites
* [Ruby](https://www.ruby-lang.org/en/downloads/) — Recommended to use `rbenv`. The version is
  pinned in `.ruby-version` (currently set to 3.4.9). `Capfile` pins the same version for
  deploys, so the two must be changed together.
* [Node.js](https://nodejs.org/). Recommended to use `nvm`. The version as pinned in `.nvmrc`
  (currently 20.20.2). With nvm: `nvm install && nvm use`.
* **Yarn Classic**, via corepack: run `corepack enable` once after installing Node. Node
  20.20.2 ships `corepack` so after `corepack enable` yarn will download the correct version
  on first use, which is pinned to Yarn classic.
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

1. Initialize the development database by loading the schema

    ```shell
    rails db:schema:load
    ```

### Running the Tests

If you just want to run the tests, you can after a few more steps. The test database does not need to be seeded.

Development and test both use `action_mailer.delivery_method = :test`.

1. Run tests.

   See the definitions in `package.json` for the different testing options. `yarn test:most`
   runs the Rails unit tests and the Jest tests.

   For the end-to-end suite use **`yarn test:cypress:gate`**. Make sure port 3002 is free.

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
