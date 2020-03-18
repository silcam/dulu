# frozen_string_literal: true

require 'test_helper'

class ParticipantsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @ndop = clusters :Ndop
    @hdi = languages :Hdi
    @drew_hdi = participants :DrewHdi
    @drew_ndop = participants :DrewNdop
    @drew = people :Drew
    @hdi_ezra = translation_activities :HdiEzra
    @lance = people :Lance
    @kevin = people :Kevin
  end
  
  def ptpt_path(rest = '')
    "/api/participants#{rest}"
  end

  test 'Language Index' do
    api_login
    data = api_get("/api/languages/#{@hdi.id}/participants")
    assert_includes(data[:people], id: @drew.id, first_name: 'Drew', last_name: 'Mambo')
    assert_equal([{ id: @hdi.id, name: 'Hdi', cluster_id: nil, region_id: @hdi.region_id }], data[:languages])
    assert_nil(data[:clusters])
    assert_includes(data[:participants], 
                    id: @drew_hdi.id,
                    person_id: @drew.id,
                    language_id: @hdi.id,
                    cluster_id: nil,
                    start_date: '2017-01-01',
                    end_date: nil,
                    roles: ['TranslationConsultant'])
  end

  test 'Cluster Index' do
    api_login
    data = api_get("/api/clusters/#{@ndop.id}/participants")
    assert_includes(data[:people], id: @drew.id, first_name: 'Drew', last_name: 'Mambo')
    assert_equal([{ id: @ndop.id, name: 'Ndop', region_id: @ndop.region_id }], data[:clusters])
    assert_nil(data[:languages])
    assert_includes(data[:participants], 
                    id: @drew_ndop.id,
                    person_id: @drew.id,
                    language_id: nil,
                    cluster_id: @ndop.id,
                    start_date: '2017',
                    end_date: nil,
                    roles: ['TranslationConsultant'])
  end

  test 'Show Language Participant' do
    api_login
    data = api_get(ptpt_path("/#{@drew_hdi.id}"))
    assert_equal([{ id: @drew.id, first_name: 'Drew', last_name: 'Mambo' }], data[:people])
    assert_equal([{ id: @hdi.id, name: 'Hdi', cluster_id: nil, region_id: @hdi.region_id }], data[:languages])
    assert_nil(data[:clusters])
    assert_equal(@hdi_ezra.id, data[:activities][0][:id])
    assert_equal([{
                   id: @drew_hdi.id,
                   person_id: @drew.id,
                   language_id: @hdi.id,
                   cluster_id: nil,
                   start_date: '2017-01-01',
                   end_date: nil,
                   roles: ['TranslationConsultant'],
                   can: { update: true, destroy: true }
                 }], data[:participants])
  end

  test 'Show Cluster Participant' do
    api_login
    data = api_get(ptpt_path("/#{@drew_ndop.id}"))
    assert_equal([{ id: @ndop.id, name: 'Ndop', region_id: @ndop.region_id }], data[:clusters])
    assert_nil(data[:languages])
  end

  test 'Show permissions' do
    api_login @kevin
    data = api_get(ptpt_path("/#{@drew_hdi.id}"))
    assert_equal({ update: false, destroy: false }, data[:participants][0][:can])
  end

  def new_ptpt
    { person_id: @lance.id, language_id: @hdi.id, start_date: '2020-03-17', roles: ['Linguist'] }
  end

  test 'Create' do
    api_login @drew
    data = api_post(ptpt_path, participant: new_ptpt)
    assert_partial(new_ptpt, data[:participants][0])
  end

  test 'Create permissions' do
    api_login @kevin
    api_post(ptpt_path, participant: new_ptpt)
    assert_not_allowed
  end

  test 'Update' do
    api_login @drew
    data = api_put(ptpt_path("/#{@drew_hdi.id}"), participant: { end_date: '2020' })
    assert_equal '2020', data[:participants][0][:end_date]
  end

  test 'Update permissions' do
    api_login @kevin
    api_put(ptpt_path("/#{@drew_hdi.id}"), participant: { end_date: '2020' })
    assert_not_allowed
  end

  test 'Destroyed!' do
    api_login @drew
    data = api_delete(ptpt_path("/#{@drew_hdi.id}"))
    assert_equal({ deletedParticipants: [@drew_hdi.id] }, data)
  end

  test 'Destroy permissions' do
    api_login @lance
    api_delete(ptpt_path("/#{@drew_hdi.id}"))
    assert_not_allowed
  end
end
