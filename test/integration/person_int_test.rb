require 'test_helper'

class PersonIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    @kevin = people :Kevin
    @rick = people :Rick
    @olga = people :Olga

  end

  test 'Kevin edits self' do
    log_in @kevin
    click_button 'Kevin'
    click_link 'My Info'
    edit_editable_text('first_name', 'Kevin', 'Da Boss')
    assert_changes_saved
    assert find('.editableText', text: 'Da Boss')
  end

  test 'Rick create William Wallace' do
    log_in @rick
    visit people_path
    click_button 'Add New Person'
    fill_in 'first_name', with: 'William'
    fill_in 'last_name', with: 'Wallace'
    check 'has_login'
    fill_in 'email', with: 'scotland_4ever@aol.com'
    click_button 'Save'

    assert_text 'William Wallace'
    assert_text 'scotland_4ever@aol.com'
    find('tr', text: 'Dulu Account').assert_text('Yes')

    @william = Person.find_by first_name: 'William'
    log_in @william
    find('#navbar').assert_text 'William'
  end

  test 'Add Organization' do
    log_in @rick
    visit person_path @rick
    within('#orgPeopleTable') do
      assert_no_selector('tr', text: 'Lutheran Bible Translators')
      find('.addIconButton').click
      edit_search_input('Lutheran Bible')
      click_button 'Save'
      assert_selector('tr', text: 'Lutheran Bible Translators')
    end
    assert_changes_saved
  end

  test "Add Role" do
    log_in @rick
    visit person_path @kevin
    roles_div = find('div#rolesTable')
    within roles_div do 
      find('.addIconButton').click
      select 'Dulu Admin'
      click_on 'Add'
    end 
    assert_changes_saved
    roles_div.assert_text('Dulu Admin')
  end

  test "Remove Role" do
    log_in @rick
    visit person_path @olga
    within('tr', text: 'Language Program Facilitator') do
      find('.deleteIconButton').click
    end
    assert_changes_saved
    refute_text 'Language Program Facilitator'
  end

  test "Rick delete Olga" do
    log_in @rick
    visit person_path @olga
    assert_text 'Nka, Olga'
    find('h3 .deleteIconButton').click
    click_danger_button
    assert_no_text 'Nka, Olga'
  end

  test "Olga can't delete Kevin" do
    log_in @rick
    visit person_path(@kevin)
    assert_selector('h3 .deleteIconButton')

    log_in @olga
    visit person_path(@kevin)
    assert_no_selector('h3 .deleteIconButton')
  end
end