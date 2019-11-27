# frozen_string_literal: true

require 'test_helper'

class RegionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @rick = people(:Rick)
    @drew = people(:Drew)
    @south = regions(:SouthRegion)
    @olga = people(:Olga)
    @north = regions(:NorthRegion)
    @ndop = clusters(:Ndop)
    @hdi_dialect = languages(:HdiDialect)
  end

  def regions_path(rest = '')
    "/api/regions#{rest}"
  end

  test 'Index' do
    api_login @drew
    data = api_get(regions_path)
    assert_equal({ create: false }, data[:can])
    assert_equal(
      { id: @south.id, name: 'South Region' }, 
      data[:regions].last
    )
  end

  test 'Index - Can Create' do
    api_login @rick
    data = api_get(regions_path)
    assert_equal({ create: true }, data[:can])
  end

  test 'Show' do
    api_login @drew
    data = api_get(regions_path("/#{@south.id}"))
    assert_equal(
      { region: { id: @south.id, name: 'South Region', lpf_id: @olga.id, can: { update: false, destroy: false } } },
      data
    )
  end

  test 'Show permissions' do
    api_login @rick
    data = api_get(regions_path("/#{@south.id}"))
    assert_equal(
      { update: true, destroy: true },
      data[:region][:can]
    )
  end

  test 'Create' do
    api_login @rick
    data = api_post(regions_path, region: { name: 'Wisconsin' })
    refute_empty data[:clusters]
    refute_empty data[:languages]
    assert_equal 'Wisconsin', data[:region][:name]
  end

  test 'Create permissions' do
    api_login @drew
    api_post(regions_path, region: { name: 'West Virginia' })
    assert_not_allowed
  end

  test 'Update' do
    api_login @rick
    data = api_put(
      regions_path("/#{@north.id}"),
      region: { name: 'Alaska', lpf_id: @drew.id, cluster_ids: [@ndop.id], language_ids: [@hdi_dialect.id] }
    )
    assert_partial({ id: @north.id, name: 'Alaska', lpf_id: @drew.id}, data[:region])
    assert_partial([{id: @ndop.id, name: 'Ndop', region_id: @north.id}], data[:clusters])
    assert_partial([{id: @hdi_dialect.id, name: 'HdiDialect', region_id: @north.id}], data[:languages])
    assert_includes NotificationChannel.people_for_channels("Reg#{@north.id} "), @drew
  end

  test 'Update permissions' do
    api_login @drew
    api_put(regions_path("/#{@north.id}"), {})
    assert_not_allowed
  end

  test 'Destroyed!' do
    api_login @rick
    api_delete(regions_path("/#{@south.id}"))
    assert_response 204
    refute Region.find_by(name: 'South Region')
  end

  test 'Destroy permissions' do
    api_login @drew
    api_delete(regions_path("/#{@north.id}"))
    assert_not_allowed
  end
end
