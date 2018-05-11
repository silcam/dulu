require 'test_helper'

class AddOrganizationTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    log_in people(:Rick)
    visit organizations_path
    click_button 'Add New Organization'
  end

  test "Add Organization" do
    fill_in 'short_name', with: 'UEEC'
    fill_in 'long_name', with: 'Union des Églises Évangeliques du Cameroun'
    click_on 'Save'

    assert page.has_content?('Union des Églises Évangeliques du Cameroun')
  end

  test "Invalid Name Add Organization" do
    click_on 'Save'
    find('.form-group', text: 'Short Name').assert_text("Can't be blank")
  end
end
