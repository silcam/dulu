require 'test_helper'

class NewTranslationActivityTest < Capybara::Rails::TestCase
  def setup
    # Capybara.current_driver = :selenium
    @olga = people :Olga
    @hdi_program = programs :HdiProgram
    @john = bible_books :John
    log_in @olga
    visit program_path(@hdi_program)
    click_link 'Add books to translate'
  end

  test "Add John Translation" do
    select 'John', from: 'activity_bible_book'
    select 'Drafting', from: 'activity_stage_name_id'
    fill_in 'activity_stage_start_date_y', with: '2017'
    check 'Drew Maust'
    click_button 'Save'
    assert_current_path dashboard_program_path @hdi_program
    hdi_john = @hdi_program.translation_activities.find_by(bible_book: @john)
    row = find(:css, "tr#activity-row-#{hdi_john.id}")
    assert row.has_content?('John'), "Should see John listed"
    assert row.has_content?('Drafting'), "Should see stage of Drafting"
    assert row.has_content?('2017'), "Should see correct stage date"
    click_link 'John'
    assert page.has_content?('Drew Maust'), "Should see Drew's name on John page"
  end

  test "Invalid Add" do
    click_button 'Save'
    assert_current_path program_activities_path(@hdi_program)
    assert find('#error-explanation').has_content?('Date'),
                    "Should see an error concerning the date"
  end
end