source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 6.1.0"
# Be Awesome
# gem 'bootsnap', require: false
# Use postgres as the database for Active Record
gem "pg"
# Transitive, pinned only for Ruby 2.7 compatibility: nokogiri >= 1.16 requires
# Ruby >= 3.0, and bundler otherwise resolves capybara/xpath to a nokogiri that
# cannot install here. Drop this pin once Ruby 3.1 lands in Phase 5.
gem "nokogiri", "~> 1.15.7"
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
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"
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
# Internationalization
gem "rails-i18n", "~> 6.0"
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
# delayed_job 4.2 requires ActiveJob::QueueAdapters::AbstractAdapter, which only
# exists in Rails 7.1+. Held at the 4.1 line until Phase 5 reaches Rails 7.1;
# without this the production environment fails to boot (it is the only env that
# sets active_job.queue_adapter = :delayed_job).
gem "delayed_job", "~> 4.1.11"
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
  gem "foreman"
  gem "rubocop"
  # gem 'capistrano-yarn'

  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem "web-console", ">= 3.3.0"
  # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
  # gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
  gem "listen"

  # Pinned to versions that build on Ruby 2.7+. debase 0.2.2 could not compile
  # its native extension against Ruby 2.7 core headers. The .vscode/launch.json
  # "Listen for rdebug-ide" configuration depends on these, so they are upgraded
  # rather than dropped. Note: debase is effectively unmaintained and will not
  # build on Ruby 3.4 -- plan to replace it with the `debug` gem in Phase 6.
  gem "debase", "~> 0.2.9"
  gem "ruby-debug-ide", "~> 0.7.5"
  gem "rufo"
end

group :test do
  gem "minitest-reporters"
  # Capybara backs ActionDispatch::SystemTestCase (test/system). Previously this
  # came in transitively via minitest-rails-capybara, which is unmaintained and
  # broke on minitest 5.26 (Minitest::Metadata was removed). Its only consumers
  # were two integration test files with zero live tests, now deleted, so it is
  # replaced by a direct capybara dependency.
  # Rails 6.1's ActionDispatch::SystemTestCase requires capybara >= 3.26, so
  # this is not optional from Phase 3 on -- 2.18.0 makes test/system fail to
  # load outright. Note `bin/rails test` does not run test/system, so the gate
  # does not cover this; see the Phase 3 notes.
  gem "capybara", "~> 3.39.0"
  gem "selenium-webdriver", "~> 4.9"
  # brakeman 6+ requires Ruby >= 3.0, so 5.4.x is the ceiling while on Ruby 2.7.
  # 4.2.0 crashed outright on Ruby 2.7: its vendored unicode-display_width calls
  # Gem.gunzip, which no longer exists, so brakeman exited 0 with no output --
  # a silently useless security gate. Raise this to ~> 7.0 in Phase 5 with Ruby 3.1.
  gem "brakeman", "~> 5.4", require: false
  gem "minitest-retry"
  gem 'cypress-on-rails'
end
