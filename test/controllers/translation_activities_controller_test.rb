# frozen_string_literal: true

require 'test_helper'

class TranslationActivitiesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @drew = people :Drew
    @hdi = languages :Hdi
    @john = bible_books :John
    @hdi_ezra = translation_activities :HdiEzra
    @drew_hdi = participants :DrewHdi
    @abanda_hdi = participants :AbandaHdi
  end

  def ta_path(rest = '')
    "/api/translation_activities#{rest}"
  end

  test 'Index' do
    api_login
    data1 = api_get("/api/languages/#{@hdi.id}/translation_activities")
    data2 = api_get("/api/activities?language_id=#{@hdi.id}&domain=translation")
    assert_equal(data1, data2)
  end

  test 'Create' do
    api_login @drew
    data = api_post("/api/languages/#{@hdi.id}/translation_activities", translation_activity: { bible_book_id: 43 })
    assert_partial({ 
                     language_id: @hdi.id, 
                     bible_book_id: 43, 
                     stage_name: 'Planned', 
                     type: 'TranslationActivity', 
                     participant_ids: []
                   }, data[:activities][0])
  end
end
