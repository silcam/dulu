# frozen_string_literal: true

require 'test_helper'

class SessionsControllerTest < ActionDispatch::IntegrationTest
  def simulate_oauth(email)
    OmniAuth.config.test_mode = true
    OmniAuth.config.add_mock(:google_oauth2, info: { email: email })
  end

  test '/login' do
    get '/login'
    assert_redirected_to '/auth/google_oauth2'
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
    get '/people'
    assert_redirected_to '/auth/google_oauth2'
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
    assert_redirected_to '/auth/google_oauth2'
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
