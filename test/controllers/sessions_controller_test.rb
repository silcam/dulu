require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest

  test "should redirect to login" do

    get people_path
    assert_redirected_to 'http://www.example.com/auth/google_oauth2'

  end
end
