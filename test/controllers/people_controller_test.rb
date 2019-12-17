# frozen_string_literal: true

require 'test_helper'

class PeopleControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people(:Drew)
    @rick = people(:Rick)
    @lance = people(:Lance)
    @kendall = people(:Kendall)
    @kevin = people(:Kevin)
  end
  
  def people_path(rest = '')
    "/api/people#{rest}"
  end

  test 'Index' do
    api_login @drew
    data = api_get(people_path)
    assert_equal({ create: true }, data[:can])
    assert_equal(
      { id: @lance.id, first_name: 'Lance', last_name: 'Armstrong', has_login: true }, 
      data[:people].first
    )
  end

  test 'Index permissions' do
    api_login @kevin
    data = api_get(people_path)
    assert_equal({ create: false }, data[:can])
  end

  test 'Show' do
    api_login @drew
    data = api_get(people_path("/#{@kendall.id}"))
    assert_partial(
      { 
        id: @kendall.id, 
        first_name: 'Kendall', 
        last_name: 'Ingles', 
        email: 'kendall_ingles@sil.org', 
        has_login: true, 
        ui_language: 'en', 
        email_pref: 'immediate',
        notification_channels: "Lng#{languages(:Ewondo).id} ",
        gender: 'M',
        isUser: false,
        home_country: nil,
        roles: [
          'LinguisticConsultantTraining'
        ],
        can: { update: true, destroy: false },
        loaded: true,
        participants: [
          {
            id: participants(:KendallEwondo).id,
            language_id: languages(:Ewondo).id,
            cluster_id: nil,
            name: 'Ewondo',
            roles: ['LinguisticConsultantTraining']
          }
        ]
      },
      data[:person]
    )
  end

  test 'Move participants from person object to freestanding' do
    skip
    api_login @drew
    data = api_get(people_path("/#{@kendall.id}"))
    assert_nil data[:person][:participants]
    assert_equal 1, data[:participants].count
  end

  test 'Show self' do
    api_login @drew
    data = api_get(people_path("/#{@drew.id}"))
    assert data[:person][:isUser]
  end

  test 'Show permissions' do
    api_login @kevin
    data = api_get(people_path("/#{@drew.id}"))
    assert_equal({ update: false, destroy: false }, data[:person][:can])
    data = api_get(people_path("/#{@kevin.id}"))
    assert_equal({ update: true, destroy: false }, data[:person][:can])

    api_login @rick
    data = api_get(people_path("/#{@drew.id}"))
    assert_equal({ update: true, destroy: true }, data[:person][:can])
  end

  test 'Create' do
    api_login @drew
    ironman = { first_name: 'Iron', last_name: 'Man', gender: 'M', email: 'iron_man@sil.org', has_login: true }
    data = api_post(people_path, person: ironman)
    assert_partial ironman, data[:person]
  end

  test 'Create permissions' do
    api_login @kevin
    api_post(people_path, {})
    assert_not_allowed
  end

  test 'Create Duplicate' do
    api_login @rick
    dup = { first_name: 'Drew', last_name: 'Mambo', gender: 'M', has_login: false }
    data = api_post(people_path, person: dup)
    puts data
    assert_equal('Drew Mambo', data[:duplicatePerson][:full_name])

    dup[:first_name] += ' '
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicatePerson][:full_name])

    dup.merge!(first_name: 'Mambo', last_name: 'Drew')
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicatePerson][:full_name])

    dup.merge!(first_name: 'Drew Mambo', last_name: 'McGurkins')
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicatePerson][:full_name])
  end

  test 'Update' do
    api_login @kevin
    data = api_put(people_path("/#{@kevin.id}"), person: { ui_language: :fr })
    assert_equal 'fr', data[:person][:ui_language]
  end

  test 'Update permissions' do
    api_login @kevin
    api_put(people_path("/#{@rick.id}"), {})
    assert_not_allowed
  end

  test 'Destroyed!' do
    api_login @rick
    api_delete(people_path("/#{@drew.id}"))
    assert_response 204
    refute Person.find_by(first_name: 'Drew')
  end

  test 'Destroy permissions' do
    api_login @drew
    api_delete(people_path("/#{@rick.id}"))
    assert_not_allowed
  end

  test 'Update View Prefs' do
    api_login @drew
    api_put(people_path('/update_view_prefs'), view_prefs: { dashboardTab: 'Linguistics' })
    assert_response 204
    @drew.reload
    assert_equal 'Linguistics', @drew.view_prefs['dashboardTab']
  end

  test 'Search' do
    api_login @drew
    data = api_get(people_path('/search?q=conr'))
    assert_equal 1, data[:results].count
    assert_equal(
      { id: @rick.id, first_name: 'Rick', last_name: 'Conrad', name: 'Rick Conrad', roles: ['DuluAdmin'] },
      data[:results].first
    )
  end
end
