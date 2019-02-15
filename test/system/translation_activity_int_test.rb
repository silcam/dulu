require 'application_system_test_case'

class TranslationActivityIntTest < ApplicationSystemTestCase
  def setup
    @hdi = languages(:Hdi)
    @zulgo = languages(:Zulgo)
  end

  test "New Translation Activity" do
    log_in(people(:Olga))
    visit "#{model_path(@zulgo)}/Translation"
    assert_no_selector('tr', text: 'Genesis Planned')
    within('h3', text: 'Activities') { click_icon('addIcon') }
    find('select').select 'Genesis'
    click_on 'Save'
    assert_selector('tr', text: 'Genesis Planned')
  end

  test "Rick Deletes Hdi Exodus" do
    log_in people(:Rick)
    visit model_path(translation_activities(:HdiExodus))
    postpone_failure(Date.new(2019, 2, 28), "Need to test deleting activities once we can do that")
    # assert_selector('input[value="Delete Exodus"]')
    # click_on 'Delete Exodus'
    # # accept_js_confirm
    # assert_current_path model_path(@hdi)
    # page.assert_no_text 'Exodus'
  end

  test "Kendall can't delete Exodus" do
    log_in people(:Kendall)
    visit model_path(translation_activities(:HdiExodus))
    postpone_failure(Date.new(2019, 2, 28), "Need to test deleting activities once we can do that")
    assert_no_selector('input[value="Delete Exodus"]')
  end

  test "Drew updates stage for Hdi Ezra" do 
    log_in people(:Drew)
    visit model_path @hdi
    find('tr', text: 'Ezra').find('button', text: 'Drafting').click
    within('tr', text: 'Update Stage:') do
      find('select').select('Ready for Consultant Check')
      click_on('Update')
    end
    find('tr', text: 'As of').click_on('Save')
    find('tr', text: 'Ezra').assert_text('Ready for Consultant Check')
  end

  test "Kendall can't update Hdi Ezra" do
    log_in people(:Kendall)
    visit model_path @hdi
    find('tr', text: 'Ezra').assert_no_selector('button', text: 'Drafting')
  end
end