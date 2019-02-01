require 'application_system_test_case'

class OrgIntTest < ApplicationSystemTestCase
  def setup
    @sil = organizations(:SIL)
  end

  test 'Add Organization' do
    log_in people(:Drew)
    visit '/organizations'
    find(icon_selector('addIcon')).click
    fill_in 'Short Name', with: 'UEEC'
    fill_in 'Long Name', with: 'Union des Églises Évangeliques du Cameroun'
    fill_in 'Description', with: 'A denomination'
    click_on 'Save'
    assert_selector('tr', text: 'UEEC') # Sidebar list
    assert_selector('h2', text: 'UEEC')
    assert_selector('h3', text: 'Union des Églises Évangeliques du Cameroun')
    assert_text('A denomination')
    assert Organization.find_by(short_name: 'UEEC')
  end

  test 'Update Organization' do
    log_in people(:Drew)
    visit model_path(@sil)
    action_bar_click_edit
    fill_in 'short_name', with: 'The Evil Empire'
    fill_in 'Long Name', with: 'The Most Evilly Evil Empire of all Time'
    within('li', text: 'Parent Organization') { fill_in_search_input('Lutheran Bi') }
    within('li', text: 'Country') { fill_in_search_input('Cameroon') }
    fill_in 'Description', with: 'Gonna Take over the galaxy, yo!'
    click_on 'Save'

    assert_selector('h2', text: 'The Evil Empire')
    assert_selector('h3', text: 'The Most Evilly Evil Empire of all Time')
    assert_selector('a', text: 'Lutheran Bible Translators')
    assert_selector('li', text: 'Cameroon')
    assert_text('Gonna Take over the galaxy, yo!')
    @sil.reload
    assert @sil.short_name == 'The Evil Empire'
  end

  test 'Delete Organization' do
    log_in people(:Rick)
    visit model_path(@sil)
    assert_selector('tr', text: 'SIL') # Sidebar list

    action_bar_click_delete
    check "dangerButtonCheckbox"
    click_on "Permanently Delete SIL"

    assert_no_selector('tr', text: 'SIL')
    assert_nil Organization.find_by(short_name: 'SIL')
  end

  test 'Invalid Name Add Organization' do
    log_in people(:Rick)
    visit '/organizations'
    find(icon_selector('addIcon')).click
    refute_selector('button:enabled', text: 'Save')
    assert_selector('button:disabled', text: 'Save')
  end

  test 'Kevin cant!' do
    log_in people(:Kevin)
    visit '/organizations'
    assert_no_selector(icon_selector('addIcon'))
    visit model_path(@sil)
    assert_no_selector(icon_selector('editIcon'))
    assert_no_selector(icon_selector('deleteIcon'))
  end

  test 'Drew cant!' do
    log_in people(:Drew)
    visit model_path(@sil)
    assert_no_selector(icon_selector('deleteIcon'))
  end
end
