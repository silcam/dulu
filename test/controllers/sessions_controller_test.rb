require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get sessions_new_url
    assert_response :success
  end

  test "should redirect to login" do
    get root_url
    assert_redirected_to login_path
    get people_path
    assert_redirected_to login_path
  end
end
