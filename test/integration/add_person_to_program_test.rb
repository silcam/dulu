require 'test_helper'

class AddPersonToProgram < Capybara::Rails::TestCase
  def setup
    log_in people(:Rick)
    @zulgo_program = programs :ZulgoProgram
    @zulgo_ezra = translation_activities :ZulgoEzraActivity
    @drew = people :Drew
  end

  test 'Add, update and remove Drew from Zulgo Ezra' do
    add_drew
    modify_drew
    remove_drew
  end

  def add_drew
    visit program_path @zulgo_program
    click_link 'Add Person'
    select 'Maust, Drew', from: 'participant_person_id'
    select 'Translation Consultant', from: 'participant_program_role_id'
    fill_in 'participant_start_date_y', with: '2016'
    fill_in 'participant_start_date_m', with: '7'
    fill_in 'participant_start_date_d', with: '31'
    check 'Ezra'
    click_button 'Save'

    @drew_zulgo = Participant.find_by(person: @drew, program: @zulgo_program)
    refute_nil @drew_zulgo
    assert_equal program_roles(:TranslationConsultant), @drew_zulgo.program_role
    assert_equal '2016-07-31', @drew_zulgo.start_date
    assert page.has_content? 'Drew Maust'
    visit translation_activity_path @zulgo_ezra
    assert page.has_content? 'Drew Maust'
    visit program_path @zulgo_program
    assert page.has_content? 'Drew Maust'
    assert page.has_content? 'SIL'
  end

  def modify_drew
    visit program_path @zulgo_program
    click_link 'Manage'
    click_link_to edit_participant_path(@drew_zulgo)
    select 'Translator', from: 'participant_program_role_id'
    fill_in 'participant_start_date_m', with: '8'
    uncheck 'Ezra'
    click_button 'Save'

    @drew_zulgo.reload
    assert_equal program_roles(:Translator), @drew_zulgo.program_role
    assert_equal '2016-08-31', @drew_zulgo.start_date
    visit translation_activity_path @zulgo_ezra
    refute page.has_content? 'Drew Maust'
  end

  def remove_drew
    visit program_path @zulgo_program
    click_link 'Manage'
    click_link_to finish_participant_path(@drew_zulgo)
    fill_in 'participant_end_date_y', with: '2017'
    fill_in 'participant_end_date_m', with: '7'
    fill_in 'participant_end_date_d', with: '31'
    click_button 'Save'

    @drew_zulgo.reload
    assert_equal '2017-07-31', @drew_zulgo.end_date
    refute_includes @zulgo_program.current_participants, @drew_zulgo
    refute page_has_link?(finish_participant_path(@drew_zulgo)),
                         "Remove link should not show after person is removed"
    visit program_path @zulgo_program
    refute page.has_content? 'Drew Maust'
  end
end