require 'test_helper'

class PermissionTest < Capybara::Rails::TestCase
  def setup
    @kevin = people :Kevin
    @olga = people :Olga
    @rick = people :Rick
  end

  test "Kevin can't create people" do
    log_in @kevin
    visit people_path
    refute page.has_content?('Add Person'), "Should not see Add Person button"
    visit new_person_path
    assert_current_path not_allowed_path
  end

  test "Kevin can't edit people" do
    log_in @kevin
    visit people_path
    refute page.has_content?('Edit'), "Should not see Edit button"
    visit edit_person_path(people(:Abanda))
    assert_current_path not_allowed_path
  end

  test "Olga can't make Admin or change own role" do
    log_in @rick
    visit edit_person_path @rick
    assert page.has_content?('Role'), "Rick should see role select"
    assert page.has_content?('Site Administrator'), "Rick should have Site Admin option"
    log_in @olga
    visit edit_person_path @olga
    refute page.has_content?('Role'), "Olga should not see her own Role selector"
    visit edit_person_path @kevin
    assert page.has_content?('Role'), "Olga should see role select for Kevin"
    refute page.has_content?('Site Administrator'), "Olga should not see Site Admin option for kevin"
    #
    # select 'Site Administrator', from: 'person_role'
    # click_button 'Update Person'
    # assert_current_path not_allowed_path
  end
end
