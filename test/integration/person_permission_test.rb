require 'test_helper'

class PersonPermissionTest < Capybara::Rails::TestCase
  # def setup
  #   Capybara.current_driver = :webkit
  #   @kevin = people :Kevin
  #   @olga = people :Olga
  #   @rick = people :Rick
  # end

  # test "Kevin can't create people" do
  #   log_in @kevin
  #   visit people_path
  #   refute page.has_content?('Add New Person'), "Should not see Add Person button"
  #   visit new_person_path
  #   assert_current_path not_allowed_path
  # end

  # test "Kevin can't edit people" do
  #   log_in @kevin
  #   visit people_path
  #   refute page.has_content?('Edit'), "Should not see Edit button"
  #   visit edit_person_path(people(:Abanda))
  #   assert_current_path not_allowed_path
  # end

  # test "Olga can't make Admin or change own role" do
  #   log_in @rick
  #   visit person_path @olga
  #   assert page.has_selector?('#person_role_role'), "Rick should see role select"
  #   assert page.has_content?('Dulu Admin'), "Rick should have Site Admin option"
  #   log_in @olga
  #   visit person_path @kevin
  #   assert page.has_selector?('#person_role_role'), "Olga should see role select"
  #   refute page.has_content?('Dulu Admin'), "Olga can't make Kevin a Dulu Admin"
  #   #
  #   # select 'Site Administrator', from: 'person_role'
  #   # click_button 'Update Person'
  #   # assert_current_path not_allowed_path
  # end
end
