require 'application_system_test_case'

class UpdateStageTest < ApplicationSystemTestCase
  def setup
    @hdi_ezra = translation_activities(:HdiEzra)
    @fdate = FuzzyDate.new(2017, 7)
    log_in(people(:Drew))
    visit "#{model_path(languages(:Hdi))}/Translation"
  end

  test "Modify Stage" do
    skip
    # hdi_drafting = @hdi_ezra.current_stage
    # find(:css, "button[data-edit-stage-id='#{hdi_drafting.id}']").click
    # fill_in_date 'stage_start_date', @fdate
    # click_button 'Save'
    # within(:css, "tr#stage-row-view-#{hdi_drafting.id}") do
    #   assert has_content?(@fdate.pretty_print)
    # end
  end

  test "Remove Stage" do
    skip
  #   hdi_drafting = @hdi_ezra.current_stage
  #   within(:css, "form[action='#{stage_path(hdi_drafting)}']") do
  #     page.accept_confirm do
  #       click_button 'X'
  #     end
  #   end

  #   within(:css, 'span#current-stage') do
  #     assert_text 'Planned'
  #     safe_assert_no_text 'Drafting'
  #   end
  end
end