begin
  `rails db:migrate`
rescue
  `rails db:schema:load`
end

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'minitest/reporters'
require 'minitest/rails/capybara'
Minitest::Reporters.use!

Delayed::Worker.delay_jobs = false

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

  # Requires Javascript
  def log_out
    click_on 'show-user-menu'
    click_link_to logout_path
  end

  def model_validation_hack_test(model, params)
    params.each_key do |param|
      test_params = params.clone
      test_params.delete(param)
      shouldnt_save = model.new(test_params)
      refute shouldnt_save.save, "Should not save #{model} without #{param}"
    end
    should_save = model.new(params)
    assert should_save.save, "Should save #{model} with valid params"
  end

  def postpone_failure(date, message="Maybe test this now?")
    assert Date.today < date, message
  end
end
