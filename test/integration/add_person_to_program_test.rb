require 'test_helper'

class AddPersonToProgram < Capybara::Rails::TestCase
  def setup
    log_in people(:Rick)
    @zulgo_program = programs :ZulgoProgram
    @zulgo_ezra = translation_activities :ZulgoEzraActivity
    @drew = people :Drew
  end

  test "Regression Test: Add to program with no activities" do
    ewondo_program = programs :EwondoProgram
    assert ewondo_program.activities.empty?, "This test is for a program with no activities"
    visit new_program_participant_path(ewondo_program)
    assert_current_path new_program_participant_path(ewondo_program)
  end

  test 'Add, update and remove Drew from Zulgo Ezra' do
    add_drew
    modify_drew
    remove_drew
  end

  def add_drew
    visit program_participants_path @zulgo_program
    click_link 'Add a person'
    select 'Maust, Drew', from: 'participant_person_id'
    # select 'Translation Consultant', from: 'participant_program_role_id'
    fill_in_date('participant_start_date', FuzzyDate.new(2016, 7, 31))
    check 'Ezra'
    click_button 'Save'

    @drew_zulgo = Participant.find_by(person: @drew, program: @zulgo_program)
    assert_current_path participant_path(@drew_zulgo)
    select 'Translation Consultant', from: 'role'
    click_button 'Add'

    @drew_zulgo.reload
    assert_equal 'TranslationConsultant', @drew_zulgo.roles_field
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

    @drew_zulgo.reload
    assert_equal '2016-08-31', @drew_zulgo.start_date
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

    @drew_zulgo.reload
    assert_equal '2017-07-31', @drew_zulgo.end_date
    refute_includes @zulgo_program.current_participants, @drew_zulgo
    refute page_has_link?(finish_participant_path(@drew_zulgo)),
                         "Remove link should not show after person is removed"
  end
end