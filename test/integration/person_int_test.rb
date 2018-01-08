require 'test_helper'

class PersonIntTest < Capybara::Rails::TestCase
  def setup
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
    @kevin.reload
    assert_equal 'William', @kevin.first_name
    assert_equal 'Wallace', @kevin.last_name
  end

  test 'Rick create William Wallace' do
    log_in @rick
    visit people_path
    click_link 'Add Person'
    fill_in_william
    click_button 'Save'
    @william = Person.find_by last_name: 'Wallace'
    check_william

    visit people_path
    click_link_to person_path(@william)
    # click_link 'Edit Person'
    select 'Dulu Admin', from: 'person_role_role'
    click_button 'Add'
    assert_current_path person_path(@william)
    find('#roles-table').assert_text('Dulu Admin')

    log_in @william
    find('#navbar').assert_text 'William'
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

  def check_william
    {first_name: 'William', last_name: 'Wallace',
    gender: 'M', country: countries(:Cameroon),
    organization: organizations(:AAA),
    email: 'scotland_forever@aol.com',
    ui_language: 'fr'}.each_pair do |key, value|
      assert_equal value, @william.send(key)
    end
  end
end