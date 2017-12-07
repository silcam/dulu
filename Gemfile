source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.0.2'
# Use postgres as the database for Active Record
gem 'pg'
# Use Puma as the app server
# gem 'puma', '~> 3.0'
# Use SCSS for stylesheets
gem 'bootstrap-sass', '~>3.3.7'
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.2'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes navigating your web application faster. Read more: https://github.com/turbolinks/turbolinks
gem 'turbolinks', '~> 5'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'
# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Internationalization
gem 'rails-i18n', '~> 5.0.4'
# Google authentication
gem 'omniauth-google-oauth2', '~> 0.5.0'
# User roles
gem 'access-granted', '~> 1.2.0'
# Activity Log
gem 'audited', '~> 4.5'
# xlsx Export
gem 'axlsx', '~> 2.0.1'
gem 'axlsx_rails', '~> 0.5.1'

group :development, :test do
  gem 'puma', '~>3.0'
end

group :development do
  gem 'capistrano'
  gem 'capistrano-rails'
  gem 'capistrano-rbenv'
  gem 'capistrano-passenger'
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  # Windows does not include zoneinfo files, so bundle the tzinfo-data gem
  gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
end

group :test do
  gem 'minitest-reporters'
  gem 'minitest-rails-capybara'
  gem 'selenium-webdriver'
  gem 'brakeman', require: false
  gem 'win32console', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
end
