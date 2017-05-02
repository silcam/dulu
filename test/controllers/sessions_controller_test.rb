require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest

  test "should redirect to login" do
    get root_url
    assert_redirected_to login_path
    get people_path
    assert_redirected_to login_path
    get organizations_path
    assert_redirected_to login_path
  end
end
