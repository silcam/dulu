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
    click_link 'Kevin'
    fill_in 'First Name', with: 'William'
    fill_in 'Last Name', with: 'Wallace'
    click_button 'Save'

    find('#navbar').assert_text 'William'
  end

  test 'Rick create William Wallace' do
    log_in @rick
    visit people_path
    click_link 'Add Person'
    fill_in_william
    click_button 'Save'

    assert_text 'William Wallace'
    assert_text 'AAA'
    assert_text 'scotland_forever@aol.com'

    @william = Person.find_by first_name: 'William'
    log_in @william
    find('#navbar').assert_text 'William'
  end

  test "Add Role" do
    log_in @rick
    visit person_path @kevin
    find('h3', text: 'Roles').click_on 'Add'
    select 'Dulu Admin', from: 'person_role_role'
    click_on 'Add'
    within('div.showable-form-section') do
      assert_text 'Dulu Admin'
    end
  end

  test "Remove Role" do
    log_in @rick
    visit person_path @olga
    find('h3', text: 'Roles').click_on 'Edit'
    within('div.showable-form-section') do
      find('tr', text: 'Language Program Facilitator').click_on 'Remove'
    end
    within('div.showable-form-section') do
      assert_no_text 'Language Program Facilitator'
      assert_text 'None'
    end
  end

  test "Rick delete Olga" do
    log_in @rick
    visit people_path
    click_on 'Nka, Olga'
    find('h2').click_on 'Edit'
    click_on 'Delete Olga Nka'
    page.driver.browser.accept_js_confirms
    assert_current_path people_path
    assert_no_text 'Nka, Olga'
  end

  test "Olga can't delete Kevin" do
    log_in @rick
    visit edit_person_path(@kevin)
    assert_selector('input[value="Delete Kevin Bradford"]')

    log_in @olga
    visit edit_person_path(@kevin)
    assert_no_selector('input[value="Delete Kevin Bradford"]')
  end

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