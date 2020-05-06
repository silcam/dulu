# frozen_string_literal: true

require 'test_helper'

class PersonRolesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people(:Drew)
    @rick = people(:Rick)
    @lance = people(:Lance)
    @kevin = people(:Kevin)
  end

  def person_roles_route(rest = '')
    "/api/person_roles#{rest}"
  end

  test 'Add a role for Drew' do
    api_login @rick
    data = api_post(person_roles_route, person_id: @drew.id, role: 'LinguisticConsultant')
    assert_equal(%w[TranslationConsultant LinguisticConsultant], data[:people][0][:roles])
  end

  test 'Add roles authorization' do
    api_login @drew
    api_post(person_roles_route, person_id: @lance.id, role: 'DuluAdmin')
    assert_not_allowed
  end

  test 'Finish role' do
    api_login @rick
    data = api_post(person_roles_route('/finish'), person_id: @drew.id, role: 'TranslationConsultant')
    assert_empty data[:people][0][:roles]
  end

  test 'Finish role auth' do
    api_login @kevin
    api_post(person_roles_route('/finish'), person_id: @drew.id, role: 'TranslationConsultant')
    assert_not_allowed
  end
end
