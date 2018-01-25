require 'test_helper'

class ParticipantIntTest < Capybara::Rails::TestCase
  def setup
    Capybara.current_driver = :webkit
    log_in people(:Rick)
    @zulgo_program = programs :Zulgo
    @zulgo_ezra = translation_activities :ZulgoEzra
    @drew = people :Drew
  end

  test "Regression Test: Add to program with no activities" do
    ewondo_program = programs :Ewondo
    assert ewondo_program.activities.empty?, "This test is for a program with no activities"
    visit new_program_participant_path(ewondo_program)
    assert_current_path new_program_participant_path(ewondo_program)
  end

  def setup_show_page
    @drew_hdi = participants(:DrewHdi)
    visit participant_path(@drew_hdi)
  end

  test "Show Page: Remove Role...Add Role" do
    setup_show_page
    find('h3', text: 'Roles').click_on('Edit')
    find('tr', text: 'Translation Consultant').click_on('Remove')
    within('div.showable-form-section', text: 'Roles') do
      assert_text 'None'
      refute_text 'Translation Consultant'
    end

    find('h3', text: 'Roles').click_on('Add')
    select 'Translation Consultant', from: 'role'
    click_button 'Add'
    within('div.showable-form-section', text: 'Roles') do
      assert_text 'Translation Consultant'
    end
  end

  test "Add Activity" do
    setup_show_page
    find('h3', text: 'Activities').click_on('Edit')
    select 'Genesis', from: 'activity_id'
    click_button 'Add'
    within('div.showable-form-section', text: 'Activities') do
      assert_text 'Genesis'
    end
  end

  test "Remove Activity" do
    setup_show_page
    find('h3', text: 'Activities').click_on('Edit')
    find('tr', text: 'Ezra').click_on('Remove')
    within('div.showable-form-section', text: 'Activities') do
      refute_text 'Ezra'
    end
  end

  test "Add Activity to Cluster Participant" do
    @drew_ndop = participants :DrewNdop
    @bangolan = programs :Bangolan
    visit participant_path @drew_ndop
    find('h3', text: 'Activities').click_on('Add')
    select 'Bangolan', from: 'activity_program_id'
    find("select#program_#{@bangolan.id}_activity_id").select 'Exodus'
    click_button 'Add'
    within('div.showable-form-section', text: 'Activities') do
      assert_text 'Bangolan'
      assert_text 'Exodus'
    end
  end

  test "Permissions" do
    setup_show_page
    find('h2').assert_text 'Edit'
    find('h2').assert_text 'Left Program'
    find('h3', text: 'Roles').assert_text 'Edit'
    find('h3', text: 'Activities').assert_text 'Edit'

    log_in people(:Lance)
    setup_show_page
    find('h2').assert_no_text 'Edit'
    find('h2').assert_no_text 'Left Program'
    find('h3', text: 'Roles').assert_no_text 'Edit'
    find('h3', text: 'Activities').assert_no_text 'Edit'
    visit edit_participant_path @drew_hdi
    assert_current_path not_allowed_path
    visit finish_participant_path @drew_hdi
    assert_current_path not_allowed_path
  end

  test "Delete DrewHdi Participant" do
    visit program_participants_path(programs(:Hdi))
    find('table').assert_text 'Drew Maust'
    setup_show_page
    find('h2').click_on('Edit')
    click_button('Delete Drew Maust from Hdi')
    page.driver.browser.accept_js_confirms
    assert_current_path program_participants_path(programs(:Hdi))
    find('table').assert_no_text('Drew Maust')
  end

  test "Olga can't delete participant" do
    drew_hdi = participants(:DrewHdi)
    log_in people(:Rick)
    visit edit_participant_path(drew_hdi)
    assert page.has_button? 'Delete Drew Maust from Hdi'
    log_in people(:Olga)
    visit edit_participant_path(drew_hdi)
    refute page.has_button? 'Delete Drew Maust from Hdi'
  end

  test "Add, update and remove Drew from Zulgo Ezra" do
    add_drew
    modify_drew
    remove_drew
  end

  def add_drew
    visit program_participants_path @zulgo_program
    click_link 'Add a person'
    select 'Maust, Drew', from: 'participant_person_id'
    fill_in_date('participant_start_date', FuzzyDate.new(2016, 7, 31))
    check 'Ezra'
    click_button 'Save'

    # @drew_zulgo = Participant.find_by(person: @drew, program: @zulgo_program)
    # assert_current_path participant_path(@drew_zulgo)
    find('h2').assert_text 'Drew Maust'
    find('h3', text: 'Roles').click_on 'Add'
    select 'Translation Consultant', from: 'role'
    click_button 'Add'

    @drew_zulgo = Participant.find_by(person: @drew, program: @zulgo_program)
    # assert_equal '|TranslationConsultant|', @drew_zulgo.roles_field
    assert_equal '2016-07-31', @drew_zulgo.start_date
    assert page.has_content? 'Drew Maust'
    visit translation_activity_path @zulgo_ezra
    assert page.has_content? 'Drew Maust'
    visit program_participants_path @zulgo_program
    assert page.has_content? 'Drew Maust'
  end

  def modify_drew
    visit program_participants_path @zulgo_program
    within(:css, 'div#sidebar'){ click_on 'People' }
    click_link_to program_participants_path(@zulgo_program)
    click_link 'Drew Maust'
    find('h2').click_link 'Edit'
    select 'Aug', from: 'participant_start_date_m'
    uncheck 'Ezra'
    click_button 'Save'

    visit program_participants_path @zulgo_program
    find('tr', text: 'Drew Maust').assert_text 'Aug 31, 2016'
    # assert_equal '2016-08-31', @drew_zulgo.start_date
    visit translation_activity_path @zulgo_ezra
    refute page.has_content? 'Drew Maust'
  end

  def remove_drew
    visit program_participants_path @zulgo_program
    within(:css, 'div#sidebar'){ click_on 'People' }
    click_link 'Drew Maust'
    find('h2').click_link 'Left Program'
    fill_in_date('participant_end_date', FuzzyDate.new(2017, 7, 31))
    click_button 'Save'

    refute page_has_link?(finish_participant_path(@drew_zulgo)),
                         "Remove link should not show after person is removed"
    visit program_participants_path @zulgo_program
    within('tr', text: 'Drew Maust') do
      assert_text 'Aug 31, 2016' # Start date
      assert_text 'Jul 31, 2017' # End date
    end
  end
end