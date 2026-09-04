require_relative "boot"

# Explicit railties instead of `rails/all`. Two reasons, both Rails 6.0:
#   1. `rails/all` loads Action Text, which autoloads ActionText::ContentHelper
#      and ::TagHelper during initialization. Under Zeitwerk that is deprecated,
#      and config/environments/test.rb raises on deprecations, so `rails/all`
#      makes the whole test suite fail to boot.
#   2. Active Storage, Action Text and Action Mailbox are all unused here --
#      there are no *_blobs/*_attachments tables in db/schema.rb, no
#      has_*_attached, no rich_text, and no app/mailboxes. `rails app:update`
#      generated an Active Storage migration against tables that do not exist,
#      which was discarded.
# Action Cable stays: app/assets/javascripts/cable.js does `//= require
# action_cable`, so dropping it would break asset compilation.
require "active_record/railtie"
require "active_job/railtie"
require "action_controller/railtie"
require "action_view/railtie"
require "action_mailer/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Dulu
  # Values that used to live in config/secrets.yml. `Rails.application.secrets`
  # is removed in Rails 7.1, so they move to the environment. ENV rather than
  # encrypted credentials because config/secrets.yml, config/database.yml and
  # config/initializers/omniauth.rb are already gitignored and Capistrano-
  # symlinked -- the team's model is "secrets live on the server, outside git",
  # and ENV preserves it without adding master.key distribution.
  #
  # **Production deliberately has no fallback.** A missing variable raises at
  # boot, which means it fails during `assets:precompile` before the release is
  # published, rather than leaving `default from:` nil and losing mail in
  # silence -- production.rb sets `raise_delivery_errors = false`, so a bad
  # sender address produces no error anyone would see.
  #
  # Development and test do get a placeholder, and it is inert: both set
  # `action_mailer.delivery_method = :test`, so nothing is ever handed to an
  # SMTP server. A fresh clone needs no setup step for these.
  def self.env_config(name, non_production_default)
    return ENV.fetch(name) if Rails.env.production?

    ENV.fetch(name, non_production_default)
  end

  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.action_mailer.default_url_options = { host: "dulu.sil.org" }

    # Rails.application.secrets is deprecated in Rails 7.1 and removed in 7.2,
    # and merely *having* a `secret_key_base` in config/secrets.yml is enough to
    # trigger the deprecation -- which config/environments/test.rb turns into a
    # boot failure via `deprecation = :raise`. Emptying this path stops Rails
    # reading the file at all, which is what Phase 5b's migration actually
    # meant, rather than depending on every developer remembering to delete a
    # key from a gitignored file.
    #
    # With no secrets.yml in play, secret_key_base resolves the way it should:
    # development and test self-generate a stable one in tmp/local_secret.txt,
    # and production requires SECRET_KEY_BASE in the environment.
    config.paths["config/secrets"] = []

    # Formerly Rails.application.secrets.{smtp_username,smtp_password,admin_email}.
    # `config.x` is an OrderedOptions, so a typo in one of these names reads back
    # as nil rather than raising -- the `ENV.fetch` above is doing all the
    # safety work, not the lookup.
    config.x.smtp_username = Dulu.env_config("SMTP_USERNAME", "dulu_sender@example.com")
    config.x.smtp_password = Dulu.env_config("SMTP_PASSWORD", "placeholder-not-a-password")
    config.x.admin_email = Dulu.env_config("ADMIN_EMAIL", "dulu_sender@example.com")
  end
end
