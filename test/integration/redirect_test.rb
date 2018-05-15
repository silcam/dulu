require 'test_helper'

class RedirectTest < Capybara::Rails::TestCase
  def setup
    @rick = people :Rick
  end

  # TODO - determine the future of these redirects
  test 'Think about the future of redirects' do
    assert(Date.today < Date.new(2018, 9, 15), 'Think about restoring RedirectTest')
  end
  # test "Follows Redirect" do
  #   log_in @rick
  #   visit edit_person_path(@rick, referred_by: events_path)
  #   click_on 'Save'
  #   assert_current_path events_path
  # end

  # test "Follows Default in absence of Redirect" do
  #   log_in @rick
  #   visit edit_person_path(@rick)
  #   click_on 'Save'
  #   assert_current_path person_path(@rick)
  # end

  # test "Does not use expired redirects" do
  #   log_in @rick
  #   visit organizations_path # Random path
  #   click_on 'Rick' # Stores redirect to organizations_path
  #   visit edit_event_path(Event.first)
  #   click_on 'Save'
  #   assert_current_path events_path # And not the organizations path
  #   assert page.has_content? 'Past Events'  # We should be on Events index, not back on the form due to validation failure
  # end
end