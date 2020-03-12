# frozen_string_literal: true

require 'test_helper'

class DsiLocationsControllerTest < ActionDispatch::IntegrationTest
  test 'Index' do
    api_login
    data = api_get('/api/dsi_locations')
    exp = [{ id: 5961386, name: 'CMB Library' }, { id: 874018992, name: 'REAP' }]
    assert_equal(exp, data)
  end
end
