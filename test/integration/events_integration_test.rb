require 'test_helper'

class EventsIntegrationTest < Capybara::Rails::TestCase
  def my_setup(need_js=false, user=:Drew)
    Capybara.current_driver = :webkit if need_js
    log_in people(user)
    @hdi = programs :HdiProgram
    @genesis_consult = events :HdiGenesisChecking
    visit program_events_path(@hdi)
  end

  test "New Event" do
    my_setup
    click_on 'Add Event'
    fill_in 'Name', with: 'Taco Party'
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 7, 1)
    fill_in_date 'event_end_date', FuzzyDate.new(2017, 7, 1)
    fill_in 'Note', with: 'Boatloads of tacos!'
    click_on 'Save'
    within :css, 'div.main' do
      assert_text 'Taco Party'
      assert_text 'Jul 1, 2017'
      assert_text 'Hdi'
      assert_text 'Boatloads of tacos!'
    end
  end

  def go_to_genesis_consult_event(need_js=false)
    @abanda = event_participants :AbandaHdiGenesis
    my_setup need_js
    click_link @genesis_consult.display_name
  end

  def setup_edit(need_js=false)
    go_to_genesis_consult_event(need_js)
    within(:css, 'h2') do
      click_link 'Edit'
    end
  end

  test "Edit Event Name" do
    setup_edit
    fill_in 'Name', with: 'Taco Party'
    click_on 'Save'
    assert page.has_content?('Taco Party'), "Should see new name"
  end

  test "Edit Event Dates" do
    setup_edit
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 2)
    fill_in_date 'event_end_date', FuzzyDate.new(2017, 2)
    click_on 'Save'
    assert page.has_content?('Feb'), "Should see event's new date"
  end

  test "Add Event Program" do
    go_to_genesis_consult_event true
    within('div#program-section') do
      click_on 'Edit'
      select 'Ewondo', from: 'event_program'
      click_on 'Add'
    end
    within(:css, 'div.main') do
      assert_text 'Ewondo'
      assert_text 'Hdi'
    end
  end

  test "Remove Event Program" do
    go_to_genesis_consult_event true
    within('div#program-section') do
      click_on 'Edit'
      find('li', text: 'Hdi').click_link('Remove')
    end
    within('div.main') do
      assert_no_text 'Hdi'
    end
    visit program_events_path(@hdi)
    refute page.has_content?('Genesis Checking'), "Should no longer see dissassociated event"
    visit events_path
    refute event_panel_for(@genesis_consult).has_content?('Hdi'), "Should not see Hdi listed for event"
  end

  test "Add and Remove Cluster" do
    go_to_genesis_consult_event true
    within('div#cluster-section') do
      click_on 'Edit'
      select 'Ndop', from: 'event_cluster'
      click_on 'Add'
    end
    within 'div.main' do
      assert_text 'Ndop'
    end

    within '#cluster-section' do
      click_on 'Edit'
      find('li', text: 'Ndop').click_link('Remove')
    end
    within 'div.main' do
      assert_no_text 'Ndop'
    end
  end

  test "Add Rick" do
    go_to_genesis_consult_event true
    within '#people-section' do
      click_on 'Edit'
      select 'Conrad, Rick', from: 'event_person_id'
      check 'Facilitator'
      click_on 'Add'
    end
    within '#people-section' do
      find('li', text: 'Rick Conrad').assert_text('Facilitator')
    end
  end

  test "Remove Abanda" do
    go_to_genesis_consult_event true
    within '#people-section' do
      click_on 'Edit'
      find('li', text: 'Abanda').click_link('Remove')
    end
    within 'div.main' do
      assert_no_text 'Abanda'
    end
  end

  test "Delete Event" do
    my_setup true
    assert page.has_content?('Hdi Genesis Checking'), "Should see the event before deletion"
    click_link 'Hdi Genesis Checking'
    find('h2').click_link 'Edit'
    click_link 'Delete this event'
    page.driver.browser.accept_js_confirms
    assert_current_path program_events_path(@hdi)
    refute page.has_content?('Hdi Genesis Checking'), "Should no longer see deleted event"
  end

  test "Can't make New Event with End Date before Start Date" do
    my_setup
    click_on 'Add Event'
    fill_in_date 'event_start_date', FuzzyDate.new(2017,8, 1)
    fill_in_date 'event_start_date', FuzzyDate.new(2017, 7, 31)
    click_on 'Save'
    assert_current_path program_events_path(@hdi)
    assert error_message_with('End date'), "Should see date error"
  end

  test "Valid User" do
    my_setup
    assert page.has_content?('Add Event'), "Drew should see New Event link"
    click_link 'Hdi Genesis Checking'
    assert page.has_content?('Edit'), "Drew should see Edit links"
  end

  test "Invalid User" do
    my_setup false, :Kevin
    refute page.has_content?('New Event'), "Kevin should see New Event link"
    click_link 'Hdi Genesis Checking'
    refute page.has_content?('Edit'), "Kevin should not see edit links"
    visit new_program_event_path(@hdi)
    assert_current_path not_allowed_path
    visit edit_event_path(@genesis_consult)
    assert_current_path not_allowed_path
  end

  def newest_program_select_div(action=:new)
    divs = find_all(:css, 'div.program-select')
    (action==:edit) ? divs.last : divs[divs.count-2]
  end

  def newest_cluster_select_div(action=:new)
    divs = find_all(:css, 'div.cluster-select')
    (action==:edit) ? divs.last : divs[divs.count-2]
  end

  def newest_person_select_div
    find_all(:css, 'div.person-select').last
  end

  def event_panel_for event
    find(:css, "div#event-panel-#{event.id}")
  end

end
