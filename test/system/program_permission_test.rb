require 'application_system_test_case'

class ProgramPermissionTest < ApplicationSystemTestCase
  def setup
    @kevin = people :Kevin
    @drew = people :Drew
    @hdi_program = programs :Hdi
  end

  test "Kevin can't create activity" do
    log_in @drew
    visit "#{model_path(@hdi_program)}/Translation"
    find('h3', text: 'Activities').assert_selector(icon_selector('addIcon'))

    log_in @kevin
    visit "#{model_path(@hdi_program)}/Translation"
    find('h3', text: 'Activities').assert_no_selector(icon_selector('addIcon'))
  end
end
