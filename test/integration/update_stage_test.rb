require 'test_helper'

class UpdateStageTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    # page.driver.enable_logging
    I18n.locale = :en
    @hdi_ezra = translation_activities(:HdiEzra)
    @fdate = FuzzyDate.new(2017, 7)
    log_in(people(:Drew))
    visit activity_path(@hdi_ezra)
  end

  test "Add stage" do
    assert page.has_button? 'Update'
    click_button 'Update'
    fill_in_date 'stage_start_date', @fdate
    click_button 'Save'
    assert find_button('Update')
    assert page.has_content? "Current stage: #{I18n.t(:Testing)}"
    within(:css, '#dulutable') do
      new_row = first(:css, 'tr')
      assert new_row.has_content? I18n.t(:Testing)
      assert new_row.has_content? @fdate.pretty_print
    end
  end

  test "Modify Stage" do
    hdi_drafting = @hdi_ezra.current_stage
    find(:css, "button[data-edit-stage-id='#{hdi_drafting.id}']").click
    fill_in_date 'stage_start_date', @fdate
    click_button 'Save'
    within(:css, "tr#stage-row-view-#{hdi_drafting.id}") do
      assert has_content?(@fdate.pretty_print)
    end
  end

  test "Remove Stage" do
    hdi_drafting = @hdi_ezra.current_stage
    within(:css, "form[action='#{stage_path(hdi_drafting)}']") do
      page.accept_confirm do
        click_button 'X'
      end
    end

    within(:css, 'span#current-stage') do
      assert_text 'Planned'
      assert_no_text 'Drafting'
    end
  end
end