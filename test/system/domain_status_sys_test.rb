require 'application_system_test_case'

class DomainStatusSysTest < ApplicationSystemTestCase

  test "Create App" do
    log_in people(:Drew)
    visit "#{model_path(languages(:Hdi))}/Translation"
    within(parent(find('h3', text: 'Status'))) do
      click_icon('addIcon')
      within('label', text: 'Category'){ find('select').select('Scripture App') }
      within('label', text: 'Subcategory'){ find('select').select('Portions') }
      click_icon('addIcon')
      select 'Ezra', from: 'BibleBook'
      click_on 'Add'
      check 'Android'
      fill_in 'Year', with: '2010'
      within('label', text: 'Person') do
        fill_in_search_input('Rick')
      end
      within('label', text: 'Organization') do
        fill_in_search_input('SIL')
      end
      click_on 'Save'
    end

    click_link 'Android'
    assert_text 'Ezra'
    assert_text 'Android'
    assert_text '2010'
    assert_text 'SIL'
    assert_text 'Rick Conrad'
  end

  test "Edit Hdi NT" do
    log_in people(:Drew)
    visit "#{model_path(languages(:Hdi))}/translation"
    within(parent(find('h3', text: 'Status'))) { click_link '2005' }
    safe_assert_no_text 'Bible'
    action_bar_click_edit
    within('label', text: 'Subcategory'){ find('select').select('Bible') }
    click_on 'Save'
    assert_text 'Bible'
  end

  test "Delete Hdi NT from Translation Status" do
    log_in people(:Drew)
    visit "#{model_path(languages(:Hdi))}/translation"
    within(parent(find('h3', text: 'Status'))) { click_link '2005' }
    page.accept_confirm do
      action_bar_click_delete
    end
    assert_current_path model_path(languages(:Hdi))
    within(parent(find('h3', text: 'Status'))) { safe_assert_no_selector('a', text: '2005') }
  end

  test "Kevin no can create/edit/delete" do
    log_in people(:Kevin)
    visit "#{model_path(languages(:Hdi))}/translation"
    within(parent(find('h3', text: 'Status'))) do
      safe_assert_no_selector(icon_selector('addIcon'))
      click_link '2005'
    end
    safe_assert_no_selector(icon_selector('editIcon'))
    safe_assert_no_selector(icon_selector('deleteIcon'))
  end
end