ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/reporters'
require 'minitest/rails/capybara'

Minitest::Reporters.use!


class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def is_logged_in
    !session[:user_id].nil?
  end

  def log_in_jiminy
    jiminy = people(:jiminy)
    get login_path
    post login_path, params: { session: { email: jiminy.email}}
  end
end
