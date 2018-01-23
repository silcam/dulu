require 'test_helper'

class NewTranslationActivityTest < Capybara::Rails::TestCase
  def setup
    # Capybara.current_driver = :selenium
    @olga = people :Olga
    @hdi_program = programs :Hdi
    @john = bible_books :John
    log_in @olga
    visit program_activities_path(@hdi_program)
    click_link 'Add Program Activity'
  end

  test "Add John Translation" do
    select 'John', from: 'activity_bible_book_id'
    check 'Drew Maust'
    click_button 'Save'
    assert_current_path program_path @hdi_program
    hdi_john = @hdi_program.translation_activities.find_by(bible_book: @john)
    row = find(:css, "tr#activity-row-#{hdi_john.id}")
    assert row.has_content?('John'), "Should see John listed"
    click_link 'John'
    assert page.has_content?('Drew Maust'), "Should see Drew's name on John page"
  end

  test "Add a whole Testament" do
    select 'New Testament', from: 'activity_bible_book_id'
    check 'Drew Maust'
    click_button 'Save'
    assert_current_path program_path @hdi_program
    click_link 'John'
    assert page.has_content?('Drew Maust'), "Should see Drew's name on the John page"
  end
end