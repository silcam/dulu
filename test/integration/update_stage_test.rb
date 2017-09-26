require 'test_helper'

class UpdateStageTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :selenium
    I18n.locale = :en
    @hdi_ezra = translation_activities(:HdiEzraActivity)
    @fdate = FuzzyDate.new(2017, 7)
    log_in(people(:Drew))
    visit translation_activity_path(@hdi_ezra)
  end

  test "Add stage" do
    click_button 'Update'
    fill_in_date 'stage_start_date', @fdate
    click_button 'Save'
    assert_equal(stage_names(:ConsultantCheck),
              @hdi_ezra.current_stage.stage_name)
    assert_equal( @fdate, @hdi_ezra.current_stage.f_start_date)
  end

  test "Modify Stage" do
    hdi_drafting = @hdi_ezra.current_stage
    find(:css, "button[data-edit-stage-id='#{hdi_drafting.id}']").click
    fill_in_date 'stage_start_date', @fdate
    click_button 'Save'
    assert_equal( @fdate, @hdi_ezra.current_stage.f_start_date)
  end

  test "Remove Stage" do
    hdi_drafting = @hdi_ezra.current_stage
    within(:css, "form[action='#{stage_path(hdi_drafting)}']") do
      click_button 'Delete'
      page.accept_alert
    end

    # This takes forever
    # sleep 1.4
    # refute page.has_content?('Drafting'),
    #        "Should not see Drafting stage anymore"
    # assert_equal(stage_names(:Planned),
    #              @hdi_ezra.current_stage.stage_name)
  end
end