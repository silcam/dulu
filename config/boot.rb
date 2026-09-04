ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.
# require 'bootsnap/setup'

# concurrent-ruby 1.3.5 dropped its transitive `require "logger"`, which
# ActiveSupport <= 7.0 relied on: without this, activesupport/logger.rb raises
# `uninitialized constant ActiveSupport::LoggerThreadSafeLevel::Logger` before
# the app can boot at all. Rails 7.1 requires logger itself, so drop this line
# in Phase 5c. The alternative -- pinning concurrent-ruby < 1.3.5 -- would have
# to be carried just as far and holds back an unrelated gem.
require 'logger'
