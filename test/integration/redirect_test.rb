require 'test_helper'

class RedirectTest < Capybara::Rails::TestCase
  def setup
    @rick = people :Rick
  end

  test "Follows Redirect" do
    log_in @rick
    visit edit_person_path(@rick, referred_by: events_path)
    click_on 'Save'
    assert_current_path events_path
  end

  test "Follows Default in absence of Redirect" do
    log_in @rick
    visit edit_person_path(@rick)
    click_on 'Save'
    assert_current_path people_path
  end

  test "Does not use expired redirects" do
    log_in_luke
    visit standard_charge_notes_path
    click_on 'Welcome, Luke' #Stores redirect to standard_charge_notes_path
    visit new_vacation_path
    click_on 'Save'
    assert_current_path vacations_path
    refute page.has_css?('form#new_vacation')
  end
end