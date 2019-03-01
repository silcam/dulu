require 'application_system_test_case'

class EditLanguageTest < ApplicationSystemTestCase
  test "Postponed..." do
    postpone_failure(Date.new(2019, 3, 28), "Need to be able to edit Language name etc.")
  end
  
  # def setup
  #   log_in people(:Drew)
  #   @hdi = languages :Hdi
  #   visit model_path @hdi
  #   click_on 'Language Management'
  # end

  # test "Change Language Name" do
  #   within(:css, 'form#change_name_form') do
  #     select 'Xdi', from: 'language_name'
  #     click_on 'Save'
  #   end
  #   assert_current_path model_path(@hdi)
  #   assert find(:css, 'div.sidebar').has_content?('Xdi'), "Title of sidebar should be new name, Xdi"
  # end

  # test "Create Dialect" do
  #   within(:css, 'form#new_dialect_form') do
  #     fill_in 'language_name', with: 'Xihidi'
  #     click_on 'Save'
  #   end
  #   xihidi = Language.find_by(name: 'Xihidi')
  #   assert_equal @hdi, xihidi.parent
  #   assert_current_path model_path(xihidi.program)
  # end

  # test "Invalid Name Create Dialect" do
  #   within(:css, 'form#new_dialect_form') do
  #     click_on 'Save'
  #   end
  #   assert_current_path languages_path
  #   assert page.has_content?("Name can't be blank"), "Should see error for blank name"
  # end

  # test "Drew can't edit other languages" do
  #   ewondo = languages :Ewondo
  #   visit model_path ewondo
  #   # refute page.has_content? 'Language Management'
  #   visit edit_language_path ewondo
  #   assert_current_path not_allowed_path
  # end
end
