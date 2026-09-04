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
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    config.action_mailer.default_url_options = { host: "dulu.sil.org" }
  end
end
