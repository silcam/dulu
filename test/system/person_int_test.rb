# frozen_string_literal: true

require 'application_system_test_case'

class PersonIntTest < ApplicationSystemTestCase
  def setup
    @kevin = people :Kevin
    @rick = people :Rick
    @olga = people :Olga
  end

  test 'Kevin edits self' do
    log_in @kevin
    click_on 'Kevin'
    action_bar_click_edit
    fill_in 'first_name', with: 'Da Boss'
    click_on 'Save'
    assert_changes_saved
    assert_selector('h2', text: 'Da Boss Barnes')
  end

  test 'Rick create William Wallace' do
    log_in @rick
    visit '/people'
    find(icon_selector('addIcon')).click
    fill_in 'First Name', with: 'William'
    fill_in 'Last Name', with: 'Wallace'
    check 'has_login'
    fill_in 'email', with: 'scotland_4ever@aol.com'
    click_button 'Save'

    assert_text 'William Wallace'
    assert_text 'scotland_4ever@aol.com'
    find('tr', text: 'Dulu Account').assert_text('Yes')
    sleep 0.2 # Necessary to prevent db rollback from deleting ol' Will before the api request for his page completes

    @william = Person.find_by first_name: 'William'
    log_in @william
    find('nav').assert_text 'William'
  end

  def main_div(name)
    parent(find('h2', text: name))
  end

  test 'Add Organization' do
    log_in @rick
    visit model_path @rick
    within(parent(main_div('Rick Conrad').find('h3', text: 'Organizations'))) do
      safe_assert_no_selector('a', text: 'Lutheran Bible Translators')
      find(icon_selector('addIcon')).click
      fill_in_search_input('Lutheran Bible Translators')
      click_on 'Save'
      assert_selector('a', text: 'Lutheran Bible Translators')
    end
  end

  test 'Add Role' do
    log_in @rick
    visit model_path @kevin
    within(parent(find('h3', text: 'Roles'))) do
      find(icon_selector('addIcon')).click
      find('select').select 'Dulu Admin'
      click_on 'Save'
    end
    assert_selector('tr', text: 'Dulu Admin')
    @kevin.reload
    assert @kevin.roles.include?(:DuluAdmin)
  end

  test 'Remove Role' do
    log_in @rick
    visit model_path @olga
    within(parent(find('h3', text: 'Roles'))) do
      page.accept_confirm do
        find('tr', text: 'Language Program Facilitator')
          .find(icon_selector('deleteIcon'))
          .click
      end
    end
    safe_assert_no_selector('tr', text: 'Language Program Facilitator')
    @olga.reload
    refute @olga.roles.include?(:LanguageProgramFacilitator)
  end

  test 'Rick delete Olga' do
    log_in @rick
    visit model_path @olga
    assert_selector('tr', text: 'Ngombo, Olga') # Sidebar list
    sleep 0.2 # Make sure ajax finishes before Olga disappears
    action_bar_click_delete
    check "I'm sure"
    click_on 'Permanently Delete Olga Ngombo'
    safe_assert_no_selector('tr', text: 'Ngombo, Olga')
    assert_nil Person.find_by(id: @olga.id)
  end

  test "Olga can't delete Kevin" do
    log_in @olga
    visit model_path(@kevin)
    assert_raises(Capybara::ElementNotFound) do
      action_bar_click_delete
    end
  end

  test 'Change my language' do
    log_in @kevin
    visit model_path(@kevin)
    find('tr', text: 'Preferred language').find('select').select('Français')
    assert_text("Pays d'origine")
    refute_text('Home Country')
  end

  test 'Unsubscribe Notification Channel' do
    nancy = people(:Nancy)
    assert_includes NotificationChannel.people_for_channels('DTra '), nancy
    log_in nancy
    visit model_path(nancy)
    find('tr', text: 'Notification Channels').click_on('Translation')
    within('tr', text: 'Notification Channels') { refute_text('Translation') }
    refute_includes NotificationChannel.people_for_channels('DTra '), nancy
  end

  test 'Subscribe Notification Channel' do
    ewondo = languages(:Ewondo)
    ndop = clusters(:Ndop)
    north = regions(:NorthRegion)
    log_in @rick
    refute_includes NotificationChannel.people_for_channels("Lng#{ewondo.id} Cls#{ndop.id} Reg#{north.id} DLit "), @rick
    visit model_path(@rick)
    find('tr', text: 'Add Channel').find('select').select('Language')
    fill_in_search_input('Ewondo')
    within('tr', text: 'Notification Channels') { assert_text('Ewondo') }
    assert_includes NotificationChannel.people_for_channels("Lng#{ewondo.id} "), @rick

    find('tr', text: 'Add Channel').find('select').select('Cluster')
    fill_in_search_input('Ndop')
    within('tr', text: 'Notification Channels') { assert_text('Ndop') }
    assert_includes NotificationChannel.people_for_channels("Cls#{ndop.id} "), @rick

    find('tr', text: 'Add Channel').find('select').select('Region')
    fill_in_search_input('North')
    within('tr', text: 'Notification Channels') { assert_text('North Region') }
    assert_includes NotificationChannel.people_for_channels("Reg#{north.id} "), @rick

    find('tr', text: 'Add Channel').find('select').select('Domain')
    find('tr', text: 'Add Channel').find('td>div>div>select').select('Literacy')
    find('button', text: 'Add').click
    within('tr', text: 'Notification Channels') { assert_text('Literacy') }
    assert_includes NotificationChannel.people_for_channels('DLit '), @rick
  end
end
