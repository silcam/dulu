require 'test_helper'

class SuccesfulLoginTest < ActionDispatch::IntegrationTest
  def setup
    @jiminy = people(:jiminy)
    @pinochio = people(:pinochio)
  end

  test "valid user login and logout" do
    get login_path
    post login_path, params: { session: { email: @jiminy.email}}
    assert_redirected_to root_path
    follow_redirect!
    assert_equal @jiminy, Person.find_by(id: session[:user_id])
    delete logout_path
    assert_redirected_to login_path 
    assert_not is_logged_in
  end

  test "invalid user login" do
    get login_path
    post login_path, params: { session: {email: @pinochio.email}}
    assert_response :success #means we're still on the login page
    #assert_select  #TODO - check for error message
  end
end
