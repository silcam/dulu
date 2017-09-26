require 'test_helper'

class PersonIntTest < Capybara::Rails::TestCase
  def setup
    @kevin = people :Kevin
    @rick = people :Rick

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
    click_link 'Edit Person'
    select 'Site Administrator', from: 'person_role'
    click_button 'Save'
    @william.reload
    assert @william.has_role(:role_site_admin), "William should be site admin"

    log_in @william
    assert page.has_content? 'William'
  end

  def fill_in_william
    fill_in 'First Name', with: 'William'
    fill_in 'Last Name', with: 'Wallace'
    choose 'Male'
    select 'Cameroon', from: 'person_country_id'
    select 'AAA', from: 'person_organization_id'
    fill_in 'Email', with: 'scotland_forever@aol.com'
    select 'User', from: 'person_role'
    choose 'Français'
  end

  def check_william
    {first_name: 'William', last_name: 'Wallace',
    gender: 'M', country: countries(:Cameroon),
    organization: organizations(:AAA),
    email: 'scotland_forever@aol.com', role_user: true,
    ui_language: 'fr'}.each_pair do |key, value|
      assert_equal value, @william.send(key)
    end
  end
end