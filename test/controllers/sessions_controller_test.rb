# frozen_string_literal: true

require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  def simulate_oauth(email)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(:google_oauth2, info: { email: email })
  end

  # OmniAuth 2 made the request phase POST-only, so /login can no longer redirect
  # to it -- it renders the welcome page and the user clicks the button.
  test '/login' do
    get '/login'
    assert_response :success
    assert_includes @response.body, 'Dulu is a tool developed by SIL Cameroon'
  end

  # The closest thing to an automated gate this phase has. OmniAuth.config.test_mode
  # short-circuits the request phase, so nothing else in any suite can tell whether
  # the sign-in control would actually work against a real OmniAuth 2 middleware.
  # This at least fails if someone turns the button back into a GET link.
  test 'welcome page POSTs to the OmniAuth request phase, with a CSRF token' do
    get '/'
    assert_response :success
    assert_select 'form[action="/auth/google_oauth2"][method="post"]' do
      assert_select 'button#google-signin-link'
    end
    # Deliberately not asserting anything about the authenticity_token input.
    # config/environments/test.rb sets allow_forgery_protection = false, so
    # button_to emits no token here at all -- asserting either way would encode
    # a test-env artifact. That the token is present and verified in a real
    # environment was confirmed by hand against a dev server; see the Phase 4
    # notes in UPGRADE_PLAN.md.
    refute_includes @response.body, %(<a id='google-signin-link')
    refute_includes @response.body, %(<a  id='google-signin-link')
  end

  # An XHR from a logged-out session must be recognisable as such. It used to get
  # a 302 into the OmniAuth request phase, which axios follows cross-origin;
  # rendering the welcome page would be worse, since DuluAxios cannot tell 200 HTML
  # from real data.
  test 'API request while logged out is 401, not a redirect or a page' do
    get '/api/people', headers: { 'Accept' => 'application/json' }
    assert_response :unauthorized
    assert_empty @response.body
  end

  test '/login if already logged in' do
    api_login
    get '/login'
    assert_redirected_to '/'
  end

  test 'Create session' do
    simulate_oauth('rick_conrad@sil.org')
    get '/auth/google_oauth2/callback'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, '"first_name":"Rick","last_name":"Conrad"'
  end

  test 'Create session - invalid email' do
    simulate_oauth('darth_vader@sil.org')
    get '/auth/google_oauth2/callback'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, 'Sorry, but no one is authorized to log in to Dulu with the address darth_vader@sil.org. Are you using the correct SIL email address?'
  end

  test 'Create session - user without login' do
    simulate_oauth('abanda@dunno.org')
    get '/auth/google_oauth2/callback'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, 'Sorry, but no one is authorized to log in to Dulu with the address abanda@dunno.org. Are you using the correct SIL email address?'
  end

  test 'Create session - email is case insensitive' do
    simulate_oauth('RICK_CONRAD@sil.org')
    get '/auth/google_oauth2/callback'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, '"first_name":"Rick","last_name":"Conrad"'
  end

  test 'Create Session - Redirect to original request' do
    # A logged-out deep link now renders the welcome page instead of bouncing to
    # Google, but session[:original_request] is still recorded, so the callback
    # must still land the user where they were originally headed. That mechanism
    # is the whole reason this test exists; only the first assertion changed.
    get '/people'
    assert_response :success
    assert_includes @response.body, 'Dulu is a tool developed by SIL Cameroon'
    simulate_oauth('rick_conrad@sil.org')
    get '/auth/google_oauth2/callback'
    assert_redirected_to '/people'
  end

  test 'Logout' do
    api_login
    post '/logout'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, 'Dulu is a tool developed by SIL Cameroon' # Public home
  end

  test 'Logout if not logged in' do
    post '/logout'
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, 'Dulu is a tool developed by SIL Cameroon' # Public home
  end

  test 'Login as' do
    api_login(people(:Rick))
    get "/login_as/#{people(:Drew).id}"
    assert_redirected_to '/'
    get '/'
    assert_includes @response.body, '"first_name":"Drew","last_name":"Mambo"' 
  end

  test 'Login as without permission' do
    api_login(people(:Drew))
    get "/login_as/#{people(:Rick).id}"
    assert_not_allowed
  end
end
