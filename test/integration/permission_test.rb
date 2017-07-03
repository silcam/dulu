require 'test_helper'

class PermissionTest < Capybara::Rails::TestCase
  def setup
    @kevin = people :Kevin
    @olga = people :Olga
    @rick = people :Rick
  end

  test "Kevin creating people" do
    log_in @kevin
    visit people_path
    refute page.has_content?('Add Person'), "Should not see Add Person button"
    visit new_person_path
    assert_current_path not_allowed_path
  end

  test "Kevin editing people" do
    log_in @kevin
    visit people_path
    refute page.has_content?('Edit'), "Should not see Edit button"
    visit edit_person_path(people(:Abanda))
    assert_current_path not_allowed_path
    # Try to edit himself - should work
    assert false
  end

  test "Olga can't make Admin" do
    log_in @rick
    visit edit_person_path @rick
    assert page.has_content?('Site Administrator')
    log_in @olga
    visit edit_person_path @olga
    refute page.has_content?('Site Administrator')
    #
    # select 'Site Administrator', from: 'person_role'
    # click_button 'Update Person'
    # assert_current_path not_allowed_path
  end
end
