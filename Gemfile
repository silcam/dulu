source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 8.0.0"
# Be Awesome
# gem 'bootsnap', require: false
# Use postgres as the database for Active Record
gem "pg"
# Use Puma as the app server
# gem 'puma', '~> 3.0'
# Use SCSS for stylesheets. sass-rails 6 is a thin wrapper over sassc-rails
# (libsass); the Ruby `sass` gem it used to pull in is EOL. Sprockets is still
# live here -- app/views/layouts/application.html.erb links application.css,
# which require_tree's the .scss files -- so this is not a dead dependency.
gem "sass-rails", "~> 6.0"
# Sprockets 4. Rails 7 requires it, so it is not optional for long; done here
# on its own so an asset regression is attributable to it and not to Zeitwerk.
gem "sprockets", "~> 4.0"
# Terser, not Uglifier, as the Sprockets JS compressor. Rails 7's actioncable
# ships an ES6 asset (classes, arrows, template literals, spread), and
# Uglifier 4 cannot parse it -- `assets:precompile RAILS_ENV=production` dies
# with `Unexpected token: punc ((). To use ES6 syntax, harmony mode must be
# enabled`. Uglifier's harmony mode would also work, but terser is Rails 7's
# own default and does not need the flag.
gem "terser", "~> 1.2"
# Use CoffeeScript for .coffee assets and views
# gem 'coffee-rails', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Shakapacker, the maintained continuation of Webpacker (which ended at 5.4.4).
# Current release. The 6 -> 10 hop is mostly renames on a stable webpack 5
# (UPGRADE_PLAN.md Phase 2c).
gem "shakapacker", "~> 10.3.2"
# Use jquery as the JavaScript library
# gem 'jquery-rails'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# 2.7 registers a single-arity template handler, which Rails 6.0 deprecates --
# and test.rb raises on deprecations, so it blocks boot. 2.11 takes (template, source).
gem "jbuilder", "~> 2.11"
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Internationalization. The major version tracks Rails: rails-i18n caps
# railties at `< N+1`, so this must be bumped in lockstep with every Rails hop
# or version solving fails outright.
gem "rails-i18n", "~> 8.0"
# Google authentication. omniauth-google-oauth2 1.x requires OmniAuth 2, so the
# two move together. OmniAuth 2 makes the *request* phase POST-only as a CSRF
# fix, which omniauth-rails_csrf_protection supplies the token verification for.
# Never set OmniAuth.config.allowed_request_methods to include :get -- that is
# the top search result for the resulting error and it re-opens the exact hole
# this version bump exists to close. A surviving GET path is a missed call site.
gem "omniauth-google-oauth2", "~> 1.2"
gem "omniauth-rails_csrf_protection", "~> 1.0"
# User roles
gem "access-granted", "~> 1.2.0"
# Activity Log
gem "audited", "~> 5.8"
# xlsx Export
# gem 'rubyzip', '>= 1.2.1'
# gem 'axlsx', git: 'https://github.com/randym/axlsx.git', ref: '776037c0fc799bb09da8c9ea47980bd3bf296874'
# gem 'axlsx_rails', '~> 0.5'
# Pagination
# gem 'kaminari', '~> 1.1'
# Delayed Job for background jobs
gem "delayed_job", "~> 4.2"
gem "delayed_job_active_record", "~> 4.1"
gem "daemons", "~> 1.2"
gem "delayed_job_recurring"

group :development, :test do
  gem "puma", "~>4.3"
end

group :development do
  gem "capistrano"
  gem "capistrano-rails"
  gem "capistrano-rbenv"
  gem "capistrano-passenger"
  # foreman 0.64 calls File.exists?, removed in Ruby 3.4, so `foreman s` -- the
  # documented way to run this app -- dies before reading the Procfile.
  gem "foreman", "~> 0.90"
  gem "rubocop"
  # gem 'capistrano-yarn'

  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem "web-console", ">= 3.3.0"
  # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
  # gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
  gem "listen"

  # `debug` (ruby/debug), not debase + ruby-debug-ide. Both of those are
  # unmaintained and, as predicted, debase does not survive Ruby 3.4: its
  # debase-ruby_core_source dependency fails to install outright. `debug` is
  # the maintained successor, ships in Ruby 3.1+ as a default gem, and is what
  # the VS Code rdbg extension drives -- .vscode/launch.json was migrated from
  # `"type": "Ruby"` to `"type": "rdbg"` in the same commit.
  gem "debug", require: false
  gem "rufo"
end

group :test do
  gem "minitest-reporters"
  # minitest 6 dropped minitest/mock.rb -- its own History.rdoc says "extracted
  # to the minitest-mock gem". test_helper.rb requires it for Object#stub, which
  # the notification and report tests use to freeze Time/Date.
  gem "minitest-mock"
  # Capybara backs ActionDispatch::SystemTestCase (test/system). Previously this
  # came in transitively via minitest-rails-capybara, which is unmaintained and
  # broke on minitest 5.26 (Minitest::Metadata was removed). Its only consumers
  # were two integration test files with zero live tests, now deleted, so it is
  # replaced by a direct capybara dependency.
  # Rails 6.1's ActionDispatch::SystemTestCase requires capybara >= 3.26, so
  # this is not optional from Phase 3 on -- 2.18.0 makes test/system fail to
  # load outright. Note `bin/rails test` does not run test/system, so the gate
  # does not cover this; see the Phase 3 notes.
  gem "capybara", "~> 3.40"
  gem "selenium-webdriver", "~> 4.9"
  # 4.2.0 crashed outright on Ruby 2.7: its vendored unicode-display_width calls
  # Gem.gunzip, which no longer exists, so brakeman exited 0 with no output --
  # a silently useless security gate. 5.4.x was the Ruby 2.7 ceiling; Ruby 3.1
  # lifts it.
  gem "brakeman", "~> 7.0", require: false
  gem "minitest-retry"
  # >= 1.17 is not optional on Ruby 3.4: 1.5.1's middleware calls File.exists?,
  # removed in Ruby 3.4, so every app_command 500s and all 19 Cypress specs
  # fail in their before hooks.
  gem "cypress-on-rails", "~> 1.20"
end
