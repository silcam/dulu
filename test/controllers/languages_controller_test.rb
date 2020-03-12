# frozen_string_literal: true

require 'test_helper'

class LanguagesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @bambalang = languages :Bambalang
    @hdi = languages :Hdi
    @north = regions :NorthRegion
    @ndop = clusters :Ndop
    @andreas = people :Andreas
    @drew_hdi = participants :DrewHdi
    @drew = people :Drew
  end

  def lang_path(rest = '')
    "/api/languages#{rest}"
  end

  test 'Index' do
    api_login
    data = api_get(lang_path)
    assert_equal({ create: false }, data[:can])
    assert_equal({
                   id: @bambalang.id,
                   name: 'Bambalang',
                   cluster_id: @ndop.id,
                   region_id: nil
                 },
                 data[:languages].first)
    assert_equal(['Ndop'], data[:clusters].map { |c| c[:name] })
    assert_equal(['North Region', 'South Region'], data[:regions].map { |r| r[:name] })
  end

  test 'Index - Can Create' do
    skip 'Currently hardcoded to false'
    api_login @andreas
    data = api_get(lang_path)
    assert_equal({ create: true }, data[:can])
  end

  test 'Show' do
    api_login
    data = api_get(lang_path("/#{@hdi.id}"))
    assert_partial([{
                     id: @hdi.id,
                     name: 'Hdi',
                     code: 'xed',
                     cluster_id: nil,
                     region_id: @north.id
                   }], data[:languages])
    assert_equal({
                   id: notes(:HdiNote2).id,
                   person_id: @andreas.id,
                   created_at: notes(:HdiNote2).created_at.to_i,
                   text: 'This language is cool'
                 }, data[:languages].first[:notes].first)
    assert_equal([{ id: @north.id, name: 'North Region' }], data[:regions])
    assert_equal(%w[Andreas Drew], data[:people].map { |p| p[:first_name] })
  end

  test 'Dashboard List' do
    api_login
    data = api_get(lang_path('/dashboard_list'))
    assert_includes(
      data[:participants],
      id: @drew_hdi.id, person_id: @drew.id, language_id: @hdi.id, cluster_id: nil
    )
    assert_equal(
      data[:people],
      [{ id: @drew.id, first_name: 'Drew', last_name: 'Mambo' }]
    )
    assert_includes(
      data[:regions],
      id: @north.id, name: 'North Region'
    )
    assert_includes(
      data[:clusters],
      id: @ndop.id, name: 'Ndop', region_id: @ndop.region_id
    )
    assert_includes(
      data[:languages],
      id: @hdi.id, name: 'Hdi', cluster_id: nil, region_id: @hdi.region_id
    )
  end

  test 'Search' do
    api_login
    data = api_get(lang_path('/search?q=hdi'))
    assert_equal(
      [{ id: @hdi.id, name: 'Hdi' }, { id: languages(:HdiDialect).id, name: 'HdiDialect' }],
      data
    )
  end
end
