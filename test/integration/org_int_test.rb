require 'test_helper'

class OrgIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    @sil = organizations(:SIL)
  end

  test 'Add Organization' do
    log_in people(:Drew)
    visit organizations_path
    click_button 'Add New Organization'
    fill_in 'short_name', with: 'UEEC'
    fill_in 'long_name', with: 'Union des Églises Évangeliques du Cameroun'
    click_on 'Save'

    assert page.has_content?('Union des Églises Évangeliques du Cameroun')
  end

  test 'Update Organization' do
    log_in people(:Drew)
    visit organization_path(@sil)
    edit_editable_text('short_name', 'SIL', 'The Evil Empire')
    assert_changes_saved
    assert_selector('.editableText', text: 'The Evil Empire')

    edit_editable_text('long_name', '(Long Name)', 'The Most Evilly Evil Empire of all Time')
    assert_selector('.editableText', text: 'The Most Evilly Evil Empire of all Time')

    within('li', text: 'Parent Organization') do
      edit_editable_search_text(nil, 'Lutheran Bible Tr')
    end
    assert_selector('.editableText', text: 'Lutheran Bible Translators')

    within('li', text: 'Country') do
      edit_editable_search_text(nil, 'Cameroon')
    end
    assert_selector('.editableText', text: 'Cameroon')

    edit_editable_text_area('description', '(Description)', 'Gonna Take over the galaxy, yo!')
    assert_selector('.editableText', text: 'Gonna Take over the galaxy, yo!')
  end

  test 'Delete Organization' do
    log_in people(:Rick)
    visit organization_path(@sil)
    assert_selector('tr', text: 'SIL')

    find('h3 .deleteIconButton').click
    click_danger_button

    assert_no_selector('tr', text: 'SIL')
  end

  test 'Invalid Name Add Organization' do
    log_in people(:Rick)
    visit organizations_path
    click_button 'Add New Organization'
    click_on 'Save'
    find('.form-group', text: 'Short Name').assert_text("Can't be blank")
  end

  test 'Kevin cant!' do
    log_in people(:Kevin)
    visit organizations_path
    assert_no_selector('button', text: 'Add New Organization')
    click_on 'SIL'
    assert_no_selector('.editableText')
    assert_no_selector('.addIconButton')
    assert_no_selector('.deleteIconButton')
  end

  test 'Drew cant!' do
    log_in people(:Drew)
    visit organization_path(@sil)
    assert_no_selector('.deleteIconButton')
  end
end
