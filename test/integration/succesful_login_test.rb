require 'test_helper'
include SessionsHelper

class SuccesfulLoginTest < ActionDispatch::IntegrationTest
  def setup
    @jiminy = people(:jiminy)
    @pinochio = people(:pinochio)
  end

  test "valid user login" do
    get login_path
    post login_path, params: { session: { email: @jiminy.email}}
    assert_redirected_to people_path  #for now
    follow_redirect!
    assert_equal @jiminy, current_user
  end

  test "invalid user login" do
    get login_path
    post login_path, params: { session: {email: @pinochio.email}}
    assert_response :success #means we're still on the login page
    #assert_select  #TODO - check for error message
  end
end
