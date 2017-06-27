require 'test_helper'

class LoginTests < Capybara::Rails::TestCase
  def setup
    @auth_user = people(:Rick)
    @unauth_user = people(:Abanda)
  end

  test "valid user logs in" do
    simulate_oauth(@auth_user)
    visit root_path
    click_link('google-signin-link')
    assert page.has_content?(@auth_user.first_name), "Expect to see user's first name"
    click_link('Log out')
    assert_current_path root_path
    assert page.must_have_selector('#google-signin-link'), "Expect to see log in button"
  end

  test "invalid log in" do
    simulate_oauth @unauth_user
    visit root_path
    click_link 'google-signin-link'
    assert_current_path root_path
    assert page.must_have_selector('#error-explanation'), "Expect to see error message for failed log in"
  end

  test "login redirect" do
    simulate_oauth @auth_user
    visit '/organizations'
    assert_current_path '/organizations'
  end
end
