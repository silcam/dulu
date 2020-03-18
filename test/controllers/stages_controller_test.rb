# frozen_string_literal: true

require 'test_helper'

class StagesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people :Drew
    @hdi = languages :Hdi
    @hdi_ezra = translation_activities :HdiEzra
    @hdi_ezra_drafting = stages :HdiTwo
  end

  def stages_path(rest = '')
    "/api/stages#{rest}"
  end

  test 'Create' do
    api_login @drew
    data = api_post(
      stages_path, 
      stage: { activity_id: @hdi_ezra.id, start_date: '2020-03-18', name: 'Testing' }
    )
    assert_partial(
      { activity_id: @hdi_ezra.id, start_date: '2020-03-18', name: 'Testing' },
      data[:activities][0][:stages][0]
    )
  end

  test 'Update' do
    api_login @drew
    data = api_put(
      stages_path("/#{@hdi_ezra_drafting.id}"),
      stage: { start_date: '2017-03' }
    )
    assert_equal(
      { id: @hdi_ezra_drafting.id, activity_id: @hdi_ezra.id, start_date: '2017-03', name: 'Drafting' },
      data[:activities][0][:stages][0]
    )
  end

  test 'Destroy' do
    api_login @drew
    data = api_delete(stages_path("/#{@hdi_ezra_drafting.id}"))
    assert_equal(1, data[:activities][0][:stages].length)
  end
end
