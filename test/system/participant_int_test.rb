require 'application_system_test_case'

class ParticipantIntTest < ApplicationSystemTestCase
  def setup
    log_in people(:Rick)
    @zulgo_program = programs :Zulgo
    @zulgo_ezra = translation_activities :ZulgoEzra
    @drew = people :Drew
  end

  def setup_show_page
    @drew_hdi = participants(:DrewHdi)
    visit model_path(@drew_hdi)
  end

  test "Show Page: Remove Role" do
    setup_show_page
    assert_text 'Translation Consultant'
    assert @drew_hdi.roles.include?(:TranslationConsultant)
    action_bar_click_edit
    within('table', text: 'Translation Consultant') { click_icon('deleteIcon') }
    click_on 'Save'
    assert_no_text 'Translation Consultant'
    @drew_hdi.reload
    refute @drew_hdi.roles.include?(:TranslationConsultant)
  end

  test "Show Page: Add Role" do
    setup_show_page
    assert_no_text 'Linguist'
    refute @drew_hdi.roles.include?(:Linguist)
    action_bar_click_edit
    within('table', text: 'Translation Consultant') do
      find('select').select('Linguist')
      click_icon('addIcon')
    end
    click_on 'Save'
    assert_text 'Linguist'
    @drew_hdi.reload
    assert @drew_hdi.roles.include?(:Linguist)
  end

  test "Add Activity" do
    postpone_failure(Date.new(2019, 2, 8))
    # setup_show_page
    # find('h3', text: 'Activities').click_on('Edit')
    # select 'Genesis', from: 'activity_id'
    # click_button 'Add'
    # within('div.showable-form-section', text: 'Activities') do
    #   assert_text 'Genesis'
    # end
  end

  test "Remove Activity" do
    postpone_failure(Date.new(2019, 2, 8))
    # setup_show_page
    # find('h3', text: 'Activities').click_on('Edit')
    # find('tr', text: 'Ezra').click_on('Remove')
    # within('div.showable-form-section', text: 'Activities') do
    #   refute_text 'Ezra'
    # end
  end

  # test "Add Activity to Cluster Participant" do
  #   @drew_ndop = participants :DrewNdop
  #   @bangolan = programs :Bangolan
  #   visit participant_path @drew_ndop
  #   find('h3', text: 'Activities').click_on('Add')
  #   select 'Bangolan', from: 'activity_program_id'
  #   find("select#program_#{@bangolan.id}_activity_id").select 'Exodus'
  #   click_button 'Add'
  #   within('div.showable-form-section', text: 'Activities') do
  #     assert_text 'Bangolan'
  #     assert_text 'Exodus'
  #   end
  # end

  # test "Permissions" do
  #   setup_show_page
  #   find('h2').assert_text 'Edit'
  #   find('h2').assert_text 'Left Program'
  #   find('h3', text: 'Roles').assert_text 'Edit'
  #   find('h3', text: 'Activities').assert_text 'Edit'

  #   log_in people(:Lance)
  #   setup_show_page
  #   find('h2').assert_no_text 'Edit'
  #   find('h2').assert_no_text 'Left Program'
  #   find('h3', text: 'Roles').assert_no_text 'Edit'
  #   find('h3', text: 'Activities').assert_no_text 'Edit'
  #   visit edit_participant_path @drew_hdi
  #   assert_current_path not_allowed_path
  #   visit finish_participant_path @drew_hdi
  #   assert_current_path not_allowed_path
  # end

  test "Delete DrewHdi Participant" do
    visit "#{model_path(programs(:Hdi))}/Translation"
    assert_text 'Drew Maust'
    setup_show_page
    page.accept_confirm do
      action_bar_click_delete
    end
    visit "#{model_path(programs(:Hdi))}/Translation"
    assert_no_text 'Drew Maust'
    assert_nil Participant.find_by(id: @drew_hdi)
  end

  # test "Olga can't delete participant" do
  #   drew_hdi = participants(:DrewHdi)
  #   log_in people(:Rick)
  #   visit edit_participant_path(drew_hdi)
  #   assert page.has_button? 'Delete Drew Maust from Hdi'
  #   log_in people(:Olga)
  #   visit edit_participant_path(drew_hdi)
  #   refute page.has_button? 'Delete Drew Maust from Hdi'
  # end

  test "Add, update and remove Drew from Zulgo Ezra" do
    add_drew
    modify_drew
    remove_drew
  end

  def add_drew
    visit "#{model_path(programs(:Zulgo))}/Translation"
    within(parent(find('h3', text: 'People'))) do
       click_icon('addIcon')
       fill_in_search_input('Drew Maust')
       fill_in_date(FuzzyDate.new(2016, 7, 31))
       click_on 'Save'
    end
    assert_selector('h2', text: 'Drew Maust')
    assert_text 'Translation Consultant'
    assert_text 'Joined Program 2016-07-31'
    @drew_zulgo = Participant.find_by(person: @drew, program: @zulgo_program)
  end

  def modify_drew
    visit "#{model_path(@zulgo_program)}/Translation"
    click_link 'Drew Maust'
    action_bar_click_edit
    within('tr', text: 'Joined Program') { fill_in_date(FuzzyDate.new(2016, 8, 31)) }
    click_on 'Save'
    assert_text "2016-08-31"
  end

  def remove_drew
    visit model_path(@drew_zulgo)
    action_bar_click_edit
    within('tr', text: 'Left Program') { fill_in_date(FuzzyDate.new(2017, 7, 31)) }
    click_button 'Save'
    assert_text "Left Program 2017-07-31"
    @zulgo_program.reload
    refute @zulgo_program.current_people.include?(@drew)
  end
end