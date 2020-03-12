# frozen_string_literal: true

require 'test_helper'

class Api::EventLocationsControllerTest < ActionDispatch::IntegrationTest
  test 'Index' do
    api_login
    data = api_get('/api/event_locations')
    exp = [
      { id: 573993628, name: 'CTC Annex, Yaoundé' }, 
      { id: 732769986, name: 'Mbouda' }, 
      { id: 285917836, name: 'Yaoundé' }
    ]
    assert_equal(exp, data)
  end
end
