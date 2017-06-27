ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/reporters'
require 'minitest/rails/capybara'


Minitest::Reporters.use!


class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def simulate_oauth(user)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(:google_oauth2, {info: {email: user.email}})
  end

  def log_in(user)
    simulate_oauth user
    visit '/auth/google_oauth2'
  end
end
