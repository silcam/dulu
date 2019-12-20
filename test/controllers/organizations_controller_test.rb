# frozen_string_literal: true

require 'test_helper'

class OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @rick = people(:Rick)
    @kevin = people(:Kevin)
    @sil = organizations :SIL
    @olga = people(:Olga)
  end
  
  def orgs_path(rest = '')
    "/api/organizations#{rest}"
  end

  test 'Index' do
    api_login
    data = api_get(orgs_path)
    partial_exp = {
      can: {
        create: true
      },
      organizations: [
        { id: @sil.id, short_name: 'SIL' }
      ]
    }
    assert_partial(partial_exp, data)
  end

  test 'Index permissions' do
    api_login @kevin
    data = api_get(orgs_path)
    assert_equal({ create: false }, data[:can])
  end

  test 'Show' do
    api_login 
    data = api_get(orgs_path("/#{@sil.id}"))
    assert_partial(
      { 
        id: @sil.id, 
        short_name: 'SIL', 
        long_name: 'SIL International', 
        country: { name: 'Cameroon' },
        can: { update: true, destroy: false }
      },
      data[:organizations][0]
    )
  end

  test 'Show permissions' do
    api_login @kevin
    data = api_get(orgs_path("/#{@sil.id}"))
    assert_equal({ update: false, destroy: false }, data[:organizations][0][:can])

    api_login @rick
    data = api_get(orgs_path("/#{@sil.id}"))
    assert_equal({ update: true, destroy: true }, data[:organizations][0][:can])
  end

  test 'Create' do
    api_login
    books_for_babies = { short_name: 'Books for Babies' }
    data = api_post(orgs_path, organization: books_for_babies)
    assert_partial books_for_babies, data[:organizations][0]
  end

  test 'Create permissions' do
    api_login @kevin
    api_post(orgs_path, {})
    assert_not_allowed
  end

  test 'Update' do
    api_login 
    data = api_put(orgs_path("/#{@sil.id}"), organization: { long_name: 'So In Love' })
    assert_equal 'So In Love', data[:organizations][0][:long_name]
  end

  test 'Update permissions' do
    api_login @kevin
    api_put(orgs_path("/#{@sil.id}"), {})
    assert_not_allowed
  end

  test 'Destroyed!' do
    api_login @rick
    api_delete(orgs_path("/#{@sil.id}"))
    assert_response 204
    refute Organization.find_by(short_name: 'SIL')
  end

  test 'Destroy permissions' do
    api_login @olga
    api_delete(orgs_path("/#{@sil.id}"))
    assert_not_allowed
  end

  test 'Search' do
    api_login
    data = api_get(orgs_path('/search?q=inter'))
    assert_equal 1, data[:results].count
    assert_equal(
      { id: @sil.id, short_name: 'SIL' },
      data[:results].first
    )
  end
end
