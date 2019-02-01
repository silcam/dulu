require "application_system_test_case"

class LoginsTest < ApplicationSystemTestCase
  def setup
    @auth_user = people(:Rick)
    @unauth_user = people(:Abanda)
  end

  test "valid user logs in" do
    log_in(@auth_user) # Ensure that nobody is logged in by trying to log-in invalid user
    click_on('Logout')
    assert_selector '#google-signin-link'

    click_link('google-signin-link')
    assert page.has_content?(@auth_user.first_name), "Expect to see user's first name"

    click_on('Logout')
    assert_current_path root_path
    assert_selector '#google-signin-link'
  end

  test "invalid log in" do
    simulate_oauth @unauth_user
    visit root_path
    click_link 'google-signin-link'
    assert_current_path root_path
    assert page.must_have_selector('.red'), "Expect to see error message for failed log in"
  end

  test "login redirect" do
    simulate_oauth @auth_user
    visit '/organizations'
    assert_current_path '/organizations'
  end
end
