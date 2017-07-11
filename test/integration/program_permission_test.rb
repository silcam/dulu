require 'test_helper'

class ProgramPermissionTest < Capybara::Rails::TestCase
  def setup
    @kevin = people :Kevin
    @drew = people :Drew
    @hdi_program = programs :HdiProgram
  end

  test "Kevin can't create activity" do
    log_in @kevin
    visit program_path @hdi_program
    add_activity_path = new_program_activity_path(@hdi_program)
    refute page.has_css?("a[href='#{add_activity_path}']"),
           "Kevin shouldn't see Add Activity link"
    visit add_activity_path
    assert_current_path not_allowed_path
  end

  test "Drew can't manage people" do
    log_in @drew
    visit program_path @hdi_program
    manage_people_path = program_participants_path @hdi_program
    refute page_has_link?(manage_people_path),
           "Drew shouldn't see manage participants link"
    visit manage_people_path
    assert_current_path not_allowed_path
    visit new_program_participant_path(@hdi_program)
    assert_current_path not_allowed_path
  end
end
