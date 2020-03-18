# frozen_string_literal: true

require 'test_helper'

class MediaActivitiesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people :Drew
    @hdi = languages :Hdi
  end

  test 'Index' do
    api_login
    data1 = api_get("/api/languages/#{@hdi.id}/media_activities")
    data2 = api_get("/api/activities?language_id=#{@hdi.id}&domain=media")
    assert_equal(data1, data2)
    # See ActivitiesControllerTest for more
  end

  test 'Create' do
    api_login @drew
    data = api_post(
      "/api/languages/#{@hdi.id}/media_activities",
      media_activity: { category: 'AudioScripture', scripture: 'Other', bible_book_ids: [1, 2] }
    )
    assert_partial({ 
                     language_id: @hdi.id, 
                     bible_book_ids: [1, 2],
                     category: 'AudioScripture',
                     scripture: 'Other',
                     stage_name: 'Planned', 
                     type: 'MediaActivity', 
                     participant_ids: []
                   }, data[:activities][0])
  end
end
