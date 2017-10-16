require 'test_helper'

class EventsIntegrationTest < Capybara::Rails::TestCase
  def my_setup(need_js=false, user=:Drew)
    Capybara.current_driver = :selenium if need_js
    log_in people(user)
    @hdi = programs :HdiProgram
    @genesis_consult = events :HdiGenesisChecking
    visit program_events_path(@hdi)
  end

  test "New Minimal Event" do
    my_setup
    click_on 'New Event'
    fill_in 'Name', with: 'Taco Party'
    fill_in_date 'event_start_date', FuzzyDate.new(2017)
    fill_in_date 'event_end_date', FuzzyDate.new(2017)
    click_on 'Save'
    assert_current_path dashboard_program_path(@hdi)
    event_panel = newest_event_panel
    assert event_panel.has_content?('Taco Party'), "Expect to see new event name"
    assert event_panel.has_content?('2017'), "Expect to see new event date"
    assert event_panel.has_content?('Hdi'), "Expect to see new event program"
  end

  test "New Event with Bells and Whistles" do
    my_setup true
    click_on 'New Event'
    fill_in 'Name', with: "Taco Party"
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 7, 1)
    fill_in_date 'event_end_date', FuzzyDate.new(2017, 8, 1)
    click_on 'Add Program'
    within newest_program_select_div do
      select 'Ewondo', from: 'event_program_ids_'
    end
    within newest_person_select_div do
      select 'Drew Maust', from: 'event_new_event_participants__person_id'
      select 'Translation Consultant', from: 'event_new_event_participants__program_role_id'
    end
    click_on 'Add a person'
    within newest_person_select_div do
      select 'Abanda Dunno', from: 'event_new_event_participants__person_id'
    end
    click_on 'Save'
    event_panel = newest_event_panel
    assert event_panel.has_content?('Hdi'), "Should see all programs"
    assert event_panel.has_content?('Ewondo'), "Should see all programs"
    assert event_panel.has_content?('Drew Maust'), "Should see all people"
    assert event_panel.has_content?('Abanda'), "Should see all people"
  end

  def setup_edit(need_js=false)
    my_setup need_js
    click_edit_for @genesis_consult
    @abanda = event_participants :AbandaHdiGenesis
  end

  test "Edit Event Name" do
    setup_edit
    fill_in 'Name', with: 'Taco Party'
    click_on 'Save'
    assert event_panel_for(@genesis_consult).has_content?('Taco Party'), "Should see new name"
  end

  test "Edit Event Dates" do
    setup_edit
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 2)
    fill_in_date 'event_end_date', FuzzyDate.new(2017, 2)
    click_on 'Save'
    assert event_panel_for(@genesis_consult).has_content?('Feb'), "Should see event's new date"
  end

  test "Remove Event Program" do
    setup_edit true
    within(:css, 'div#program-ids'){ click_on 'Remove'}
    fill_in 'Name', with: 'Genesis Consult'
    sleep 0.3
    click_on 'Save'
    refute page.has_content?('Genesis Consult'), "Should no longer see dissassociated event"
    visit events_path
    refute event_panel_for(@genesis_consult).has_content?('Hdi'), "Should not see Hdi listed for event"
  end

  test "Change Event Program" do
    setup_edit
    fill_in 'Name', with: 'Genesis Checking' # Name has 'Hdi' in it
    within newest_program_select_div do
      select 'Ewondo', from: 'event_program_ids_'
    end
    click_on 'Save'
    visit program_events_path(programs(:EwondoProgram))
    event_panel = event_panel_for @genesis_consult
    assert event_panel.has_content?('Ewondo'), "Should see new program name"
    refute event_panel.has_content?('Hdi'), "SHould not see old program name"
  end

  test "Add Event Program" do
    setup_edit true
    click_on 'Add Program'
    within newest_program_select_div(:edit) do
      select 'Ewondo', from: 'event_program_ids_'
    end
    click_on 'Save'
    event_panel = event_panel_for @genesis_consult
    assert event_panel.has_content?('Ewondo'), "SHould see new program name"
    assert event_panel.has_content?('Hdi'), "Should see noew program name"
  end

  test "Remove Abanda" do
    setup_edit true
    within(:css, "div#person-select-#{@abanda.id}") do
      click_on 'Remove'
    end
    sleep 0.3 # Give time for the form element to be deleted
    click_on 'Save'
    event_panel = event_panel_for @genesis_consult
    assert event_panel.has_content?('Drew'), "SHould still see Drew"
    refute event_panel.has_content?('Abanda'), "SHouldn't see Abanda's name"
  end

  test "Change Abanda's Role" do
    setup_edit
    select 'Translation Consultant', from: "event_event_participant_#{@abanda.id}_program_role_id"
    click_on 'Save'
    @abanda.reload
    assert_equal program_roles(:TranslationConsultant), @abanda.program_role
  end

  test "Switch Rick for Abanda" do
    setup_edit
    select 'Rick Conrad', from: "event_event_participant_#{@abanda.id}_person_id"
    click_on 'Save'
    event_panel = event_panel_for @genesis_consult
    assert event_panel.has_content?('Rick'), "SHould see Rick now"
    refute event_panel.has_content?('Abanda'), "SHouldn't see Abanda's name"
  end

  test "Add Rick" do
    setup_edit true
    click_on 'Add a person'
    within newest_person_select_div do
      select 'Rick Conrad', from: 'event_new_event_participants__person_id'
    end
    click_on 'Save'
    assert event_panel_for(@genesis_consult).has_content?('Rick'), "Should see Rick now"
  end

  test "Delete Event" do
    my_setup true
    assert page.has_content?('Hdi Genesis Checking'), "Should see the event before deletion"
    click_edit_for @genesis_consult
    click_button 'Delete this event'
    page.accept_alert
    assert_current_path program_events_path(@hdi)
    refute page.has_content?('Hdi Genesis Checking'), "Should no longer see deleted event"
  end

  test "Can't make New Event with End Date before Start Date" do
    my_setup
    click_on 'New Event'
    fill_in_date 'event_start_date', FuzzyDate.new(2017,8, 1)
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 7, 31)
    click_on 'Save'
    assert_current_path program_events_path(@hdi)
    assert error_message_with('End date'), "Should see date error"
  end

  test "Valid User" do
    my_setup
    assert page.has_content?('New Event'), "Drew should see New Event link"
    assert page.has_content?('Edit'), "Drew should see Edit links"
  end

  test "Invalid User" do
    my_setup false, :Kevin
    refute page.has_content?('New Event'), "Kevin should see New Event link"
    refute page.has_content?('Edit'), "Kevin should not see edit links"
    visit new_program_event_path(@hdi)
    assert_current_path not_allowed_path
    visit edit_event_path(@genesis_consult)
    assert_current_path not_allowed_path
  end

  def click_edit_for event
    within(:css, "div#event-panel-#{event.id}") {click_on 'Edit'}
  end

  def newest_program_select_div(action=:new)
    divs = find_all(:css, 'div.program-select')
    (action==:edit) ? divs.last : divs[divs.count-2]
  end

  def newest_person_select_div
    find_all(:css, 'div.person-select').last
  end

  def event_panel_for event
    find(:css, "div#event-panel-#{event.id}")
  end

  def newest_event_panel
    new_event = Event.last
    event_panel_for new_event
  end

end
