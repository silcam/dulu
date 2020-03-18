# frozen_string_literal: true

require 'test_helper'

class CountriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @cameroon = countries :Cameroon
  end

  test 'Search' do
    api_login
    data = api_get('/api/countries/search?q=cam')
    assert_equal({ results: [{ id: @cameroon.id, name: 'Cameroon' }] }, data)
  end
end
