# frozen_string_literal: true

require 'test_helper'

class WorkshopsActivitiesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @ewondo = languages :Ewondo
    @kendall = people :Kendall
  end

  test 'Index' do
    api_login
    data1 = api_get("/api/languages/#{@ewondo.id}/workshops_activities")
    data2 = api_get("/api/activities?language_id=#{@ewondo.id}&domain=linguistic")
    assert_includes(data2[:activities], data1[:activities][0])
    # See ActivitiesControllerTest for more
  end

  test 'Create' do
    api_login @kendall
    data = api_post(
      "/api/languages/#{@ewondo.id}/workshops_activities",
      workshops_activity: { 
        title: 'Pizza Seminars', 
        workshops_attributes: [{ number: 1, name: 'Pepperoni' }, { number: 2, name: 'Cheese' }] 
      }
    )
    assert_partial({ 
                     language_id: @ewondo.id, 
                     category: 'Workshops',
                     stage_name: 'Planned', 
                     type: 'LinguisticActivity', 
                     participant_ids: [],
                     title: 'Pizza Seminars',
                     workshops: [
                       { number: 1, name: 'Pepperoni' },
                       { number: 2, name: 'Cheese' }
                     ]
                   }, data[:activities][0])
  end
end
