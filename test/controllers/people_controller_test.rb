# frozen_string_literal: true

require 'test_helper'

class PeopleControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people(:Drew)
    @rick = people(:Rick)
    @lance = people(:Lance)
    @kendall = people(:Kendall)
    @kevin = people(:Kevin)
    @olga = people(:Olga)
  end
  
  def people_path(rest = '')
    "/api/people#{rest}"
  end

  test 'Index' do
    api_login @drew
    data = api_get(people_path)
    assert_equal({ create: true, grant_login: false }, data[:can][:people])
    assert_equal(
      { id: @lance.id, first_name: 'Lance', last_name: 'Armstrong' }, 
      data[:people].first
    )
  end

  test 'Index permissions' do
    api_login @kevin
    data = api_get(people_path)
    assert_equal({ create: false, grant_login: false }, data[:can][:people])
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
        loaded: true
      },
      data[:people][0]
    )
    assert_partial(
      [{
        id: participants(:KendallEwondo).id,
        language_id: languages(:Ewondo).id,
        cluster_id: nil,
        roles: ['LinguisticConsultantTraining']
      }],
      data[:participants]
    )    
  end

  test 'Move participants from person object to freestanding' do
    api_login @drew
    data = api_get(people_path("/#{@kendall.id}"))
    assert_nil data[:people][0][:participants]
    assert_equal 1, data[:participants].count
  end

  test 'Show self' do
    api_login @drew
    data = api_get(people_path("/#{@drew.id}"))
    assert data[:people][0][:isUser]
  end

  test 'Show permissions' do
    api_login @kevin
    data = api_get(people_path("/#{@drew.id}"))
    assert_equal({ update: false, destroy: false, grant_login: false }, data[:people][0][:can])
    data = api_get(people_path("/#{@kevin.id}"))
    assert_equal({ update: true, destroy: false, grant_login: false }, data[:people][0][:can])

    api_login @rick
    data = api_get(people_path("/#{@drew.id}"))
    assert_equal({ update: true, destroy: true, grant_login: true }, data[:people][0][:can])
  end

  test 'Create' do
    api_login @olga
    ironman = { first_name: 'Iron', last_name: 'Man', gender: 'M', email: 'iron_man@sil.org', has_login: true }
    data = api_post(people_path, person: ironman)
    assert_partial ironman, data[:people][0]
  end

  test 'Create permissions' do
    api_login @kevin
    api_post(people_path, {})
    assert_not_allowed
  end

  test 'Grant login permission' do
    api_login @drew
    ironman = { first_name: 'Iron', last_name: 'Man', gender: 'M', email: 'iron_man@sil.org', has_login: true }
    data = api_post(people_path, person: ironman)
    assert_partial ironman.merge(has_login: false), data[:people][0]
  end

  test 'Create Duplicate' do
    api_login @rick
    dup = { first_name: 'Drew', last_name: 'Mambo', gender: 'M', has_login: false }
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicates][0][:full_name])

    dup[:first_name] += ' '
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicates][0][:full_name])

    dup.merge!(first_name: 'Mambo', last_name: 'Drew')
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicates][0][:full_name])

    dup.merge!(first_name: 'Drew Mambo', last_name: 'McGurkins')
    data = api_post(people_path, person: dup)
    assert_equal('Drew Mambo', data[:duplicates][0][:full_name])

    dup[:not_a_duplicate] = true
    data = api_post(people_path, person: dup)
    assert_nil data[:duplicates]
  end

  test 'Update' do
    api_login @kevin
    data = api_put(people_path("/#{@kevin.id}"), person: { ui_language: :fr })
    assert_equal 'fr', data[:people][0][:ui_language]
  end

  test 'Update permissions' do
    api_login @kevin
    api_put(people_path("/#{@rick.id}"), {})
    assert_not_allowed
  end

  test 'Destroyed!' do
    api_login @rick
    data = api_delete(people_path("/#{@drew.id}"))
    assert_equal(
      { deletedPeople: [@drew.id] },
      data
    )
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

  test 'Update View Prefs keeps only the known top-level keys' do
    api_login @drew
    api_put(people_path('/update_view_prefs'),
            view_prefs: {
              dashboardTab: 'Linguistics',
              dashboardSelection: { type: 'language', id: 42 },
              evil: { anything: 'at all' }
            })
    assert_response 204
    @drew.reload
    # The hash-valued pref survives -- a bare `permit(:dashboardSelection)` would
    # silently drop it, and the scalar-only test above would not have noticed.
    assert_equal({ 'type' => 'language', 'id' => 42 },
                 @drew.view_prefs['dashboardSelection'])
    assert_equal 'Linguistics', @drew.view_prefs['dashboardTab']
    refute @drew.view_prefs.key?('evil'), 'unknown keys must not be stored'
  end

  # `config/environments/test.rb` sets allow_forgery_protection = false, so CSRF is
  # off for every other test in this suite. This one turns it on for a single
  # request to prove the endpoint is protected -- Api::PeopleController used to
  # `skip_before_action :verify_authenticity_token, only: [:update_view_prefs]`,
  # which let any off-site page write to a logged-in user's view_prefs. See
  # UPGRADE_PLAN 8a.8. Cypress cannot cover this: it authenticates with a
  # tokenless `cy.request("POST", "/test-login")`, which only works while
  # forgery protection is off.
  test 'Update View Prefs rejects a request with no CSRF token' do
    api_login @drew
    before = @drew.reload.view_prefs.dup

    with_forgery_protection do
      put people_path('/update_view_prefs'),
          params: { view_prefs: { dashboardTab: 'Snuck In' } },
          xhr: true
    end

    assert_response 422
    assert_equal before, @drew.reload.view_prefs, 'rejected request must not write'
  end


  test 'Update View Prefs Large Payload' do
    api_login @drew
    before = @drew.reload.view_prefs.dup
    oversized = 'A' * (Api::PeopleController::MAX_VIEW_PREFS_BYTES + 1)

    api_put(people_path('/update_view_prefs'), view_prefs: { dashboardTab: oversized })

    assert_response 413
    assert_equal before, @drew.reload.view_prefs, 'oversized payload must not write'
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
