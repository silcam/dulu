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
    edit_editable_text('Kevin', 'Da Boss')
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

  test "Add Role" do
    log_in @rick
    visit person_path @kevin
    roles_div = find('div#rolesTable')
    within roles_div do 
      find('.glyphicon-plus').click
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
      find('.glyphicon-trash').click
    end
    assert_changes_saved
    refute_text 'Language Program Facilitator'
  end

  test "Rick delete Olga" do
    log_in @rick
    visit person_path @olga
    assert_text 'Nka, Olga'
    find('h3 .glyphicon-trash').click
    find('.bs-callout input[type="checkbox"]').click
    click_button 'Permanently Delete Olga Nka'
    assert_no_text 'Nka, Olga'
  end

  test "Olga can't delete Kevin" do
    log_in @rick
    visit person_path(@kevin)
    assert_selector('h3 .glyphicon-trash')

    log_in @olga
    visit person_path(@kevin)
    assert_no_selector('h3 .glyphicon-trash')
  end

  # This is no longer applicable
  # test "Edit does not delete!" do
  #   log_in @rick
  #   visit edit_person_path(@kevin)
  #   click_button 'Save'
  #   assert_current_path person_path(@kevin)
  # end

  # Edit page no longer has any effect on role. Deprecating this test
  # test 'Editing does not accidentally delete role' do
  #   log_in @olga
  #   visit edit_person_path @olga
  #   refute page.has_css? 'select#person_role'
  #   # fill_in 'First Name', with: 'OLGA!'
  #   click_button 'Save'
  #   assert_current_path people_path
  #   @olga.reload
  #   assert @olga.role_program_supervisor # This should not have changed
  # end

  def fill_in_william
    fill_in 'First Name', with: 'William'
    fill_in 'Last Name', with: 'Wallace'
    choose 'Male'
    select 'Cameroon', from: 'person_country_id'
    select 'AAA', from: 'person_organization_id'
    fill_in 'Email', with: 'scotland_forever@aol.com'
    check 'Able to log in'
    choose 'Français'
  end

  # def check_william
  #   {first_name: 'William', last_name: 'Wallace',
  #   gender: 'M', country: countries(:Cameroon),
  #   organization: organizations(:AAA),
  #   email: 'scotland_forever@aol.com',
  #   ui_language: 'fr'}.each_pair do |key, value|
  #     assert_equal value, @william.send(key)
  #   end
  # end
end