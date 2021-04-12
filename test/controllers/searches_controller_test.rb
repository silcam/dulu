# frozen_string_literal: true
require 'test_helper'

class SearchesControllerTest < ActionDispatch::IntegrationTest
  test 'Search' do
    api_login
    data = api_get('/api/search?q=dre')
    assert_equal(
      {
        results: [
          { title: 'Andreas Everest', description: 'Language Program Facilitator', route: '/people/463209896', subresults: { results: [] } },
          { title: 'Drew Mambo', description: 'Translation Consultant', route: '/people/883742519', subresults: { results: [{ title: 'Hdi', description: 'Translation Consultant', route: '/languages/876048951' }, { title: 'Ndop Cluster', description: 'Translation Consultant', route: '/clusters/657561020' }] } }
        ]
      },
      data
    )
  end

  test 'Search in FR locale' do
    api_login(people(:JohnCarlos))
    data = api_get('/api/search?q=dre')
    assert_equal(
      {
        results: [
          { title: 'Andreas Everest', description: 'Facilitateur du programme de langue', route: '/people/463209896', subresults: { results: [] } },
          { title: 'Drew Mambo', description: 'Conseiller en traduction', route: '/people/883742519', subresults: { results: [{ title: 'Hdi', description: 'Conseiller en traduction', route: '/languages/876048951' }, { title: 'Groupe Ndop', description: 'Conseiller en traduction', route: '/clusters/657561020' }] } }
        ]
      },
      data
    )
  end

  test 'Search langprog in FR locale' do
    api_login(people(:JohnCarlos))
    data = api_get('/api/search?q=hdi')
    Rails.logger.fatal(data.inspect)
    assert_equal("Hdi", data[:results][0][:title])
    assert_match(/^Programme de langue/, data[:results][0][:description])
  end
end
