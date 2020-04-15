# frozen_string_literal: true

require 'test_helper'

class OrganizationPeopleControllerTest < ActionDispatch::IntegrationTest
  def setup
    @sil = organizations :SIL
    @drew = people :Drew
    @drew_sil = organization_people :DrewSIL
    @kevin = people :Kevin
    @lance = people :Lance
  end

  def base_path
    '/api/organization_people'
  end

  def org_person_path(id)
    "#{base_path}/#{id}"
  end

  test 'Index' do
    api_login
    data = api_get("#{base_path}?person_id=#{@drew.id}")
    assert_equal(
      {
        organizationPeople: [
          {
            id: 1020472283, 
            position: nil, 
            start_date: nil,
            end_date: nil, 
            person_id: 883742519, 
            organization_id: 258650127
          }
        ], 
        people: [
          { 
            id: 883742519, 
            first_name: 'Drew', 
            last_name: 'Mambo' 
          }
        ],
        organizations: [
          { 
            id: 258650127,
            short_name: 'SIL', 
            long_name: 'SIL International',
            description: nil,
            parent_id: nil, 
            country: { id: 10184373, name: 'Cameroon' }, 
            can: { update: true, destroy: false }
          } 
        ]
      },
      data
    )
  end

  test 'Create' do
    api_login @drew
    data = api_post(base_path, person_id: @kevin.id, organization_id: @sil.id)
    kevin_sil = OrganizationPerson.find_by(person_id: @kevin.id)
    assert_equal(
      {
        id: kevin_sil.id, 
        position: nil, 
        start_date: nil,
        end_date: nil, 
        person_id: @kevin.id, 
        organization_id: @sil.id
      },
      data[:organizationPeople][0]
    )
  end

  test 'Create Permission' do
    api_login @kevin
    api_post(base_path, person_id: @lance.id, organization_id: @sil.id)
    assert_not_allowed
  end

  test 'Update' do
    api_login @drew
    data = api_put(org_person_path(@drew_sil.id), position: 'Chief Dulu Tester', start_date: '2017-07', end_date: '2024-01')
    assert_equal(
      {
        id: 1020472283, 
        person_id: 883742519, 
        organization_id: 258650127,
        position: 'Chief Dulu Tester',
        start_date: '2017-07',
        end_date: '2024-01'
      },
      data[:organizationPeople][0]
    )
  end

  test 'Update Permission' do
    api_login @kevin
    api_put(org_person_path(@drew_sil.id), position: 'Chief Dulu Tester')
    assert_not_allowed
  end

  test 'Destroy' do
    api_login @drew
    data = api_delete(org_person_path(@drew_sil.id))
    assert_equal(
      { deletedOrganizationPeople: [@drew_sil.id] },
      data
    )
  end

  test 'Destroy Permission' do
    api_login @kevin
    api_delete(org_person_path(@drew_sil.id))
    assert_not_allowed
  end
end
