source "https://rubygems.org"

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "rails", "~> 5.1.6.2"
# Be Awesome
# gem 'bootsnap', require: false
# Use postgres as the database for Active Record
gem "pg"
# Use Puma as the app server
# gem 'puma', '~> 3.0'
# Use SCSS for stylesheets
gem "sass-rails", "~> 5.0"
# Use Uglifier as compressor for JavaScript assets
gem "uglifier", ">= 1.3.0"
# Use CoffeeScript for .coffee assets and views
# gem 'coffee-rails', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use Webpacker
gem "webpacker"
# Use jquery as the JavaScript library
# gem 'jquery-rails'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
# gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem "jbuilder", "~> 2.5"
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Internationalization
gem "rails-i18n", "~> 5.0.4"
# Google authentication
gem "omniauth-google-oauth2", "~> 0.5"
# User roles
gem "access-granted", "~> 1.2.0"
# Activity Log
gem "audited", "~> 4.5"
# xlsx Export
# gem 'rubyzip', '>= 1.2.1'
# gem 'axlsx', git: 'https://github.com/randym/axlsx.git', ref: '776037c0fc799bb09da8c9ea47980bd3bf296874'
# gem 'axlsx_rails', '~> 0.5'
# Pagination
# gem 'kaminari', '~> 1.1'
# Delayed Job for background jobs
gem "delayed_job_active_record", "~> 4.1"
gem "daemons", "~> 1.2"
gem "delayed_job_recurring"

group :development, :test do
  gem "puma", "~>3.12"
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

  gem "debase"
  gem "ruby-debug-ide"
  gem "rufo"
end

group :test do
  gem "minitest-reporters"
  gem "minitest-rails-capybara"
  gem "selenium-webdriver"
  gem "brakeman", require: false
  gem "minitest-retry"
  gem 'cypress-on-rails'
end
