require 'test_helper'

class AddOrganizationTest < Capybara::Rails::TestCase
  def setup
    log_in people(:Rick)
    visit organizations_path
    click_on 'Add Organization'
  end

  test "Add Organization" do
    fill_in 'Name', with: 'Union des Eglises Evangeliques du Cameroun'
    fill_in 'Abbreviation', with: 'UEEC'
    click_on 'Save'
    assert_current_path organizations_path
    assert page.has_content?('Union des Eglises Evangeliques du Cameroun')
  end

  test "Invalid Name Add Organization" do
    click_on 'Save'
    assert page.has_content?("Name can't be blank"), "Should see error for missing name"
  end
end
