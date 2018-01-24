require 'test_helper'

class ActivityIntTest < Capybara::Rails::TestCase
  def setup
    @hdi = programs(:Hdi)
  end

  test "Rick Deletes Hdi Exodus" do
    log_in people(:Rick)
    visit activity_path(translation_activities(:HdiExodus))
    assert_selector('input[value="Delete Exodus"]')
    click_on 'Delete Exodus'
    # accept_js_confirm
    assert_current_path program_path(@hdi)
    page.assert_no_text 'Exodus'
  end

  test "Kendall can't delete Exodus" do
    log_in people(:Kendall)
    visit activity_path(translation_activities(:HdiExodus))
    assert_no_selector('input[value="Delete Exodus"]')
  end
end