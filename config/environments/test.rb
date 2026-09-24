Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # The test environment is used exclusively to run your application's
  # test suite. You never need to work with it otherwise. Remember that
  # your test database is "scratch space" for the test suite and is wiped
  # and recreated between test runs. Don't rely on the data there!
  config.cache_classes = ENV['CI'].present?

  # Do not eager load code on boot. This avoids loading your whole application
  # just for the purpose of running a single test. If you are using a tool that
  # preloads Rails for running tests, you may have to set it to true.
  config.eager_load = false

  # Configure public file server for tests with Cache-Control for performance.
  config.public_file_server.enabled = true
  config.public_file_server.headers = {
    "Cache-Control" => "public, max-age=#{1.hour.seconds.to_i}",
  }

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false

  # Raise exceptions instead of rendering exception templates.
  config.action_dispatch.show_exceptions = false

  # Disable request forgery protection in test environment.
  config.action_controller.allow_forgery_protection = false
  config.action_mailer.perform_caching = false

  # Tell Action Mailer not to deliver emails to the real world.
  # The :test delivery method accumulates sent emails in the
  # ActionMailer::Base.deliveries array.
  config.action_mailer.delivery_method = :test

  # Raise on deprecation notices rather than printing them.
  # Set during the Rails 8 upgrade (see UPGRADE_PLAN.md): this converts each Rails
  # version's deprecation warnings into test failures at the hop that introduces them,
  # instead of letting them scroll past and become hard errors two versions later.
  config.active_support.deprecation = :raise

  # Raises error for missing translations
  # Renamed in Rails 6.1 (action_view.* removed in 7.0). Note this is not a
  # pure rename: i18n.raise_on_missing_translations also covers translations
  # looked up from controllers, not just views, so it is strictly stricter.
  config.i18n.raise_on_missing_translations = true

  # Log to log/test.log rather than discarding output. `Logger.new(nil)` made
  # `bin/rails test` marginally faster, but it also meant the Cypress failure-capture
  # hook (spec/cypress/app_commands/log_fail.rb) had nothing to capture: every failing
  # E2E test wrote a file containing whatever stale bytes were already in log/test.log.
  # Diagnosing an intermittent E2E failure without the server side of the story is
  # guesswork, and this upgrade spent several runs doing exactly that. See UPGRADE_PLAN.md
  # Phase 2. Keep the level at :info -- :debug logs every SQL statement and makes the file
  # unreadable.
  config.logger = ActiveSupport::Logger.new(Rails.root.join("log", "test.log"))
  config.log_level = :info
end
