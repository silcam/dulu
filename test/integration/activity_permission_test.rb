require 'test_helper'

class ActivityPermissionTest < Capybara::Rails::TestCase
  def setup
    @kevin = people :Kevin
    @hdi_program = programs :HdiProgram
    @hdi_ezra = translation_activities :HdiEzraActivity

    #Capybara.current_driver = :selenium
  end

  test "Kevin can't update Hdi Ezra" do
    log_in @kevin
    visit translation_activity_path @hdi_ezra
    refute page.has_css?('button#show-update-form'),
           "Kevin shouldn't see Update button"
    refute page.has_content?('Modify Date'),
           "Kevin shouldn't see Modify Date button"
    refute page.has_content?('Delete'),
           "Kevin shouldn't see Delete button"
    visit dashboard_program_path @hdi_program

    refute page.has_css?("a[data-slide-form-id]"),
           "Kevin shouldn't see link to update stage on dash"
  end
end
