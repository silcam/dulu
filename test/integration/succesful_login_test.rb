require 'test_helper'

class SuccesfulLoginTest < Capybara::Rails::TestCase
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

  # test "valid user login and logout" do
  #   get login_path
  #   post login_path, params: { session: { email: @jiminy.email}}
  #   assert_redirected_to root_path
  #   follow_redirect!
  #   assert_equal @jiminy, Person.find_by(id: session[:user_id])
  #   delete logout_path
  #   assert_redirected_to login_path
  #   assert_not is_logged_in
  # end
  #
  # test "invalid user login" do
  #   get login_path
  #   post login_path, params: { session: {email: @pinochio.email}}
  #   assert_response :success #means we're still on the login page
  #   #assert_select  #TODO - check for error message
  # end
end
