require 'application_system_test_case'

class EventsIntegrationTest < ApplicationSystemTestCase
  def setup
    @hdi = languages :Hdi
    @genesis_consult = events :HdiGenesisChecking
  end

  test "New Event" do
    log_in(people(:Kendall))
    visit "/events"
    find('h2', text: 'Events').find(icon_selector('addIcon')).click
    within('div#NewEventForm') do
      fill_in 'Name', with: 'Taco Party'
      within('div', text: 'Domain') { select 'Community Development', from: 'basic_select' }
      within('div', text: 'Start Date') { fill_in_date(FuzzyDate.new(2017, 7, 1)) }
      within('div', text: 'End Date') { fill_in_date(FuzzyDate.new(2017, 7, 1)) }
      fill_in 'Note', with: 'Boatloads of tacos!'
      click_on 'Save'
    end
    visit "/events/cal/2017/7"
    within(find('h4', text: 'Taco Party').find(:xpath, '..')) do
      assert_text '1 Jul 2017'
      assert_text 'Boatloads of tacos!'
    end
  end

  def setup_edit
    log_in people(:Drew)
    visit model_path(@genesis_consult)
    find(icon_selector('editIcon')).click
  end

  test "Edit Event Name" do
    setup_edit
    fill_in 'name', with: 'Taco Party'
    click_on 'Save'
    assert_selector('h2', text: 'Taco Party')
  end

  test "Edit Event Dates" do
    setup_edit
    within('label', text: 'Start Date') { fill_in_date(FuzzyDate.new(2017, 2)) }
    within('label', text: 'End Date') { fill_in_date(FuzzyDate.new(2018, 2)) }
    click_on 'Save'
    assert_text('Feb 2017')
  end

  test "Add and Remove Event Program" do
    setup_edit
    within(parent(find_by_placeholder('Add Language'))) { fill_in_search_input('Ewondo') }
    click_on 'Save'
    assert_selector('a', text: 'Ewondo')
  end

  test "Remove Event Program" do
    setup_edit
    find('tr tr', text: 'Hdi').find(icon_selector('deleteIcon')).click
    click_on 'Save'
    assert_no_text 'Hdi'
  end

  test "Add and Remove Event Cluster" do
    setup_edit
    within(parent(find_by_placeholder('Add Cluster'))) { fill_in_search_input('Ndop') }
    click_on 'Save'
    assert_selector('a', text: 'Ndop')

    find(icon_selector('editIcon')).click
    find('tr tr', text: 'Ndop').find(icon_selector('deleteIcon')).click
    click_on 'Save'
    assert_no_text 'Ndop'
  end

  test "Add Rick" do
    setup_edit
    within(parent(find_by_placeholder('Add Person'))) { fill_in_search_input('Rick Conrad') }
    within('table', text: 'Roles') do
      within('tr', text: 'Rick Conrad') do 
        find(icon_selector('addIcon')).click
        find('select').select('Facilitator')
      end
    end
    click_on "Save"
    assert_selector('a', text: 'Rick Conrad')
    assert_text('Rick Conrad (Facilitator)')
  end

  test "Remove Abanda" do
    setup_edit
    find('tr tr', text: 'Abanda').find(icon_selector('deleteIcon')).click
    assert_no_text 'Abanda'
    click_on 'Save'
    assert_no_text 'Abanda'
  end

  test "Create permission" do
    log_in people(:Lance)
    visit '/events'
    assert_selector(icon_selector('addIcon'))

    log_in people(:Kevin)
    visit '/events'
    assert_no_selector(icon_selector('addIcon'))
  end

  test "Edit and Delete Permissions" do
    log_in people(:Drew)
    visit model_path(@genesis_consult)
    assert_selector(icon_selector('editIcon'))
    assert_selector(icon_selector('deleteIcon'))

    force_log_in people(:Lance)
    visit model_path(@genesis_consult)
    find('h2', text: 'Genesis Checking')
    assert_no_selector(icon_selector('editIcon'))
    assert_no_selector(icon_selector('deleteIcon'))
  end

  test "Delete Event" do
    log_in people(:Drew)
    visit "/events/cal/2018/1"
    assert_selector('a', text: 'Genesis Checking') # Should see the event before deletion
    click_link 'Genesis Checking'
    page.accept_confirm do
      find(icon_selector('deleteIcon')).click
    end
    visit "/events/cal/2018/1"
    assert_no_selector('a', text: 'Genesis Checking') # Should no longer see deleted event
  end

  test "Delete Event I created" do
    log_in people(:Lance)
    visit "/events/cal/2019/1"
    click_link "Lance's Event"
    page.accept_confirm do
      find(icon_selector('deleteIcon')).click
    end
    visit "/events/cal/2019/1"
    assert_no_selector('a', text: "Lance's Event") # Should no longer see deleted event
  end

  test "Don't change Event Creator when updating" do
    setup_edit # Drew is logged in
    fill_in 'name', with: 'Pizza Party!'
    click_on 'Save'
    @genesis_consult.reload
    assert_equal people(:Olga), @genesis_consult.creator  # Not Drew
  end

  test "Can't make New Event with End Date before Start Date" do
    postpone_failure(Date.new(2019, 2, 15), "Event form validates end date after start date")
    # my_setup
    # click_on 'Add Event'
    # fill_in_date 'event_start_date', FuzzyDate.new(2017,8, 1)
    # fill_in_date 'event_start_date', FuzzyDate.new(2017, 7, 31)
    # click_on 'Save'
    # assert_current_path program_events_path(@hdi)
    # assert error_message_with('End date'), "Should see date error"
  end
end
