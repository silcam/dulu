begin
  `rails db:migrate`
rescue
  `rails db:schema:load`
end

require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"
require "minitest/reporters"
require "minitest/rails/capybara"
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
    post(path, xhr: true, params: params)
    response_body
  end

  def api_put(path, params)
    put(path, xhr: true, params: params)
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

  def assert_partial(exp, actual)
    if exp.is_a? Hash
      exp.each_pair do |key, val|
        if val.nil?
          assert_nil actual[key]
        else
          assert_equal val, actual[key]
        end
      end
    elsif exp.is_a? Array
      exp.each do |val|
        assert_includes actual, val
      end
    else
      raise "Expected Hash or Array to be supplied to assert_partial. Received #{exp.class}."
    end
  end
end
