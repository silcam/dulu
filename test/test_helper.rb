# frozen_string_literal: true

`rails db:migrate`

require File.expand_path('../config/environment', __dir__)
require 'rails/test_help'
require 'minitest/reporters'
require 'minitest/rails/capybara'
Minitest::Reporters.use!

Delayed::Worker.delay_jobs = false

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

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

  def api_login(user = people(:Drew))
    post('/test-login', params: { id: user.id })
  end

  def api_get(path)
    get(path, xhr: true)
    response_body
  end

  def api_post(path, params)
    post(path, params: params, as: :json)
    response_body
  end

  def api_put(path, params)
    put(path, params: params, as: :json)
    response_body
  end

  def api_delete(path)
    delete(path, xhr: true)
    response_body
  end

  def response_body
    JSON.parse(@response.body, symbolize_names: true)
  rescue JSON::ParserError
    @response.body
  end

  def assert_not_allowed
    assert_response 401
  end

  def assert_partial(exp, actual, no_assert = false)
    if exp.is_a? Hash
      exp.each_pair do |key, val|
        if val.nil?
          assert_nil actual[key]
        else
          assert_partial val, actual[key]
        end
      end
    elsif exp.is_a? Array
      exp.each do |exp_val|
        assert(actual.any? { |act_val| assert_partial(exp_val, act_val, true) }, "Could not find exp_val in actual:\n - exp_val: #{exp_val}\n - actual: #{actual}")
      end
    else
      assert_equal exp, actual
    end
  rescue Minitest::Assertion => e
    return false if no_assert

    raise e
  end
end
